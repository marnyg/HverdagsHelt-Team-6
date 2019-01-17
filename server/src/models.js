// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';
require('dotenv').config();

export let sequelize = new Sequelize(
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
    name: { type: Sequelize.STRING, allowNull: false, unique: true }
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

export let Category: Class<Model<{ category_id?: number, name: string }>> = sequelize.define(
  'Category',
  {
    category_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true }
  },
  {
    timestamps: false
  }
);

export let Picture: Class<
  Model<{ picture_id?: number, path: string, alt: string, case_id?: number }>
> = sequelize.define('Picture', {
  picture_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  path: { type: Sequelize.STRING, allowNull: false, unique: true },
  alt: { type: Sequelize.STRING }
});

export let Region_subscriptions: Class<
  Model<{ user_id: number, region_id: number, notify: boolean }>
> = sequelize.define(
  'Region_subscriptions',
  {
    user_id: { type: Sequelize.INTEGER, primaryKey: true },
    region_id: { type: Sequelize.INTEGER, primaryKey: true },
    notify: { type: Sequelize.BOOLEAN, allowNull: false }
  },
  {
    timestamps: false
  }
);

export let Case_subscriptions: Class<
  Model<{ user_id: number, case_id: number, notify_by_email: boolean, is_up_to_date: boolean }>
> = sequelize.define(
  'Case_subscriptions',
  {
    user_id: { type: Sequelize.INTEGER, primaryKey: true },
    case_id: { type: Sequelize.INTEGER, primaryKey: true },
    notify_by_email: { type: Sequelize.BOOLEAN, allowNull: false },
    is_up_to_date: { type: Sequelize.BOOLEAN, allowNull: false }
  },
  {
    timestamps: false
  }
);

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
Region_subscriptions.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });
Region_subscriptions.belongsTo(Region, { foreignKey: { name: 'region_id', allowNull: false } });
Case_subscriptions.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: false } });
Case_subscriptions.belongsTo(Case, { foreignKey: { name: 'case_id', allowNull: false } });

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
production = true; // Gjør at databasen er statisk
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(
  () => {
    if (!production)
      return (
        // ****************************** Counties ******************************
        County.create({
          name: 'Akershus'
        })
          .then(() =>
            County.create({
              name: 'Aust-Agder'
            })
          )
          .then(() =>
            County.create({
              name: 'Buskerud'
            })
          )
          .then(() =>
            County.create({
              name: 'Finnmark'
            })
          )
          .then(() =>
            County.create({
              name: 'Hedmark'
            })
          )
          .then(() =>
            County.create({
              name: 'Hordaland'
            })
          )
          .then(() =>
            County.create({
              name: 'Møre og Romsdal'
            })
          )
          .then(() =>
            County.create({
              name: 'Nordland'
            })
          )
          .then(() =>
            County.create({
              name: 'Oppland'
            })
          )
          .then(() =>
            County.create({
              name: 'Oslo'
            })
          )
          .then(() =>
            County.create({
              name: 'Rogaland'
            })
          )
          .then(() =>
            County.create({
              name: 'Sogn og Fjordane'
            })
          )
          .then(() =>
            County.create({
              name: 'Telemark'
            })
          )
          .then(() =>
            County.create({
              name: 'Troms'
            })
          )
          .then(() =>
            County.create({
              name: 'Trøndelag'
            })
          )
          .then(() =>
            County.create({
              name: 'Vest-Agder'
            })
          )
          .then(() =>
            County.create({
              name: 'Vestfold'
            })
          )
          .then(() =>
            County.create({
              name: 'Østfold'
            })
          )
          // ****************************** Regions ******************************
          // Akershus
          .then(() =>
            Region.create({
              name: 'Asker',
              lat: 59.8218296,
              lon: 10.420987100000048,
              county_id: 2
            })
          )
          .then(() =>
            Region.create({
              name: 'Aurskog-Høland',
              lat: 59.8457053,
              lon: 11.525602400000025,
              county_id: 2
            })
          )
          .then(() =>
            Region.create({
              name: 'Bærum',
              lat: 59.8945502,
              lon: 10.546342699999968,
              county_id: 2
            })
          )
          // Aust-Agder
          .then(() =>
            Region.create({
              name: 'Arendal',
              lat: 58.4730057,
              lon: 8.923850300000026,
              county_id: 9
            })
          )
          .then(() =>
            Region.create({
              name: 'Birkenes',
              lat: 58.4285861,
              lon: 8.215234499999951,
              county_id: 9
            })
          )
          .then(() =>
            Region.create({
              name: 'Bygland',
              lat: 58.92246729999999,
              lon: 7.6778887000000395,
              county_id: 9
            })
          )
          // Buskerud
          .then(() =>
            Region.create({
              name: 'Drammen',
              lat: 59.70335500000001,
              lon: 10.148064500000032,
              county_id: 6
            })
          )
          .then(() =>
            Region.create({
              name: 'Flesberg',
              lat: 59.8174274,
              lon: 9.56432719999998,
              county_id: 6
            })
          )
          .then(() =>
            Region.create({
              name: 'Flå',
              lat: 60.3837212,
              lon: 9.485904900000037,
              county_id: 6
            })
          )
          // Finnmark
          .then(() =>
            Region.create({
              name: 'Alta',
              lat: 69.96873760000001,
              lon: 23.27154960000007,
              county_id: 18
            })
          )
          .then(() =>
            Region.create({
              name: 'Berlevåg',
              lat: 70.7198284,
              lon: 29.030086200000028,
              county_id: 18
            })
          )
          .then(() =>
            Region.create({
              name: 'Båtsfjord',
              lat: 70.6304931,
              lon: 29.711803199999963,
              county_id: 18
            })
          )
          // Hedmark
          .then(() =>
            Region.create({
              name: 'Alvdal',
              lat: 62.11020989999999,
              lon: 10.63983189999999,
              county_id: 4
            })
          )
          .then(() =>
            Region.create({
              name: 'Eidskog',
              lat: 59.9855907,
              lon: 12.052325099999962,
              county_id: 4
            })
          )
          .then(() =>
            Region.create({
              name: 'Elverum',
              lat: 60.8865732,
              lon: 11.567248199999995,
              county_id: 4
            })
          )
          // Hordaland
          .then(() =>
            Region.create({
              name: 'Askøy',
              lat: 60.4618726,
              lon: 5.0893297000000075,
              county_id: 12
            })
          )
          .then(() =>
            Region.create({
              name: 'Austevoll',
              lat: 60.07395979999999,
              lon: 4.905145400000038,
              county_id: 12
            })
          )
          .then(() =>
            Region.create({
              name: 'Austrheim',
              lat: 60.79593730000001,
              lon: 4.8724893999999495,
              county_id: 12
            })
          )
          // Møre og Romsdal
          .then(() =>
            Region.create({
              name: 'Aukra',
              lat: 62.84611659999999,
              lon: 6.942303600000059,
              county_id: 14
            })
          )
          .then(() =>
            Region.create({
              name: 'Aure',
              lat: 63.26999540000001,
              lon: 8.536928999999986,
              county_id: 14
            })
          )
          .then(() =>
            Region.create({
              name: 'Averøy',
              lat: 63.05326669999999,
              lon: 7.4759509000000435,
              county_id: 14
            })
          )
          // Nordland
          .then(() =>
            Region.create({
              name: 'Alstahaug',
              lat: 65.8740772,
              lon: 12.460837399999946,
              county_id: 16
            })
          )
          .then(() =>
            Region.create({
              name: 'Andøy',
              lat: 69.253191,
              lon: 15.593840499999942,
              county_id: 16
            })
          )
          .then(() =>
            Region.create({
              name: 'Ballangen',
              lat: 68.3429232,
              lon: 16.831425099999933,
              county_id: 16
            })
          )
          // Oppland
          .then(() =>
            Region.create({
              name: 'Dovre',
              lat: 62.0748588,
              lon: 9.53601750000007,
              county_id: 5
            })
          )
          .then(() =>
            Region.create({
              name: 'Etnedal',
              lat: 60.961946,
              lon: 9.599301800000035,
              county_id: 5
            })
          )
          .then(() =>
            Region.create({
              name: 'Gausdal',
              lat: 61.29669779999999,
              lon: 9.85144850000006,
              county_id: 5
            })
          )
          // Oslo
          .then(() =>
            Region.create({
              name: 'Oslo',
              lat: 59.9138688,
              lon: 10.752245399999993,
              county_id: 3
            })
          )
          // Rogaland
          .then(() =>
            Region.create({
              name: 'Bjerkreim',
              lat: 58.6383562,
              lon: 6.08925899999997,
              county_id: 11
            })
          )
          .then(() =>
            Region.create({
              name: 'Bokn',
              lat: 59.22403259999999,
              lon: 5.452889499999969,
              county_id: 11
            })
          )
          .then(() =>
            Region.create({
              name: 'Eigersund',
              lat: 58.3730054,
              lon: 5.899172000000021,
              county_id: 11
            })
          )
          // Sogn og Fjordane
          .then(() =>
            Region.create({
              name: 'Askvoll',
              lat: 61.3499804,
              lon: 5.067951300000004,
              county_id: 13
            })
          )
          .then(() =>
            Region.create({
              name: 'Aurland',
              lat: 60.9068343,
              lon: 7.190534899999989,
              county_id: 13
            })
          )
          .then(() =>
            Region.create({
              name: 'Balestrand',
              lat: 61.204367,
              lon: 6.5262625999999955,
              county_id: 13
            })
          )
          // Telemark
          .then(() =>
            Region.create({
              name: 'Bamble',
              lat: 59.00306370000001,
              lon: 9.741110700000036,
              county_id: 8
            })
          )
          .then(() =>
            Region.create({
              name: 'Bø i Telemark',
              lat: 59.413934,
              lon: 9.06189900000004,
              county_id: 8
            })
          )
          .then(() =>
            Region.create({
              name: 'Drangedal',
              lat: 59.1135318,
              lon: 9.010694400000034,
              county_id: 8
            })
          )
          // Troms
          .then(() =>
            Region.create({
              name: 'Balsfjord',
              lat: 69.2389558,
              lon: 19.22602710000001,
              county_id: 17
            })
          )
          .then(() =>
            Region.create({
              name: 'Bardu',
              lat: 68.76474809999999,
              lon: 18.43886180000004,
              county_id: 17
            })
          )
          .then(() =>
            Region.create({
              name: 'Berg',
              lat: 69.5440586,
              lon: 17.159426199999984,
              county_id: 17
            })
          )
          // Trøndelag
          .then(() =>
            Region.create({
              name: 'Agdenes',
              lat: 63.5137872,
              lon: 9.681250200000022,
              county_id: 15
            })
          )
          .then(() =>
            Region.create({
              name: 'Bjugn',
              lat: 63.8424589,
              lon: 9.719530599999985,
              county_id: 15
            })
          )
          .then(() =>
            Region.create({
              name: 'Flatanger',
              lat: 64.50138129999999,
              lon: 10.895576800000072,
              county_id: 15
            })
          )
          .then(() =>
            Region.create({
              name: 'Trondheim',
              lat: 63.4209561,
              lon: 10.321570999999949,
              county_id: 15
            })
          )
          // Vest-Agder
          .then(() =>
            Region.create({
              name: 'Audnedal',
              lat: 58.28574979999999,
              lon: 7.35594059999994,
              county_id: 10
            })
          )
          .then(() =>
            Region.create({
              name: 'Farsund',
              lat: 58.0630377,
              lon: 6.620277100000067,
              county_id: 10
            })
          )
          .then(() =>
            Region.create({
              name: 'Flekkefjord',
              lat: 58.25043989999999,
              lon: 6.5352949000000535,
              county_id: 10
            })
          )
          // Vestfold
          .then(() =>
            Region.create({
              name: 'Færder',
              lat: 59.02679850000001,
              lon: 10.524605000000065,
              county_id: 7
            })
          )
          .then(() =>
            Region.create({
              name: 'Holmestrand',
              lat: 59.5115168,
              lon: 10.217080099999976,
              county_id: 7
            })
          )
          .then(() =>
            Region.create({
              name: 'Horten',
              lat: 59.417084,
              lon: 10.483212900000012,
              county_id: 7
            })
          )
          // Østfold
          .then(() =>
            Region.create({
              name: 'Aremark',
              lat: 59.2441615,
              lon: 11.682433299999957,
              county_id: 1
            })
          )
          .then(() =>
            Region.create({
              name: 'Askim',
              lat: 59.5834589,
              lon: 11.162900499999978,
              county_id: 1
            })
          )
          .then(() =>
            Region.create({
              name: 'Eidsberg',
              lat: 59.5119336,
              lon: 11.332992999999988,
              county_id: 1
            })
          )
          // ****************************** Roles ******************************
          .then(() =>
            Role.create({
              name: 'Admin',
              access_level: 1
            })
          )
          .then(() =>
            Role.create({
              name: 'Kommuneansatt',
              access_level: 2
            })
          )
          .then(() =>
            Role.create({
              name: 'Bedriftsbruker',
              access_level: 3
            })
          )
          .then(() =>
            Role.create({
              name: 'Privat bruker',
              access_level: 4
            })
          )
          // ****************************** Users ******************************
          .then(() =>
            User.create({
              firstname: 'Ola',
              lastname: 'Nordmann',
              tlf: 12345678,
              email: 'ola.nordmann@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 4,
              region_id: 1
            })
          )
          .then(() =>
            User.create({
              firstname: 'Gunnar',
              lastname: 'Gunnarson',
              tlf: 44448888,
              email: 'gunnar.gunnarson@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 4,
              region_id: 2
            })
          )
          .then(() =>
            User.create({
              firstname: 'Ingri',
              lastname: 'Pedersen',
              tlf: 11112222,
              email: 'ingri.pedersen@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 3,
              region_id: 3
            })
          )
          .then(() =>
            User.create({
              firstname: 'Trygve',
              lastname: 'Olsen',
              tlf: 99994444,
              email: 'trygve.olsen@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 3,
              region_id: 4
            })
          )
          .then(() =>
            User.create({
              firstname: 'Tone',
              lastname: 'Fjell',
              tlf: 99994444,
              email: 'tone.fjell@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 2,
              region_id: 5
            })
          )
          .then(() =>
            User.create({
              firstname: 'Are',
              lastname: 'Devold',
              tlf: 99994444,
              email: 'are.devold@gmail.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 2,
              region_id: 6
            })
          )
          .then(() =>
            User.create({
              firstname: 'Admin',
              lastname: 'Adminsen',
              tlf: 13376942,
              email: 'admin@admin.com',
              hashed_password:
                'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
              salt: '1e8ee0239cf86be6dc29e01dffa665cc',
              role_id: 1,
              region_id: 7
            })
          )
          // ****************************** Statuses ******************************
          .then(() =>
            Status.create({
              name: 'Åpen'
            })
          )
          .then(() =>
            Status.create({
              name: 'Under behandling'
            })
          )
          .then(() =>
            Status.create({
              name: 'Lukket'
            })
          )
          // ****************************** Categories ******************************
          .then(() =>
            Category.create({
              name: 'Hærverk'
            })
          )
          .then(() =>
            Category.create({
              name: 'Måking'
            })
          )
          .then(() =>
            Category.create({
              name: 'Veiarbeid'
            })
          )
          // ****************************** Cases ******************************
          .then(() =>
            Case.create({
              title: 'Trenger måking!',
              description: 'Veldig dårlig måkt i gata mi.',
              lat: 63.42846459999999,
              lon: 10.388523800000002,
              region_id: 1,
              user_id: 1,
              category_id: 2,
              status_id: 1
            })
          )
          .then(() =>
            Case.create({
              title: 'Trenger måking!',
              description: 'Veldig dårlig måkt i gata mi.',
              lat: 63.42846459999999,
              lon: 10.388523800000002,
              region_id: 1,
              user_id: 1,
              category_id: 2,
              status_id: 1
            })
          )
          // ****************************** Status_comments ******************************
          .then(() =>
            Status_comment.create({
              comment: 'Starter behandling',
              case_id: 1,
              status_id: 1,
              user_id: 1
            })
          )
          // ****************************** Pictures ******************************
          .then(() =>
            Picture.create({
              case_id: 1,
              path: 'asdflkjasdfkljasdflkjsdf',
              alt: 'et bilde'
            })
          )
          // ****************************** Regions subscriptions ******************************
          .then(() =>
            Region_subscriptions.create({
              user_id: 1,
              region_id: 1,
              notify: true
            })
          )
          // ****************************** Case subscriptions ******************************
          .then(() =>
            Case_subscriptions.create({
              user_id: 1,
              case_id: 1,
              notify_by_email: true,
              is_up_to_date: false
            })
          )
      );
  },
  err => {
    console.log(err);
    console.log('Database connection failed');
  }
);


