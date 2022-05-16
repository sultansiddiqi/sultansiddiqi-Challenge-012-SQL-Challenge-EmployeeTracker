const inquirer = require('inquirer');
const mysql = require('mysql');
const figlet = require('figlet');
const cTable = require('console.table');


const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",

	//ADD YOUR MYSQL ROOT PASSWORD HERE!!!!
	password: "password123",
	database: "employee_db",
});

function init() {
	inquirer
		.prompt({
			name: 'choice',
			type: 'list',
			message: 'What would you like to do?',
			choices: [
				'View all Employees.',
				'View Salaries.',
				'View all Departments.',
				'View all Roles.',
				'Update Employee Role.',
				'Add Department, Role, or Employee.',
				'Exit'
			],
		})
		.then((res) => {
			switch (res.choice) {
				case 'View all Employees.':
					employeeSearch();
					break;
				case 'View Salaries.':
					employeeSalaries();
					break;
				case 'Add Department, Role, or Employee.':
					addOption();
					break;
				case 'View all Departments.':
					showDept();
					break;
				case 'View all Roles.':
					showRoles();
					break;
				case 'Update Employee Role.':
					updateRole();
					break;
				default:
					console.log('Thanks for using the app!');
					connection.end();
					break;
			}
		});
};

function employeeSearch() {
	connection.query(
		`SELECT 
			CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
			r.title AS 'Title',
			d.name AS 'Department'
		  FROM employee e
		  LEFT JOIN role r ON e.role_id = r.id
			LEFT JOIN department d ON r.department_id = d.id
			ORDER BY e.first_name`,
		(err, res) => {
			if (err) throw err;
			console.table("-Employees-", res);
			init();
		}
	);
};

function employeeSalaries() {
	connection.query(
		`SELECT 
		CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
		r.salary AS 'Salary'
		FROM employee e
		LEFT JOIN role r ON e.role_id = r.id
		ORDER BY e.first_name`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function showDept() {
	connection.query(
		`SELECT * FROM department ORDER BY id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function showRoles() {
	connection.query(
		`SELECT * FROM role ORDER BY id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Results-", res);
			init();
		}
	);
};

function updateRole() {
	connection.query(
		`SELECT
		e.id AS 'ID',
		CONCAT(e.first_name, ' ', e.last_name) AS 'Name',
		r.title AS 'Role'
		FROM employee e
		LEFT JOIN role r ON e.role_id = r.id
		ORDER BY e.id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Current Employee Roles-", res);
		}
	);

	connection.query(
		`SELECT id AS 'ID', title AS 'ROLE' FROM role ORDER BY id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Available Roles-", res);
		}
	);
	setTimeout(function(){
		inquirer
		.prompt([
			{
			name: 'updateID',
			type: 'input',
			message: 'Select the ID of the employee you want to update.'
		},
		{
			name: 'roleID',
			type: 'input',
			message: 'Select the ID of the role you want.'
		}
		]).then((res) =>{
			connection.query(
				'UPDATE employee SET ? WHERE ?',
				[
					{
						role_id: res.roleID
					},
					{
						id: res.updateID
					}
				],	
				// `UPDATE employee
				// SET role_id = ${res.roleID} 
				// WHERE id = ${res.updateID} `,
				(err, res) => {
					if (err) throw err;
					console.log("Role Updated");
					init();
				})
		}); 
	}, 1000);

};

function addOption() {
	inquirer
	.prompt([
		{
			name: 'add',
			type: 'list',
			message: 'Select an option to add',
			choices: ['Department', 'Role', 'Employee', 'Exit']
		}
	]).then((res) => {
		switch (res.add) {
			case 'Department':
				addDepartment();
				break;
			case 'Role':
				addRole();
				break;
			case 'Employee':
				addEmployee();
				break;
			default:
				init();
				break;
		}
	})
};

function addDepartment() {
	inquirer
	.prompt([
		{
			name: 'dept',
			type: 'input',
			message: 'What department would you like to add?'
		}
	]).then((res) => {
		connection.query(
			`INSERT INTO department (name)
			VALUES ('${res.dept}')`,
			(err, res) => {
				if (err) throw err;
				console.table(`${res.affectedRows} department added.`);
				init();
			}
		)
	})
};
function addRole() {
	connection.query(
		`SELECT * FROM department ORDER BY id`,
		(err, res) => {
			if (err) throw err;
			console.table("-Roles can only be added to current department ID's-", res);
		}
	);

	setTimeout(function(){
		inquirer
		.prompt([
			{
				name: 'role',
				type: 'input',
				message: 'What role would you like to add?'
			},
			{
				name: 'salary',
				type: 'input',
				message: 'What is that roles salary?'
			},
			{
				name: 'deptId',
				type: 'input',
				message: 'What is the roles department ID?'
			}
		]).then((res) => {
			connection.query(
				'INSERT INTO role SET ?',
				{
					title: `${res.role}`,
					salary: res.salary,
					department_id: res.deptId
				},
				// `INSERT INTO roles (title, salary, department_id)
				// VALUES ('${res.role}', ${res.salary}, ${res.deptId})`,
				(err, res) => {
					if (err) throw err;
					console.table('Role Added.');
					init();
				}
			)
		})
	}, 1000);
};

function addEmployee() {
	inquirer
	.prompt([
		{
			name: 'fname',
			type: 'input',
			message: 'What is the first name of the Employee?'
		},
		{
			name: 'lname',
			type: 'input',
			message: 'What is the last name of the employee?'
		},
		{
			name: 'roleId',
			type: 'input',
			message: 'What is role id of the employee?'
		}
		// {
		// 	name: 'manId',
		// 	type: 'input',
		// 	message: 'What id the roles department ID, leave blank if no manager?'
		// }
	]).then((res) => {
		connection.query(
			// 'INSERT INTO employee VALUES ?',
			// {
			// 	first_name: `${res.fname}`,
			// 	last_name: `${res.lname}`,
			// 	role_id: res.roleId,
			// 	manager_id: res.manId
			// },
			`INSERT INTO employee (first_name, last_name, role_id, manager_id)
			VALUES ('${res.fname}', '${res.lname}', ${res.roleId}, NULL)`,
			(err, res) => {
				if (err) throw err;
				console.table('Employee Added.');
				init();
			}
		)
	})
};

connection.connect((err) => {
	if (err) throw err;
	console.log('----------------------------------------------------------------------------------');
	console.log(figlet.textSync('Employee Tracker', {
		//cosmike font looks cool
		font: 'Star Wars',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 120,
		whitespaceBreak: true
	}));
	console.log('----------------------------------------------------------------------------------');
	console.log('\n');
	init();
});