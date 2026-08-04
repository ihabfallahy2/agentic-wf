const { sh, shOut, loadConfig } = require('./utils');

module.exports = async function start({ type, title }) {
  const config = loadConfig();
  if (!['feat', 'fix'].includes(type)) {
    throw new Error('--type debe ser "feat" o "fix"');
  }

  try {
    shOut(`gh label create ${type} --color "0E8A16" --description "${type} label" 2>/dev/null`);
  } catch (_) {}

  const issueUrl = shOut(`gh issue create --title "${title}" --label "${type}" --assignee "@me" --body "Auto-creado por wf start"`);
  const issueNumber = issueUrl.split('/').pop();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const branch = `${type}/${issueNumber}-${slug}`;

  sh(`git checkout ${config.developBranch} && git pull`);
  sh(`git checkout -b ${branch}`);
  console.log(`Rama creada: ${branch} (issue #${issueNumber})`);
};
