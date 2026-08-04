#!/usr/bin/env node
const { Command } = require('commander');
const init = require('../src/init');
const start = require('../src/start');
const finish = require('../src/finish');
const sync = require('../src/sync');

const program = new Command();
program.name('wf').description('CLI del flujo git estándar (issue → rama → PR → release)');

program.command('init')
  .description('Bootstrapea el flujo completo en un repo nuevo o existente')
  .option('--private', 'crear el repo como privado', true)
  .action(init);

program.command('start')
  .description('Crea un issue y su rama asociada')
  .requiredOption('--type <type>', 'feat | fix')
  .requiredOption('--title <title>', 'título del issue')
  .action(start);

program.command('finish')
  .description('Abre el PR de la rama actual contra develop')
  .action(finish);

program.command('sync')
  .description('Actualiza AGENTS.md y los workflows a la última versión de workflows-core')
  .action(sync);

program.parse();
