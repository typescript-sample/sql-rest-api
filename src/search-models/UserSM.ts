import {DateRange, SearchModel} from 'express-ext';

export interface UserSM extends SearchModel {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: DateRange;
}
