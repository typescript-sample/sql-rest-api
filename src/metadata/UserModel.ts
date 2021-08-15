import {Model} from 'query-core';

export const userModel: Model = {
  name: 'user',
  attributes: {
    id: {
      key: true,
      match: 'equal'
    },
    username: {
      match: 'contain'
    },
    email: {
      format: 'email',
      required: true
    },
    phone: {
      format: 'phone',
      required: true
    },
    dateOfBirth: {
      type: 'datetime',
      field: 'date_of_birth'
    }
  }
};
