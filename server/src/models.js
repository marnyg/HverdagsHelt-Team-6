// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';
require('dotenv').config();

let sequelize = new Sequelize(
  process.env.CI ? 'School' : process.env.DB_USER,
  process.env.CI ? 'root' : process.env.DB_USER,
  process.env.CI ? '' : process.env.DB_PW,
  {
    host: process.env.CI ? 'mysql' : process.env.DB_HOST, // The host is 'mysql' when running in gitlab CI
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export let Students: Class<
  Model<{ id?: number, firstName: string, lastName: string, email: string }>
> = sequelize.define('Students', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING
});

export let County: Class<Model<{ county_id?: number, name: string }>> = sequelize.define(
  'County',
  {
    county_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING
  },
  {
    timestamps: false
  }
);

export let Region: Class<
  Model<{ region_id?: number, name: string, lat: number, lon: number, county_id?: number }>
> = sequelize.define(
  'Region',
  {
    region_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
    lat: Sequelize.DOUBLE,
    lon: Sequelize.DOUBLE
  },
  {
    timestamps: false
  }
);

Region.belongsTo(County, { foreignKey: { name: 'county_id', allowNull: false } });

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return Students.create({
      firstName: 'Ola',
      lastName: 'Jensen',
      email: 'ola.jensen@ntnu.no'
    })
      .then(() =>
        Students.create({
          firstName: 'Kari',
          lastName: 'Larsen',
          email: 'kari.larsen@ntnu.no'
        })
      )
      .then(() =>
        County.create({
          name: 'Trøndelag'
        })
      )
      .then(() =>
        Region.create({
          name: 'Trondheim',
          lat: 63.42846459999999,
          lon: 10.388523800000002,
          county_id: 1
        })
      );
});
