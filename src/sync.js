const fs = require('node:fs');
const path = require('node:path');
const { fetchTemplate, writeFile } = require('./utils');

module.exports = async function sync() {
  if (!fs.existsSync(path.join(process.cwd(), '.wfrc.json'))) {
    writeFile('.wfrc.json', await fetchTemplate('.wfrc.json'));
  }
  writeFile('AGENTS.md', await fetchTemplate('AGENTS.md'));
  writeFile('commitlint.config.js', await fetchTemplate('commitlint.config.js'));
  writeFile('.github/workflows/release.yml', await fetchTemplate('release-caller.yml'));
  writeFile('.github/workflows/pr-checks.yml', await fetchTemplate('pr-checks-caller.yml'));
  writeFile('.github/workflows/labeler.yml', await fetchTemplate('labeler-caller.yml'));
  writeFile('.github/workflows/close-issue.yml', await fetchTemplate('close-issue-caller.yml'));
  writeFile('.github/labeler.yml', await fetchTemplate('labeler.yml'));
  console.log('Plantillas sincronizadas con la ultima version de workflows-core.');
  console.log('Revisa el diff con git status/diff y haz commit si todo esta correcto.');
};
