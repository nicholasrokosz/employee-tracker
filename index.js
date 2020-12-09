const connection = require('./db/connection');
const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer');
const mysql = require('mysql');
console.log(logo(config).render());
init();

async function init() {
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View info', 'Add new info', 'Update existing info', 'Exit'],
  });

  switch (action) {
    case 'View info':
      viewInfo();
      break;
    case 'Add new info':
      addInfo();
      break;
    case 'Update existing info':
      updateInfo();
      break;
    case 'Exit':
      process.exit(0);
  }
}

async function viewInfo() {
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Info about what?',
    choices: ['Employees', 'Roles', 'Departments'],
  });

  const names = {
    Employees: 'first_name, last_name',
    Roles: 'title',
    Departments: 'name',
  };
  const tables = {
    Employees: 'employee',
    Roles: 'role',
    Departments: 'department',
  };

  // const placeholder1 = names[action];
  // const placeholder2 = tables[action];

  const data = await connection.query('SELECT ? FROM ??', [
    names[action],
    tables[action],
  ]);
  console.table(data);
  init();
}
