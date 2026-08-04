const { sh, shOut, loadConfig } = require('./utils');

module.exports = async function finish() {
  const config = loadConfig();
  const branch = shOut('git branch --show-current');
  if (!/^(feat|fix)\//.test(branch)) {
    throw new Error('Esta rama no sigue la convencion feat/ o fix/. Abortando.');
  }

  sh(`git push -u origin ${branch}`);
  sh(`gh pr create --base ${config.developBranch} --head ${branch} --fill`);
  console.log('PR abierto contra develop.');
};
