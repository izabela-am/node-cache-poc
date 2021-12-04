import faker from 'faker';

import { database } from './database';

const MAX_PER_BLOCK = 100;
const BLOCK = 500;

async function interval() {
  const Entry = await database();
  const promises = [];

  for (let i = 0; i < MAX_PER_BLOCK; i++) {
    const fakeEntry = Entry.create({
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      email: faker.internet.email(),
    });

    promises.push(fakeEntry);
  }

  await Promise.all(promises);
}

setInterval(interval, BLOCK);
console.log('Fake seed data was created');