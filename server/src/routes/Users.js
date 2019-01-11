// @flow

import { User } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
    getAllUsers: function (req: Request, res: Response) {
        return User.findAll().then(users => res.send(users));
    }
};