import { Sequelize, STRING } from 'sequelize';
import ora from 'ora';

export async function database() {
  // ! Add your connection string here
  const uri = ``;

  const sequelize = new Sequelize(uri, {
    logging: false
  });

  await sequelize.authenticate();
  ora().succeed('PostgreSQL is running.');

  const entry = sequelize.define('entry', {
    id: STRING,
    name: STRING,
    email: STRING
  });

  await entry.sync();

  return entry;
}
