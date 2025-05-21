const path = require('path');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const { randomUUID } = require('crypto');

const TOTAL_ROWS = 10000000; // Number of rows to generate

const root = path.join(__dirname, 'data');

if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true });

const accountStream = fs.createWriteStream(path.join(root, 'account.csv'));
const settingsStream = fs.createWriteStream(path.join(root, 'account_setting.csv'));

function generateAccountRow(opts) {
  const {
    count,
    id,
    create_time,
  } = opts;

  const account = `user_${count}@example.com`;
  const email = account;
  const clientId = 'b78ecdf9-b9fd-4027-b4f0-2bd8b292e6ed';
  const registrationMethod = 'organic_account_app';
  const shardRegion = 'US';
  const modify_time = faker.date.between({
    from: create_time,
    to: new Date(),
  }).toISOString();
  const displayName = faker.person.middleName();
  const emailIsVerified = false;

  return `${id},${account},${email},${clientId},${registrationMethod},${shardRegion},${create_time},${modify_time},${displayName},${emailIsVerified}\n`;
}

function generateSettingsRow(opts) {
  const {
    id,
    create_time,
  } = opts;

  const avatarUrl = '/default_avatar.png';
  const langCode = 'en';
  const modify_time = faker.date.between({
    from: create_time,
    to: new Date(),
  }).toISOString();
  return `${id},${avatarUrl},${langCode},${create_time},${modify_time}\n`;
}

async function generateCSVFiles() {
  let i = 0;

  function writeChunk() {
    let ok1 = true;
    let ok2 = true;

    while (i < TOTAL_ROWS && ok1 && ok2) {
      const opts = {
        count: i,
        id: randomUUID(),
        create_time: faker.date.past().toISOString()
      };

      const accountRow = generateAccountRow(opts);
      const settingRow = generateSettingsRow(opts);

      ok1 = accountStream.write(accountRow);
      ok2 = settingsStream.write(settingRow);

      i++;
      if (i % 100000 === 0) {
        console.log(`Wrote ${i.toLocaleString()} rows...`);
      }
    }

    if (i < TOTAL_ROWS) {
      if (!ok1) accountStream.once('drain', writeChunk);
      if (!ok2) settingsStream.once('drain', writeChunk);
    } else {
      accountStream.end();
      settingsStream.end();
      console.log('✅ Finished generating both CSV files.');
    }
  }

  writeChunk();
}

generateCSVFiles();
