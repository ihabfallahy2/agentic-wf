const { sh, shOut, loadConfig } = require('./utils');

module.exports = async function finish() {
  const config = loadConfig();
  const branch = shOut('git branch --show-current');
  if (!/^(feat|fix)\//.test(branch)) {
    throw new Error('Esta rama no sigue la convencion feat/ o fix/. Abortando.');
  }

  const match = branch.match(/^(?:feat|fix)\/(\d+)-/);
  const closesKeyword = match ? `Closes #${match[1]}` : '';
  const prBody = closesKeyword ? `${closesKeyword}\n\nAuto-creado por wf finish` : 'Auto-creado por wf finish';

  sh(`git push -u origin ${branch}`);
  sh(`gh pr create --base ${config.developBranch} --head ${branch} --body "${prBody}" --fill`);
  console.log(`PR abierto contra develop${closesKeyword ? ` (vinculado a #${match[1]})` : ''}.`);
};
