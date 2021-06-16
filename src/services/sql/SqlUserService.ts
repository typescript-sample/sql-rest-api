import {User} from '../../models/User';
import {Pool} from 'pg';

export const pool = new Pool ({
  user:'postgres',
  host: 'localhost',
  password: '123',
  database: 'master-data',
  port: 5432
}); 

export class SqlUserService {
  constructor() {
  }
  all(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results.rows as any);
        }
      })
    });
  }
  load(id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      pool.query('SELECT * FROM users WHERE id = $1', 
      [id],  (err, results) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results.rows as any);
        }
      })
    });
  }
  insert(user: User): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      pool.query('INSERT INTO users (id, username, email, phone, "dateOfBirth") VALUES ($1, $2, $3, $4, $5)', 
      [user.id, user.username, user.email, user.phone, user.dateOfBirth],  (err, results) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results.rowCount);
        }
      })
    });
  }
  update(user: User): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      pool.query('UPDATE users SET username=$2, email=$3, phone=$4, "dateOfBirth"= $5 WHERE id = $1', 
      [user.id, user.username, user.email, user.phone, user.dateOfBirth],  (err, results) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results.rowCount);
        }
      })
    });
  }
  delete(id: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      pool.query('DELETE FROM users WHERE id = $1', 
      [id],  (err, results) => {
        if (err) {
          return reject(err);
        }
        else{
          return resolve(results.rowCount);
        }
      })
    });
  }
}
