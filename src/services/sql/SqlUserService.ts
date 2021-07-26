import {Pool} from 'pg';
import {User} from '../../models/User';
import {exec, query, queryOne, StringMap} from './postgresql';

export const dateMap: StringMap = {
  date_of_birth: 'dateOfBirth',
};
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
    return exec(this.pool, `INSERT INTO users (id, username, email, phone, date_of_birth) VALUES ($1, $2, $3, $4, $5)`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  update(user: User): Promise<number> {
    return exec(this.pool, `UPDATE users SET username=$2, email=$3, phone=$4, date_of_birth= $5 WHERE id = $1`,
     [user.id, user.username, user.email, user.phone, user.dateOfBirth]);
  }
  delete(id: string): Promise<number> {
    return exec(this.pool, `DELETE FROM users WHERE id = $1`, [id]);
  }
}
