// @flow

import { Case, Region } from '../models.js';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

module.exports = {
  /**
   * Checks if there is a case within 50 meters, with the same category. Accepts it if default region position is used
   * @param lat Latitude
   * @param lon Longitude
   * @param category_id Category_id
   * @param region_id Region_id
   * @returns {Promise<boolean>}
   */
  duplicateCheck: function(lat: number, lon: number, category_id: number, region_id: number) {
    return new Promise(resolve => {
      Region.findOne({ where: { region_id: region_id } }).then(async region => {
        if (region.lat == lat && region.lon == lon) resolve(false);
        else {
          let cases = await Case.findAll({
            where: { region_id: region_id, category_id: category_id, status_id: { [Op.ne]: 3 } },
            attributes: ['lat', 'lon']
          });
          console.log(cases);
          resolve(
            cases.some(the_case => {
              return isDuplicate(lat, lon, the_case.lat, the_case.lon);
            })
          );
        }
      });
    });
  }
};

function isDuplicate(lat1: number, lon1: number, lat2: number, lon2: number) {
  const duplicate_limit = 50;

  let R = 6371; // km
  let x1 = lat2 - lat1;
  let dLat = toRad(x1);
  let x2 = lon2 - lon1;
  let dLon = toRad(x2);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000 < duplicate_limit; // meter
}

function toRad(grad: number) {
  return (grad * Math.PI) / 180;
}
