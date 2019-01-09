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
    name: { type: Sequelize.STRING, allowNull: false }
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
    name: { type: Sequelize.STRING, allowNull: false },
    lat: { type: Sequelize.DOUBLE, allowNull: false },
    lon: { type: Sequelize.DOUBLE, allowNull: false }
  },
  {
    timestamps: false
  }
);

export let Role: Class<Model<{ role_id?: number, name: string, access_level: number }>> = sequelize.define(
  'Role',
  {
    role_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    access_level: { type: Sequelize.INTEGER, allowNull: false }
  },
  {
    timestamps: false
  }
);

export let User: Class<
  Model<{
    user_id?: number,
    firstname: string,
    lastname: string,
    tlf: number,
    email: string,
    hashed_password: string,
    salt: string,
    role_id?: number,
    region_id?: number
  }>
> = sequelize.define(
  'User',
  {
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: Sequelize.STRING, allowNull: false },
    lastname: { type: Sequelize.STRING, allowNull: false },
    tlf: { type: Sequelize.BIGINT, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    hashed_password: { type: Sequelize.STRING, allowNull: false },
    salt: { type: Sequelize.STRING, allowNull: false }
  },
  {
    timestamps: false
  }
);

Region.belongsTo(County, { foreignKey: { name: 'county_id', allowNull: false } });
User.belongsTo(Role, { foreignKey: { name: 'role_id', allowNull: false } });
User.belongsTo(Region, { foreignKey: { name: 'region_id', allowNull: false } });

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
      )
      .then(() =>
        Role.create({
          name: 'Bruker',
          access_level: 2
        })
      )
      .then(() =>
        User.create({
            firstname: 'Ola',
            lastname: 'Nordmann',
            tlf: 12345678,
            email: 'ola.nordmann@gmail.com',
            hashed_password: 'passord123',
            salt: 'a12b',
            role_id: 1,
            region_id: 1
        })
      );
});
