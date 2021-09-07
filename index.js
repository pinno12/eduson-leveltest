const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db2 = require('./models');



passport.use(new Strategy(
  function(username, password, cb) {
    db2.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));



passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db2.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


const app = express();


app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


app.get("/level", (req, res) => {
  res.render("level", { model: {} });
});

// POST /create
app.post("/level", (req, res) => {
  const sql = "INSERT INTO level (name, phone, eduson_id, TestType, Level, Date, score) VALUES (?,?,?,?,?,?,?)";
  const book = [req.body.name, req.body.phone,req.body.eduson_id, req.body.TestType, req.body.Level, req.body.Date, req.body.score ];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/login");
  });
});


app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });



// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de donnée SQlite
const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("연결합니다 'apptest.db'");
});



// Démarrage du serveur
app.listen(8080, () => {
    console.log("Serveur démarré ( http://localhost:8080/ ) !");
});


app.get("/", function (req, res) {
  res.redirect("/001001/210803");
 });


let months = [ 210315, 2104,2105, 2106, 210701, 210803, 210902]


 app.get("/:category/:month",  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  
  var category= req.params.category;
  var month = req.params.month;
  
  // now

  let now = 6;
     console.log('month:',month);
 
  if(category){
    db.all(`SELECT * FROM all_3 WHERE category = '${category}' AND date = '${month}' 
    ORDER BY  sales_qty DESC, first_img`, (err, rows)  => {
      if(err) {
        console.log(err);

        res.status(500).send(err);
      } else {
      
        res.render('base', { hoodies: rows, months:months, user: req.user});
      }    
    });
  }else {    
  
    res.status(500).send('Internal Server Error');
  }
});


app.get("/:category/:month/:item",  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  
  var category= req.params.category;
  var month = req.params.month;
  let item = req.params.item;

  let now = 4;
     console.log('month:',month);
 
  if(category){
    db.all(`SELECT * FROM all_3 WHERE category = '${category}' AND date = '${month}'  AND link = 'https://store.musinsa.com/app/goods/${item}'
    ORDER BY  sales_qty DESC, first_img`, (err, rows)  => {
      if(err) {
        console.log(err);
        res.status(500).send(err);
      } else {      
        res.render('base', { hoodies: rows, months:months, user: req.user});
      }    
    });
  }else {      
    res.status(500).send('Internal Server Error');
  }
});
