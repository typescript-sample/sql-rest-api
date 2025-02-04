# sql-rest-api

## How to run
#### Clone the repository
```shell
git clone https://github.com/typescript-tutorial/sql-rest-api.git
cd sql-rest-api
```

#### To run the application
```shell
npm start
```

## API Design
### Common HTTP methods
- GET: retrieve a representation of the resource
- POST: create a new resource
- PUT: update the resource
- PATCH: perform a partial update of a resource
- DELETE: delete a resource

## API design for health check
To check if the service is available.
#### *Request:* GET /health
#### *Response:*
```json
{
    "status": "UP",
    "details": {
        "postgre": {
            "status": "UP"
        }
    }
}
```

## API design for users
#### *Resource:* users

### Get all users
#### *Request:* GET /users
#### *Response:*
```json
[
    {
        "id": "spiderman",
        "username": "peter.parker",
        "email": "peter.parker@gmail.com",
        "phone": "0987654321",
        "dateOfBirth": "1962-08-25T16:59:59.999Z"
    },
    {
        "id": "wolverine",
        "username": "james.howlett",
        "email": "james.howlett@gmail.com",
        "phone": "0987654321",
        "dateOfBirth": "1974-11-16T16:59:59.999Z"
    }
]
```

### Search users
#### *Request:* GET /users/search?page=1&limit=2&email=james&dateOfBirth.min=1974-11-15T17:00:00.000Z&dateOfBirth.max=1976-11-15T17:00:00.000Z&sort=phone,-id
- limit: maximum of records. For example: "limit=2"
- page=1: get the first page
- email=james: email contains with 'james'
- dateOfBirth.min=1974-11-15T17:00:00.000Z&dateOfBirth.max=1976-11-15T17:00:00.000Z: dateOfBirth between 1974-11-15T17:00:00.000Z and 1976-11-15T17:00:00.000Z
- sort=phone,-id: sort phone ASC and id DESC
#### *Request:* POST /users/search
```json
{
    "page": 1,
    "limit": 2,
    "email": "james",
    "dateOfBirth": {
        "min": "1974-11-15T17:00:00.000Z",
        "max": "1976-11-15T17:00:00.000Z"
    },
    "sort": "phone,-id"
}
```
#### *Response:*
- total: total of records
```json
{
    "list": [
        {
            "id": "wolverine",
            "username": "james.howlett",
            "email": "james.howlett@gmail.com",
            "phone": "0987654321",
            "dateOfBirth": "1974-11-15T17:00:00.000Z"
        }
    ],
    "total": "1"
}
```

### Get one user by id
#### *Request:* GET /users/:id
```shell
GET /users/wolverine
```
#### *Response:*
```json
{
    "id": "wolverine",
    "username": "james.howlett",
    "email": "james.howlett@gmail.com",
    "phone": "0987654321",
    "dateOfBirth": "1974-11-16T16:59:59.999Z"
}
```

### Create a new user
#### *Request:* POST /users 
```json
{
    "id": "wolverine",
    "username": "james.howlett",
    "email": "james.howlett@gmail.com",
    "phone": "0987654321",
    "dateOfBirth": "1974-11-16T16:59:59.999Z"
}
```
#### *Response:* 1: success, 0: duplicate key, -1: error
```json
1
```

### Update one user by id
#### *Request:* PUT /users/:id
```shell
PUT /users/wolverine
```
```json
{
    "username": "james.howlett",
    "email": "james.howlett@gmail.com",
    "phone": "0987654321",
    "dateOfBirth": "1974-11-16T16:59:59.999Z"
}
```
#### *Response:* 1: success, 0: not found, -1: error
```json
1
```

### Patch one user by id
Perform a partial update of user. For example, if you want to update 2 fields: email and phone, you can send the request body of below.
#### *Request:* PATCH /users/:id
```shell
PATCH /users/wolverine
```
```json
{
    "email": "james.howlett@gmail.com",
    "phone": "0987654321"
}
```
#### *Response:* 1: success, 0: not found, -1: error
```json
1
```

### Delete a new user by id
#### *Request:* DELETE /users/:id
```shell
DELETE /users/wolverine
```
#### *Response:* 1: success, 0: not found, -1: error
```json
1
```