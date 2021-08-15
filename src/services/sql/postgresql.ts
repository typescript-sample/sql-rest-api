import {Pool} from 'pg';

export interface StringMap {
  [key: string]: string;
}
export interface Statement {
  query: string;
  params?: any[];
}

export interface Manager {
  exec(sql: string, args?: any[]): Promise<number>;
  execBatch(statements: Statement[]): Promise<number>;
  query<T>(sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T[]>;
  queryOne<T>(sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T>;
  execScalar<T>(sql: string, args?: any[]): Promise<T>;
  count(sql: string, args?: any[]): Promise<number>;
}
export class PoolManager implements Manager {
  constructor(public pool: Pool) {
    this.exec = this.exec.bind(this);
    this.execBatch = this.execBatch.bind(this);
    this.query = this.query.bind(this);
    this.queryOne = this.queryOne.bind(this);
    this.execScalar = this.execScalar.bind(this);
    this.count = this.count.bind(this);
  }
  exec(sql: string, args?: any[]): Promise<number> {
    return exec(this.pool, sql, args);
  }
  execBatch(statements: Statement[]): Promise<number> {
    return execute(this.pool, statements);
  }
  query<T>(sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T[]> {
    return query(this.pool, sql, args, m, fields);
  }
  queryOne<T>(sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T> {
    return queryOne(this.pool, sql, args, m, fields);
  }
  execScalar<T>(sql: string, args?: any[]): Promise<T> {
    return execScalar<T>(this.pool, sql, args);
  }
  count(sql: string, args?: any[]): Promise<number> {
    return count(this.pool, sql, args);
  }
}
export async function execute(pool: Pool, statements: Statement[]): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const arrPromise = statements.map((item) => client.query(item.query, item.params ? item.params : []));
    let c = 0;
    await Promise.all(arrPromise).then(results => {
      for (const obj of results) {
        c += obj.rowCount;
      }
    });
    await client.query('commit');
    return c;
  } catch (e) {
    await client.query('rollback');
    throw e;
  } finally {
    client.release();
  }
}
export function exec(pool: Pool, sql: string, args?: any[]): Promise<number> {
  const p = toArray(args);
  return new Promise<number>((resolve, reject) => {
    return pool.query(sql, p, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(results.rowCount);
      }
    });
  });
}
export function query<T>(pool: Pool, sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T[]> {
  const p = toArray(args);
  return new Promise<T[]>((resolve, reject) => {
    return pool.query<T>(sql, p, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(handleResults(results.rows, m, fields));
      }
    });
  });
}
export function queryOne<T>(pool: Pool, sql: string, args?: any[], m?: StringMap, fields?: string[]): Promise<T> {
  return query<T>(pool, sql, args, m, fields).then(r => {
    return (r && r.length > 0 ? r[0] : null);
  });
}
export function execScalar<T>(pool: Pool, sql: string, args?: any[]): Promise<T> {
  return queryOne<T>(pool, sql, args).then(r => {
    if (!r) {
      return null;
    } else {
      const keys = Object.keys(r);
      return r[keys[0]];
    }
  });
}
export function count(pool: Pool, sql: string, args?: any[]): Promise<number> {
  return execScalar<number>(pool, sql, args);
}

export function toArray<T>(arr: T[]): T[] {
  if (!arr || arr.length === 0) {
    return [];
  }
  const p: T[] = [];
  const l = arr.length;
  for (let i = 0; i < l; i++) {
    if (arr[i] === undefined) {
      p.push(null);
    } else {
      p.push(arr[i]);
    }
  }
  return p;
}
export function handleResults<T>(r: T[], m?: StringMap, fields?: string[]) {
  if (m) {
    const res = mapArray(r, m);
    if (fields && fields.length > 0) {
      return handleBool(res, fields);
    } else {
      return res;
    }
  } else {
    if (fields && fields.length > 0) {
      return handleBool(r, fields);
    } else {
      return r;
    }
  }
}
export function handleBool<T>(objs: T[], fields: string[]) {
  if (!fields || fields.length === 0 || !objs) {
    return objs;
  }
  for (const obj of objs) {
    for (const field of fields) {
      const v = obj[field];
      if (typeof v !== 'boolean' && v != null && v !== undefined) {
        // tslint:disable-next-line:triple-equals
        obj[field] = ('1' == v || 't' === v || 'y' === v);
      }
    }
  }
  return objs;
}
export function map<T>(obj: T, m?: StringMap): any {
  if (!m) {
    return obj;
  }
  const mkeys = Object.keys(m);
  if (mkeys.length === 0) {
    return obj;
  }
  const obj2: any = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    let k0 = m[key];
    if (!k0) {
      k0 = key;
    }
    obj2[k0] = obj[key];
  }
  return obj2;
}
export function mapArray<T>(results: T[], m?: StringMap): T[] {
  if (!m) {
    return results;
  }
  const mkeys = Object.keys(m);
  if (mkeys.length === 0) {
    return results;
  }
  const objs = [];
  const length = results.length;
  for (let i = 0; i < length; i++) {
    const obj = results[i];
    const obj2: any = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      let k0 = m[key];
      if (!k0) {
        k0 = key;
      }
      obj2[k0] = (obj as any)[key];
    }
    objs.push(obj2);
  }
  return objs;
}
