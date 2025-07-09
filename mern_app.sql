CREATE DATABASE IF NOT EXISTS mern_app;
USE mern_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  mobile VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  task_name VARCHAR(255),
  task_type ENUM('Pending', 'Done'),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
