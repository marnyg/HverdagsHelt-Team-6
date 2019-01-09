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

export let Status: Class<Model<{ status_id?: number, name: string }>> = sequelize.define(
  'Status',
  {
    status_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true }
  },
  {
    timestamps: false
  }
);

export let Status_comment: Class<
  Model<{ status_comment_id?: number, comment: string, case_id?: number, status_id?: number, user_id?: number }>
> = sequelize.define('Status_comment', {
  status_comment_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  comment: { type: Sequelize.STRING, allowNull: false, unique: true }
});

export let Case: Class<
  Model<{
    case_id?: number,
    title: string,
    description: string,
    lat: number,
    lon: number,
    region_id?: number,
    user_id?: number,
    category_id?: number,
    status_id?: number
  }>
> = sequelize.define('Case', {
  case_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING },
  lat: { type: Sequelize.DOUBLE, allowNull: false },
  lon: { type: Sequelize.DOUBLE, allowNull: false }
});

export let Category: Class<Model<{ category_id?: number, name: string }>> = sequelize.define('Category', {
  category_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false, unique: true }
});

export let Picture: Class<
  Model<{ picture_id?: number, path: string, alt: string, case_id?: number }>
> = sequelize.define('Picture', {
  picture_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  path: { type: Sequelize.STRING, allowNull: false, unique: true },
  alt: { type: Sequelize.STRING }
});

Region.belongsTo(County, { foreignKey: { name: 'county_id', allowNull: false } });
User.belongsTo(Role, { foreignKey: { name: 'role_id', allowNull: false } });
User.belongsTo(Region, { foreignKey: { name: 'region_id', allowNull: false } });
Status_comment.belongsTo(Case, { foreignKey: { name: 'case_id', allowNull: false } });
Status_comment.belongsTo(Status, { foreignKey: { name: 'status_id', allowNull: false } });
Status_comment.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });
Picture.belongsTo(Case, { foreignKey: { name: 'case_id', allowNull: false } });
Case.belongsTo(Region, { foreignKey: { name: 'region_id', allowNull: false } });
Case.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });
Case.belongsTo(Category, { foreignKey: { name: 'category_id', allowNull: false } });
Case.belongsTo(Status, { foreignKey: { name: 'status_id', allowNull: false } });

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return County.create({
      name: 'Trøndelag'
    })
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
      )
      .then(() =>
        Status.create({
          name: 'Under behandling'
        })
      )
      .then(() =>
        Category.create({
          name: 'Måking'
        })
      )
      .then(() =>
        Case.create({
          title: 'Trenger måking!',
          description: 'Veldig dårlig måkt i gata mi',
          lat: 63.42846459999999,
          lon: 10.388523800000002,
          region_id: 1,
          user_id: 1,
          category_id: 1,
          status_id: 1
        })
      )
      .then(() =>
        Status_comment.create({
          comment: 'Starter behandling',
          case_id: 1,
          status_id: 1,
          user_id: 1
        })
      )
      .then(() =>
        Picture.create({
          case_id: 1,
          path: 'asdflkjasdfkljasdflkjsdf',
          alt: 'et bilde'
        })
      );
});
