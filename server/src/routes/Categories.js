// @flow

import { Category } from '../models.js';
import { regexNames } from '../utils/Regex';

type Request = express$Request;
type Response = express$Response;

module.exports = {
  /**
   * Gets all categories
   * @param req Request
   * @param res Response
   * @returns {Category}
   */
  getAllCategories: function(req: Request, res: Response) {
    return Category.findAll().then(category => res.send(category));
  },
  /**
   * Adds a new category
   * @param req Request
   * @param res Response
   * @returns {Category}
   */
  addCategory: function(req: Request, res: Response) {
    if (!req.body || typeof req.body.name !== 'string' || !regexNames.test(req.body.name)) return res.sendStatus(400);
    return Category.create({
      name: req.body.name
    })
      .then(categories => (categories ? res.send(categories) : res.sendStatus(500)))
      .catch(err => {
        err.description = 'Det finnes allerede en kategori med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Updates an existing category
   * @param req Request
   * @param res Response
   * @returns {Category}
   */
  updateCategory: function(req: Request, res: Response) {
    if (
      !req.body ||
      isNaN(Number(req.params.category_id)) ||
      typeof req.body.name !== 'string' ||
      !regexNames.test(req.body.name)
    )
      return res.sendStatus(400);
    return Category.update(
      {
        name: req.body.name
      },
      { where: { category_id: Number(req.params.category_id) } }
    )
      .then(categories => (categories ? res.send(categories) : res.sendStatus(404)))
      .catch(err => {
        err.description = 'Det finnes allerede en kategori med det oppgitte navnet';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  },
  /**
   * Deletes a category
   * @param req Request
   * @param res Response
   * @returns {*}
   */
  delCategory: function(req: Request, res: Response) {
    if (!req.params || isNaN(Number(req.params.category_id))) return res.sendStatus(400);
    return Category.destroy({
      where: { category_id: Number(req.params.category_id) }
    })
      .then(category => (category ? res.send() : res.status(500).send()))
      .catch(err => {
        err.description = 'Kan ikke slette kategorien, fordi det er saker som bruker den. Fiks dette først';
        res.status(409).json(err);
        console.log(err.parent.sqlMessage);
      });
  }
};
