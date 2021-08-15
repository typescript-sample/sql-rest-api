import {Request, Response} from 'express';
import {Attribute, buildAndCheckIdWithBody, format, fromRequest, getParameters, handleError, jsonResult, param, respondModel, SearchResult} from 'express-ext';
import {keys} from 'query-core';
import {userModel} from '../metadata/UserModel';
import {User} from '../models/User';
import {UserSM} from '../search-models/UserSM';
import {UserService} from '../services/UserService';

export class UserController {
  constructor(private userService: UserService, private find: (s: UserSM, limit?: number, skip?: number|string, fields?: string[]) => Promise<SearchResult<User>>, private log?: (msg: string, ctx?: any) => void) {
    this.all = this.all.bind(this);
    this.search = this.search.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
    this.keys = keys(userModel.attributes);
  }
  protected keys: Attribute[];

  all(req: Request, res: Response) {
    this.userService.all()
      .then(users => res.status(200).json(users))
      .catch(err => res.status(500).send(err));
  }
  search(req: Request, res: Response) {
    const s = fromRequest<UserSM>(req);
    const l = getParameters(s);
    format(s, ['dateOfBirth']);
    this.find(s, l.limit, l.skipOrRefId, l.fields)
      .then(result => jsonResult(res, result))
      .catch(err => handleError(err, res, this.log));
  }
  load(req: Request, res: Response) {
    const id = param(req, res, 'id');
    if (id) {
      this.userService.load(id)
        .then(user => respondModel(user, res))
        .catch(err => handleError(err, res, this.log));
    }
  }
  insert(req: Request, res: Response) {
    const user = req.body;
    this.userService.insert(user)
      .then(result => res.status(201).json(result))
      .catch(err => handleError(err, res, this.log));
  }
  update(req: Request, res: Response) {
    const id = buildAndCheckIdWithBody(req, res, this.keys);
    if (id) {
      const user = req.body;
      this.userService.update(user)
      .then(result => res.status(200).json(result))
      .catch(err => handleError(err, res, this.log));
    }
  }
  patch(req: Request, res: Response) {
    const id = buildAndCheckIdWithBody(req, res, this.keys);
    if (id) {
      const user = req.body;
      this.userService.patch(user)
      .then(result => res.status(200).json(result))
      .catch(err => handleError(err, res, this.log));
    }
  }
  delete(req: Request, res: Response) {
    const id = param(req, res, 'id');
    if (id) {
      this.userService.delete(id)
      .then(result => res.status(200).json(result))
      .catch(err => handleError(err, res, this.log));
    }
  }
}
