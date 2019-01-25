// @flow

import {
  Case,
  Role,
  User,
  County,
  Region,
  Status,
  Picture,
  Category,
  Status_comment,
  Case_subscriptions,
  Region_subscriptions,
  sync
} from '../src/models.js';
import {application} from "../src/server";

beforeAll(async () => {
  await sync;
});

describe('Sequelize model findAll() tests', () => {
  it('County.findAll()  returns correct data', async () => {
    let county = await County.findAll();
    expect(
      county
        .map(county => county.toJSON())
        .map(county => ({
          id: county.county_id,
          name: county.name
        }))
    ).toEqual([
      { id: 1, name: 'Akershus' },
      { id: 2, name: 'Aust-Agder' },
      { id: 3, name: 'Buskerud' },
      { id: 4, name: 'Finnmark' },
      { id: 5, name: 'Hedmark' },
      { id: 6, name: 'Hordaland' },
      { id: 7, name: 'Møre og Romsdal' },
      { id: 8, name: 'Nordland' },
      { id: 9, name: 'Oppland' },
      { id: 10, name: 'Oslo' },
      { id: 11, name: 'Rogaland' },
      { id: 12, name: 'Sogn og Fjordane' },
      { id: 13, name: 'Telemark' },
      { id: 14, name: 'Troms' },
      { id: 15, name: 'Trøndelag' },
      { id: 16, name: 'Vest-Agder' },
      { id: 17, name: 'Vestfold' },
      { id: 18, name: 'Østfold' }
    ]);
  });
  it('Region.findAll() returns correct data', async () => {
    let region = await Region.findAll();
    expect(
      region
        .map(region => region.toJSON())
        .map(region => ({
          id: region.region_id,
          name: region.name,
          lat: region.lat,
          lon: region.lon,
          county_id: region.county_id
        }))
    ).toEqual([
      { county_id: 2, id: 1, lat: 59.8218296, lon: 10.420987100000048, name: 'Asker' },
      { county_id: 2, id: 2, lat: 59.8457053, lon: 11.525602400000023, name: 'Aurskog-Høland' },
      { county_id: 2, id: 3, lat: 59.8945502, lon: 10.546342699999968, name: 'Bærum' },
      { county_id: 9, id: 4, lat: 58.4730057, lon: 8.923850300000026, name: 'Arendal' },
      { county_id: 9, id: 5, lat: 58.4285861, lon: 8.215234499999951, name: 'Birkenes' },
      { county_id: 9, id: 6, lat: 58.92246729999999, lon: 7.677888700000039, name: 'Bygland' },
      { county_id: 6, id: 7, lat: 59.70335500000001, lon: 10.148064500000032, name: 'Drammen' },
      { county_id: 6, id: 8, lat: 59.8174274, lon: 9.56432719999998, name: 'Flesberg' },
      { county_id: 6, id: 9, lat: 60.3837212, lon: 9.485904900000037, name: 'Flå' },
      { county_id: 18, id: 10, lat: 69.96873760000001, lon: 23.27154960000007, name: 'Alta' },
      { county_id: 18, id: 11, lat: 70.7198284, lon: 29.030086200000028, name: 'Berlevåg' },
      { county_id: 18, id: 12, lat: 70.6304931, lon: 29.711803199999963, name: 'Båtsfjord' },
      { county_id: 4, id: 13, lat: 62.11020989999999, lon: 10.63983189999999, name: 'Alvdal' },
      { county_id: 4, id: 14, lat: 59.9855907, lon: 12.052325099999962, name: 'Eidskog' },
      { county_id: 4, id: 15, lat: 60.8865732, lon: 11.567248199999996, name: 'Elverum' },
      { county_id: 12, id: 16, lat: 60.4618726, lon: 5.089329700000008, name: 'Askøy' },
      { county_id: 12, id: 17, lat: 60.07395979999999, lon: 4.905145400000038, name: 'Austevoll' },
      { county_id: 12, id: 18, lat: 60.79593730000001, lon: 4.8724893999999495, name: 'Austrheim' },
      { county_id: 14, id: 19, lat: 62.84611659999999, lon: 6.942303600000059, name: 'Aukra' },
      { county_id: 14, id: 20, lat: 63.26999540000001, lon: 8.536928999999986, name: 'Aure' },
      { county_id: 14, id: 21, lat: 63.05326669999999, lon: 7.4759509000000435, name: 'Averøy' },
      { county_id: 16, id: 22, lat: 65.8740772, lon: 12.460837399999946, name: 'Alstahaug' },
      { county_id: 16, id: 23, lat: 69.253191, lon: 15.593840499999942, name: 'Andøy' },
      { county_id: 16, id: 24, lat: 68.3429232, lon: 16.831425099999933, name: 'Ballangen' },
      { county_id: 5, id: 25, lat: 62.0748588, lon: 9.53601750000007, name: 'Dovre' },
      { county_id: 5, id: 26, lat: 60.961946, lon: 9.599301800000037, name: 'Etnedal' },
      { county_id: 5, id: 27, lat: 61.29669779999999, lon: 9.85144850000006, name: 'Gausdal' },
      { county_id: 3, id: 28, lat: 59.9138688, lon: 10.752245399999993, name: 'Oslo' },
      { county_id: 11, id: 29, lat: 58.6383562, lon: 6.08925899999997, name: 'Bjerkreim' },
      { county_id: 11, id: 30, lat: 59.22403259999999, lon: 5.452889499999969, name: 'Bokn' },
      { county_id: 11, id: 31, lat: 58.3730054, lon: 5.899172000000021, name: 'Eigersund' },
      { county_id: 13, id: 32, lat: 61.3499804, lon: 5.067951300000004, name: 'Askvoll' },
      { county_id: 13, id: 33, lat: 60.9068343, lon: 7.190534899999989, name: 'Aurland' },
      { county_id: 13, id: 34, lat: 61.204367, lon: 6.526262599999996, name: 'Balestrand' },
      { county_id: 8, id: 35, lat: 59.00306370000001, lon: 9.741110700000036, name: 'Bamble' },
      { county_id: 8, id: 36, lat: 59.413934, lon: 9.06189900000004, name: 'Bø i Telemark' },
      { county_id: 8, id: 37, lat: 59.1135318, lon: 9.010694400000034, name: 'Drangedal' },
      { county_id: 17, id: 38, lat: 69.2389558, lon: 19.22602710000001, name: 'Balsfjord' },
      { county_id: 17, id: 39, lat: 68.76474809999999, lon: 18.43886180000004, name: 'Bardu' },
      { county_id: 17, id: 40, lat: 69.5440586, lon: 17.159426199999984, name: 'Berg' },
      { county_id: 15, id: 41, lat: 63.5137872, lon: 9.681250200000022, name: 'Agdenes' },
      { county_id: 15, id: 42, lat: 63.8424589, lon: 9.719530599999985, name: 'Bjugn' },
      { county_id: 15, id: 43, lat: 64.50138129999999, lon: 10.895576800000072, name: 'Flatanger' },
      { county_id: 15, id: 44, lat: 63.4209561, lon: 10.321570999999947, name: 'Trondheim' },
      { county_id: 10, id: 45, lat: 58.28574979999999, lon: 7.35594059999994, name: 'Audnedal' },
      { county_id: 10, id: 46, lat: 58.0630377, lon: 6.620277100000067, name: 'Farsund' },
      { county_id: 10, id: 47, lat: 58.25043989999999, lon: 6.5352949000000535, name: 'Flekkefjord' },
      { county_id: 7, id: 48, lat: 59.02679850000001, lon: 10.524605000000063, name: 'Færder' },
      { county_id: 7, id: 49, lat: 59.5115168, lon: 10.217080099999976, name: 'Holmestrand' },
      { county_id: 7, id: 50, lat: 59.417084, lon: 10.483212900000012, name: 'Horten' },
      { county_id: 1, id: 51, lat: 59.2441615, lon: 11.682433299999955, name: 'Aremark' },
      { county_id: 1, id: 52, lat: 59.5834589, lon: 11.162900499999978, name: 'Askim' },
      { county_id: 1, id: 53, lat: 59.5119336, lon: 11.332992999999988, name: 'Eidsberg' }
    ]);
  });
  it('Role.findAll() returns correct data', async () => {
    let role = await Role.findAll();
    expect(
      role
        .map(role => role.toJSON())
        .map(role => ({
          id: role.role_id,
          name: role.name,
          access_level: role.access_level
        }))
    ).toEqual([
      { access_level: 1, id: 1, name: 'Admin' },
      { access_level: 2, id: 2, name: 'Kommuneansatt' },
      { access_level: 3, id: 3, name: 'Bedriftsbruker' },
      { access_level: 4, id: 4, name: 'Privat bruker' },
      { access_level: 10, id: 5, name: 'Slettet' }
    ]);
  });
  it('User.findAll() returns correct data', async () => {
    let user = await User.findAll();
    expect(
      user
        .map(user => user.toJSON())
        .map(user => ({
          user_id: user.user_id,
          firstname: user.firstname,
          lastname: user.lastname,
          tlf: user.tlf,
          email: user.email,
          hashed_password: user.hashed_password,
          salt: user.salt,
          role_id: user.role_id,
          region_id: user.region_id
        }))
    ).toEqual([
      {
        email: 'ola.nordmann@gmail.com',
        firstname: 'Ola',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Nordmann',
        region_id: 1,
        role_id: 4,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 12345678,
        user_id: 1
      },
      {
        email: 'gunnar.gunnarson@gmail.com',
        firstname: 'Gunnar',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Gunnarson',
        region_id: 2,
        role_id: 4,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 44448888,
        user_id: 2
      },
      {
        email: 'ingri.pedersen@gmail.com',
        firstname: 'Ingri',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Pedersen',
        region_id: 3,
        role_id: 3,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 11112222,
        user_id: 3
      },
      {
        email: 'trygve.olsen@gmail.com',
        firstname: 'Trygve',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Olsen',
        region_id: 4,
        role_id: 3,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 99994444,
        user_id: 4
      },
      {
        email: 'tone.fjell@gmail.com',
        firstname: 'Tone',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Fjell',
        region_id: 5,
        role_id: 2,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 99994444,
        user_id: 5
      },
      {
        email: 'are.devold@gmail.com',
        firstname: 'Are',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Devold',
        region_id: 6,
        role_id: 2,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 99994444,
        user_id: 6
      },
      {
        email: 'admin@admin.com',
        firstname: 'Admin',
        hashed_password:
          'f467d3db9a56b771a9dd014100263ad809cf14c30a54182b0bd50a276b1b3946745249b767563f9844b1a44adde05b6bc8d0647e081418c38cb7b5d65b85ff16',
        lastname: 'Adminsen',
        region_id: 7,
        role_id: 1,
        salt: '1e8ee0239cf86be6dc29e01dffa665cc',
        tlf: 13376942,
        user_id: 7
      }
    ]);
  });
  it('Status.findAll() returns correct data', async () => {
    let status = await Status.findAll();
    expect(
      status
        .map(status => status.toJSON())
        .map(status => ({
          status_id: status.status_id,
          name: status.name
        }))
    ).toEqual([
      { name: 'Lukket', status_id: 3 },
      { name: 'Under behandling', status_id: 2 },
      { name: 'Åpen', status_id: 1 }
    ]);
  });
  it('Status_comment.findAll() returns correct data', async () => {
    let status_comment = await Status_comment.findAll();
    expect(
      status_comment
        .map(status_comment => status_comment.toJSON())
        .map(status_comment => ({
          status_comment_id: status_comment.status_comment_id,
          comment: status_comment.comment,
          case_id: status_comment.case_id,
          status_id: status_comment.status_id,
          user_id: status_comment.user_id
        }))
    ).toEqual([{ case_id: 1, comment: 'Starter behandling', status_comment_id: 1, status_id: 1, user_id: 1 }]);
  });
  it('Case.findAll() returns correct data', async () => {
    let the_case = await Case.findAll();
    expect(
      the_case
        .map(the_case => the_case.toJSON())
        .map(the_case => ({
          case_id: the_case.case_id,
          title: the_case.title,
          description: the_case.description,
          lat: the_case.lat,
          lon: the_case.lon,
          region_id: the_case.region_id,
          user_id: the_case.user_id,
          category_id: the_case.category_id,
          status_id: the_case.status_id
        }))
    ).toEqual([
      {
        case_id: 1,
        category_id: 2,
        description: 'Veldig dårlig måkt i gata mi.',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        region_id: 1,
        status_id: 2,
        title: 'Trenger måking!',
        user_id: 1
      },
      {
        case_id: 2,
        category_id: 2,
        description: 'Veldig dårlig måkt i gata mi.',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        region_id: 1,
        status_id: 1,
        title: 'Trenger måking!',
        user_id: 1
      }
    ]);
  });
  it('Category.findAll() returns correct data', async () => {
    let category = await Category.findAll();
    expect(
      category
        .map(category => category.toJSON())
        .map(category => ({
          category_id: category.category_id,
          name: category.name
        }))
    ).toEqual([
      { category_id: 1, name: 'Hærværk' },
      { category_id: 2, name: 'Måking' },
      { category_id: 3, name: 'Veiarbeid' }
    ]);
  });
  it('Picture.findAll() returns correct data', async () => {
    let picture = await Picture.findAll();
    expect(
      picture
        .map(picture => picture.toJSON())
        .map(picture => ({
          picture_id: picture.picture_id,
          path: picture.path,
          alt: picture.alt,
          case_id: picture.case_id
        }))
    ).toEqual([
      {
        alt: 'et bilde',
        case_id: 1,
        path: 'asdflkjasdfkljasdflkjsdf',
        picture_id: 1
      }
    ]);
  });
  it('Region_subscriptions.findAll() returns correct data', async () => {
    let region_subscriptions = await Region_subscriptions.findAll();
    expect(
      region_subscriptions
        .map(region_subscriptions => region_subscriptions.toJSON())
        .map(region_subscriptions => ({
          user_id: region_subscriptions.user_id,
          region_id: region_subscriptions.region_id,
          notify: region_subscriptions.notify
        }))
    ).toEqual([{ notify: true, region_id: 1, user_id: 1 }]);
  });
  it('Case_subscriptions.findAll() returns correct data', async () => {
    let case_subscriptions = await Case_subscriptions.findAll();
    expect(
      case_subscriptions
        .map(case_subscriptions => case_subscriptions.toJSON())
        .map(case_subscriptions => ({
          user_id: case_subscriptions.user_id,
          case_id: case_subscriptions.case_id,
          notify_by_email: case_subscriptions.notify_by_email,
          is_up_to_date: case_subscriptions.is_up_to_date
        }))
    ).toEqual([{ case_id: 1, is_up_to_date: false, notify_by_email: true, user_id: 1 }]);
  });
});
