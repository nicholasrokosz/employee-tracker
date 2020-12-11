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

  const options = {
    Employees: {
      columns: 'first_name, last_name',
      table: 'employee',
    },
    Roles: {
      columns: 'title',
      table: 'role',
    },
    Departments: {
      columns: 'name',
      table: 'department',
    },
  };

  const { columns, table } = options[action];

  const data = await connection.query(`SELECT ${columns} FROM ??`, [table]);
  console.table(data);
  init();
}

async function addInfo() {
  const rolesArr = await connection.query('SELECT title, id FROM role');
  const depsArr = await connection.query('SELECT name, id FROM department');
  // console.log(rolesArr);

  const {
    action,
    first,
    last,
    role,
    title,
    salary,
    department,
    name,
  } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Info about what?',
      choices: ['Employees', 'Roles', 'Departments'],
    },
    {
      name: 'first',
      message: "Enter the employee's first name: ",
      when: answers => answers.action === 'Employees',
    },
    {
      name: 'last',
      message: "Enter the employee's last name: ",
      when: answers => answers.action === 'Employees',
    },
    {
      name: 'role',
      type: 'list',
      message: "Select the employee's role:",
      choices: rolesArr.map(i => i.title),
      when: answers => answers.action === 'Employees',
    },
    {
      name: 'title',
      message: "Enter the role's title: ",
      when: answers => answers.action === 'Roles',
    },
    {
      name: 'salary',
      message: "Enter the role's salary: ",
      when: answers => answers.action === 'Roles',
    },
    {
      name: 'department',
      type: 'list',
      message: "Select the role's department:",
      choices: depsArr.map(i => i.name),
      when: answers => answers.action === 'Roles',
    },
    {
      name: 'name',
      message: "Enter the department's name: ",
      when: answers => answers.action === 'Departments',
    },
  ]);

  const options = {
    Employees: {
      columns: 'first_name, last_name, role_id',
      table: 'employee',
      values: [first, last, rolesArr.filter(i => i.title === role)[0]?.id],
    },
    Roles: {
      columns: 'title, salary, department_id',
      table: 'role',
      values: [
        title,
        salary,
        depsArr.filter(i => i.name === department)[0]?.id,
      ],
    },
    Departments: {
      columns: 'name',
      table: 'department',
      values: [name],
    },
  };

  // console.log(options.Employees);

  const { columns, table, values } = options[action];

  const query = `INSERT INTO ${table} (${columns}) VALUES (${values
    .map(i => (typeof i === 'string' ? `"${i}"` : i))
    .join(', ')})`;

  // console.log(query);

  const data = await connection.query(query);
  console.log(`New ${table} added!`);
  init();
}
