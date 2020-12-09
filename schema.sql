CREATE DATABASE staff_db;
USE staff_db;
CREATE TABLE department(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE role(
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT REFERENCES employee.id,
  FOREIGN KEY (role_id) REFERENCES role(id)
);