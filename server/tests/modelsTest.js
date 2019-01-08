// @flow

import { Students, sync } from '../src/models.js';

beforeAll(async () => {
  await sync;
});

describe('Students test', () => {
  it('correct data', async () => {
    let students = await Students.findAll();
    expect(
      students.map(student => student.toJSON()).map(student => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      }))
    ).toEqual([
      {
        id: 1,
        firstName: 'Ola',
        lastName: 'Jensen',
        email: 'ola.jensen@ntnu.no'
      },
      {
        id: 2,
        firstName: 'Kari',
        lastName: 'Larsen',
        email: 'kari.larsen@ntnu.no'
      }
    ]);
  });
});
