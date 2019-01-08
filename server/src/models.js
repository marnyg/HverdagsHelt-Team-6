// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';

let sequelize = new Sequelize('School', 'root', '', {
  host: process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export let Students: Class<
  Model<{ id?: number, firstName: string, lastName: string, email: string }>
> = sequelize.define('Students', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING
});

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return Students.create({
      firstName: 'Ola',
      lastName: 'Jensen',
      email: 'ola.jensen@ntnu.no'
    }).then(() =>
      Students.create({
        firstName: 'Kari',
        lastName: 'Larsen',
        email: 'kari.larsen@ntnu.no'
      })
    );
});
