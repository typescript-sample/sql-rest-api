import {User} from '../../models/User';
import {Pool} from 'pg';
import {dateMap, exec, query, queryOne} from './postgresql';

export class SqlUserService {
  constructor(private pool: Pool) {
  }
  all(): Promise<User[]> {
    return query<User>(this.pool, 'SELECT * FROM users ORDER BY id ASC', undefined, dateMap);
  }
  load(id: string): Promise<User> {
    return queryOne(this.pool, 'SELECT * FROM users WHERE id = $1', [id], dateMap);
  }
  insert(user: User): Promise<number> {
    return exec(this.pool, `INSERT INTO users (id, username, email, phone, dateofbirth) VALUES ($1, $2, $3, $4, $5)`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  update(user: User): Promise<number> {
    return exec(this.pool, `UPDATE users SET username=$2, email=$3, phone=$4, dateofbirth= $5 WHERE id = $1`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  delete(id: string): Promise<number> {
    return exec(this.pool, `DELETE FROM users WHERE id = $1`, [id]);
  }

}
