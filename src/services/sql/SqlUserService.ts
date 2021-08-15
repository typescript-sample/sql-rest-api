import {Pool} from 'pg';
import {exec, param, query, queryOne, StringMap} from 'postgre';
import {Attribute, buildMap, buildToDelete, buildToInsert, buildToUpdate, keys, select} from 'query-core';
import {userModel} from '../../metadata/UserModel';
import {User} from '../../models/User';

export class SqlUserService {
  private keys: Attribute[];
  private map: StringMap;
  constructor(private pool: Pool) {
    this.keys = keys(userModel.attributes);
    this.map = buildMap(userModel.attributes);
  }
  all(): Promise<User[]> {
    return query<User>(this.pool, 'select * from users order by id asc', undefined, this.map);
  }
  load(id: string): Promise<User> {
    const stmt = select(id, 'users', this.keys, param);
    return queryOne(this.pool, stmt.query, stmt.params, this.map);
  }
  insert(user: User): Promise<number> {
    const stmt = buildToInsert(user, 'users', userModel.attributes, param);
    return exec(this.pool, stmt.query, stmt.params);
  }
  update(user: User): Promise<number> {
    const stmt = buildToUpdate(user, 'users', userModel.attributes, param);
    return exec(this.pool, stmt.query, stmt.params);
  }
  patch(user: User): Promise<number> {
    const stmt = buildToUpdate(user, 'users', userModel.attributes, param);
    return exec(this.pool, stmt.query, stmt.params);
  }
  delete(id: string): Promise<number> {
    const stmt = buildToDelete(id, 'users', this.keys, param);
    return exec(this.pool, stmt.query, stmt.params);
  }
}
