const { sh, shOut, fetchTemplate, writeFile, loadConfig, path } = require('./utils');

module.exports = async function init(opts) {
  const config = loadConfig();
  const isRepo = shOut('git rev-parse --is-inside-work-tree 2>/dev/null || echo no');
  if (isRepo !== 'true') sh('git init');

  const remote = shOut('git remote get-url origin 2>/dev/null || echo none');
  if (remote === 'none') {
    const name = path.basename(process.cwd());
    sh(`gh repo create ${name} ${opts.private ? '--private' : '--public'} --source=. --remote=origin`);
  }

  sh(`git checkout -B ${config.developBranch}`);
  sh(`git push -u origin ${config.developBranch}`);
  sh(`git checkout -B ${config.baseBranch}`);
  sh(`git push -u origin ${config.baseBranch}`);
  sh(`git checkout ${config.developBranch}`);

  writeFile('.github/workflows/release.yml', await fetchTemplate('release-caller.yml'));
  writeFile('.github/workflows/pr-checks.yml', await fetchTemplate('pr-checks-caller.yml'));
  writeFile('.github/workflows/labeler.yml', await fetchTemplate('labeler-caller.yml'));
  writeFile('.github/labeler.yml', await fetchTemplate('labeler.yml'));
  writeFile('AGENTS.md', await fetchTemplate('AGENTS.md'));
  writeFile('commitlint.config.js', await fetchTemplate('commitlint.config.js'));
  writeFile('.wfrc.json', await fetchTemplate('.wfrc.json'));

  const [owner, repoName] = shOut('gh repo view --json nameWithOwner -q .nameWithOwner').split('/');
  for (const branch of [config.baseBranch, config.developBranch]) {
    sh(`gh api --method PUT repos/${owner}/${repoName}/branches/${branch}/protection \
      -f required_pull_request_reviews.required_approving_review_count=${config.requiredApprovingReviews} \
      -F required_status_checks.strict=true \
      -f required_status_checks.contexts[]=pr-checks \
      -F enforce_admins=true`);
  }

  sh('git add . && git commit -m "chore: bootstrap flujo git estandar" && git push');
  console.log('Repo bootstrapeado con el flujo estandar.');
};
