const { sh, shOut, loadConfig } = require('./utils');

module.exports = async function start({ type, title }) {
  const config = loadConfig();
  if (!['feat', 'fix'].includes(type)) {
    throw new Error('--type debe ser "feat" o "fix"');
  }

  const issueUrl = shOut(`gh issue create --title "${title}" --label "${type}" --body "Auto-creado por wf start"`);
  const issueNumber = issueUrl.split('/').pop();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const branch = `${type}/${issueNumber}-${slug}`;

  sh(`git checkout ${config.developBranch} && git pull`);
  sh(`git checkout -b ${branch}`);
  console.log(`Rama creada: ${branch} (issue #${issueNumber})`);
};
