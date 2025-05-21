const path = require('path');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const { randomUUID } = require('crypto');

const TOTAL_ROWS = 10000000; // Number of rows to generate

const root = path.join(__dirname, 'data');

const accountStream = fs.createWriteStream(path.join(root, 'account.csv'));
const settingsStream = fs.createWriteStream(path.join(root, 'account_setting.csv'));

function generateAccountRow(id, i) {
  const account = `user_${i}@example.com`;
  const email = account;
  const clientId = 'b78ecdf9-b9fd-4027-b4f0-2bd8b292e6ed';
  const registrationMethod = 'organic_account_app';
  const shardRegion = 'US';
  const now = new Date().toISOString();
  const displayName = faker.person.middleName();
  const emailIsVerified = false;

  return `${id},${account},${email},${clientId},${registrationMethod},${shardRegion},${now},${now},${displayName},${emailIsVerified}\n`;
}

function generateSettingsRow(id) {
  const avatarUrl = '/default_avatar.png';
  const langCode = 'en';
  const now = new Date().toISOString();
  return `${id},${avatarUrl},${langCode},${now},${now}\n`;
}

async function generateCSVFiles() {
  let i = 0;

  function writeChunk() {
    let ok1 = true;
    let ok2 = true;

    while (i < TOTAL_ROWS && ok1 && ok2) {
      const id = randomUUID();

      const accountRow = generateAccountRow(id, i);
      const settingRow = generateSettingsRow(id);

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
