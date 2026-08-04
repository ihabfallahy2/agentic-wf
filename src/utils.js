const { execSync } = require('node:child_process');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_TEMPLATES_REPO = 'ihabfallahy2/workflows-core';
const DEFAULT_TEMPLATES_REF = 'v1';

function sh(cmd) {
  return execSync(cmd, { stdio: 'inherit' });
}

function shOut(cmd) {
  return execSync(cmd).toString().trim();
}

function loadConfig() {
  const configPath = path.join(process.cwd(), '.wfrc.json');
  const defaults = {
    templatesRepo: DEFAULT_TEMPLATES_REPO,
    templatesRef: DEFAULT_TEMPLATES_REF,
    baseBranch: 'master',
    developBranch: 'develop',
    requiredApprovingReviews: 1
  };
  if (!fs.existsSync(configPath)) return defaults;
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
  } catch (e) {
    return defaults;
  }
}

function fetchTemplate(relPath) {
  const config = loadConfig();
  const repo = config.templatesRepo || DEFAULT_TEMPLATES_REPO;
  const ref = config.templatesRef || DEFAULT_TEMPLATES_REF;
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/templates/${relPath}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`No se pudo descargar ${relPath} desde ${url} (HTTP status ${res.statusCode})`));
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function writeFile(relPath, content) {
  const full = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

module.exports = { sh, shOut, fetchTemplate, writeFile, loadConfig, DEFAULT_TEMPLATES_REPO, DEFAULT_TEMPLATES_REF, path };
