const express = require('express');
const knex = require('knex');
const { Model } = require('objection');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'Shiva',
    password: '495520',
    database: 'mern_app',
  },
});
Model.knex(db);

class User extends Model {
  static get tableName() {
    return 'users';
  }
}

class Task extends Model {
  static get tableName() {
    return 'tasks';
  }
}

app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const users = await User.query();
  res.render('addUser', { users });
});

app.post('/users/create', async (req, res) => {
  const { name, email, mobile } = req.body;
  await User.query().insert({ name, email, mobile });
  res.redirect('/');
});

app.get('/tasks', async (req, res) => {
  const users = await User.query();
  res.render('addTask', { users });
});

app.post('/tasks/create', async (req, res) => {
  const { user_id, task_name, task_type } = req.body;
  await Task.query().insert({ user_id, task_name, task_type });
  res.redirect('/tasks');
});

app.get('/export', async (req, res) => {
  const users = await User.query();
  const tasks = await Task.query();

  const workbook = new ExcelJS.Workbook();
  const userSheet = workbook.addWorksheet('Users');
  const taskSheet = workbook.addWorksheet('Tasks');

  userSheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Mobile', key: 'mobile' },
  ];
  users.forEach(user => userSheet.addRow(user));

  taskSheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'User ID', key: 'user_id' },
    { header: 'Task Name', key: 'task_name' },
    { header: 'Task Type', key: 'task_type' },
  ];
  tasks.forEach(task => taskSheet.addRow(task));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await Task.query().where('user_id', id);
  res.json(tasks);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
