// @flow

import { Category } from '../models.js';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  getAllCategories: function(req: Request, res: Response) {
    return Category.findAll().then(category => res.send(category));
  },
  addCategory: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name != 'string') return res.sendStatus(400);
    return Category.create({
      name: req.body.name
    }).then(categories => (categories ? res.send(categories) : res.sendStatus(404)));
  },
  updateCategory: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name != 'string') return res.sendStatus(400);
    return Category.update(
      {
        name: req.body.name
      },
      { where: { category_id: Number(req.params.category_id) } }
    ).then(categories => (categories ? res.send(categories) : res.sendStatus(404)));
  },
  delCategory: function(req: Request, res: Response) {
    return Category.destroy({
      where: { category_id: Number(req.params.category_id) }
    }).then(category => (category ? res.send() : res.status(500).send()));
  }
};
