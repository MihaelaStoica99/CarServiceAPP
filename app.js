// Require packages and set the port

const usersRoutes = require('./routes/usersRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const carRoutes = require('./routes/carsRoutes');
const clientRoutes = require('./routes/clientsRoutes');
const interventionRoutes = require('./routes/interventionsRoutes');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const express = require('express');
const port = 3002;
const app = express();
const session = require('express-session');
const { request } = require('express');
const { cars_search } = require('./controllers/carsController');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//for using static files
app.use(express.static('public'));

//set view engine to ejs
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {

    res.render("home");
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/registration', (req, res,) => {

    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {

    dbConn.query(`INSERT INTO ServiceMasini.dbo.UTILIZATORI (UserName, Parola)
                    VALUES ('${username}','${password}')`, (error, results) => {

        if (error) console.log(error);
        else {
        console.log("One recorded inserted");
        res.redirect('/login');
        }
    });
    }
});

app.use('/users-list', usersRoutes);
app.use('/employees', employeesRoutes);
app.use('/services', servicesRoutes);
app.use('/admin', adminRoutes);
app.use('/users', usersRoutes);
app.use('/cars', carRoutes);
app.use('/cars-search', carRoutes);
app.use('/clients', clientRoutes);
app.use('/clients-search', clientRoutes);
app.use('/interventions', interventionRoutes);
app.use('/interventions-search', interventionRoutes);

app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});

