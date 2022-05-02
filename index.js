#!/usr/bin/env node

import inquirer from 'inquirer';
import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import createDirectoryContents from './createDirectoryContents.js';
import chalk from 'chalk';

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'checkbox',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
  },
];

inquirer.prompt(QUESTIONS).then(answers => {
  const projectChoices = answers['project-choice'];
  const projectName = answers['project-name'];
  fs.mkdirSync(`${CURR_DIR}/${projectName}`);
  if(projectChoices.length === 1) {
    const templatePath = `${__dirname}/templates/${projectChoices[0]}`;
    createDirectoryContents(templatePath, projectName);
  } else {
    projectChoices.forEach(choice => {
        fs.mkdirSync(`${CURR_DIR}/${projectName}/${choice}`);
        let templatePath = `${__dirname}/templates/${choice}`;
        createDirectoryContents(templatePath, `${projectName}/${choice}`);
    })
  }
  console.log(chalk.green('Project was created succsessfuly!'));
});