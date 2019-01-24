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

afterAll(()=> {
  application.close();
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
      {
        id: 1,
        name: 'Trøndelag'
      },
      {
        id: 2,
        name: 'Akershus'
      },
      {
        id: 4,
        name: 'Møre og Romsdal'
      }
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
      {
        id: 1,
        name: 'Trondheim',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        county_id: 1
      },
      {
        county_id: 2,
        id: 6,
        lat: 59.9559696,
        lon: 11.050378499999963,
        name: 'Lillestrøm'
      },
      {
        county_id: 1,
        id: 9,
        lat: 64.01501929999999,
        lon: 11.495262700000012,
        name: 'Steinkjer'
      },
      {
        county_id: 1,
        id: 10,
        lat: 63.46779719999999,
        lon: 10.917596000000003,
        name: 'Stjørdal'
      },
      {
        county_id: 2,
        id: 11,
        lat: 59.8945502,
        lon: 10.546342699999968,
        name: 'Bærum'
      },
      {
        county_id: 2,
        id: 12,
        lat: 60.2696183,
        lon: 10.956988799999976,
        name: 'Melhus'
      }
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
      {
        id: 1,
        name: 'Privat bruker',
        access_level: 4
      },
      {
        id: 2,
        name: 'Admin',
        access_level: 1
      },
      {
        access_level: 2,
        id: 3,
        name: 'Kommune ansatt'
      },
      {
        access_level: 3,
        id: 4,
        name: 'Bedrift bruker'
      }
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
          '3deaff43f8e744b104d72d244f21e16a6682ffc65bfed73d32b32694c54305306ac6769edaf1275df8e6c574df8caf516f60b7a8742efe9edf835c8299365feb',
        lastname: 'Nordmann',
        region_id: 1,
        role_id: 1,
        salt: 'c326af03a0fd6d4e9e3da2423059c621',
        tlf: 12345678,
        user_id: 1
      },
      {
        email: 'marit.nordmann@gmail.com',
        firstname: 'Marit',
        hashed_password:
          '247635d35b28dbd8fb0c1dcf6f22e712866f88aaba0651e34d7a97dacfde560fa1b3f1b9415f5bb3738dedae77982adde6cfac4f7e9c6541bf5c1c6e312af9b7',
        lastname: 'Nordmann',
        region_id: 1,
        role_id: 1,
        salt: '0a178888c0ce6d0a0231444018d06866',
        tlf: 87654321,
        user_id: 2
      },
      {
        email: 'orjan_bostad@hotmail.com',
        firstname: 'Orjan',
        hashed_password:
          '3607597e88e409d4e35e7a5f4451a9c252a7559e3b886361a24e88e95529169b43f0aeeb8f62bdf7aefadaf6c77803df5661e69f3df58d000382b2c285036765',
        lastname: 'Vesterlid',
        region_id: 1,
        role_id: 1,
        salt: '77ccb7fe0801b88f069a34ef205110a0',
        tlf: 45819374,
        user_id: 3
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
      {
        name: 'Avvist',
        status_id: 4
      },
      {
        name: 'Ferdig behandlet',
        status_id: 5
      },
      {
        name: 'Registrert',
        status_id: 2
      },
      {
        name: 'Satt på vent',
        status_id: 3
      },
      {
        name: 'Under behandling',
        status_id: 1
      },
      {
        name: 'Venter på godkjenning',
        status_id: 6
      }
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
    ).toEqual([
      { case_id: 1, comment: 'Starter behandling', status_comment_id: 1, status_id: 1, user_id: 1 },
      { case_id: 1, comment: 'Venter på levering', status_comment_id: 3, status_id: 1, user_id: 1 }
    ]);
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
        category_id: 1,
        description: 'Veldig dårlig måkt i gata mi',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        region_id: 1,
        status_id: 1,
        title: 'Trenger måking!',
        user_id: 1
      },
      {
        case_id: 3,
        category_id: 1,
        description: 'Veldig dårlig måkt i gata mi',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        region_id: 1,
        status_id: 1,
        title: 'Trenger måking! I daagg',
        user_id: 2
      },
      {
        case_id: 4,
        category_id: 1,
        description: 'Blir så forbanna når de ikke klarer å gjøre jobben sin, alle andre har fått måkt gata si..',
        lat: 63.42846459999999,
        lon: 10.388523800000002,
        region_id: 1,
        status_id: 1,
        title: 'Trenger måking! I daagg... blir så forbanna',
        user_id: 2
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
      {
        category_id: 1,
        name: 'Måking'
      },
      {
        category_id: 3,
        name: 'Veiarbeid'
      }
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
    ).toEqual([
      {
        notify: true,
        region_id: 1,
        user_id: 1
      },
      {
        notify: true,
        region_id: 1,
        user_id: 2
      }
    ]);
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
    ).toEqual([
      {
        case_id: 1,
        is_up_to_date: false,
        notify_by_email: true,
        user_id: 1
      },
      {
        case_id: 1,
        is_up_to_date: true,
        notify_by_email: true,
        user_id: 2
      },
      {
        case_id: 1,
        is_up_to_date: true,
        notify_by_email: true,
        user_id: 3
      }
    ]);
  });
});
