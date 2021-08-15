import {HealthController} from 'express-ext';
import {UserController} from './controllers/UserController';

export interface ApplicationContext {
  health: HealthController;
  user: UserController;
}
