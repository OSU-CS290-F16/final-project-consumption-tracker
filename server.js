var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var config = require('./config.json');
var mysql = require('mysql');

var app = express();
var port = process.env.PORT || 3000;

var mySQLConnection = mysql.createConnection({
  host: config.mySQLHost,
  user: config.mySQLUser,
  password: config.mySQLPassword,
  database: config.mySQLDB
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
  mySQLConnection.query('SELECT * FROM tracker', function (error, rows) {
    if (error) {
      console.log("== Error fetching trackers from the database: ", error);
      response.status(500).send("Error fetching trackers from the database: " + error);
    } else {
      var trackers = [];
      rows.forEach(function (row) {
        trackers.push({
          id: row.id,
          name: row.name,
          type: row.type,
          unit: row.unit,
          quantity: row.quantity
        });
      });

      response.render('index', {
        title: 'Consumption Tracker',
        trackers: trackers
      });
    }
  });
});

app.get('/track/:trackerid', function (request, response, next) {

  mySQLConnection.query('SELECT * FROM tracker WHERE id = ?', [request.params.trackerid], function (error, rows) {
    if (error) {
      console.log("== Eror fetching tracker (", request.params.trackerid, ") from database: ", error);
      res.status(500).send("Error fetching tracker from database: " + error);
    }
    else if (rows.length >= 1)
    {
      var tracker = rows[0];

      mySQLConnection.query('SELECT * FROM history WHERE trackerid = ?', [request.params.trackerid], function (error, rows) {
        if (error) {
          console.log("== Eror fetching history for tracker (", request.params.trackerid, ") from database: ", error);
          res.status(500).send("Error fetching history for tracker from database: " + error);
        } else {
          var history = [];
          rows.forEach(function (row) {
            history.push({
              date: row.date,
              quantity: row.quantity
            });
          });

          response.render('tracker', {
            title: tracker.name + ' Tracker',
            tracker: tracker,
            history: history
          });
        }
      });
    } else {
      next();
    }
  });
});

app.get('*', function (request, response) {
  response.status(404);
  response.render('404', {title: '404: Page Not Found'});
});

mySQLConnection.connect(function(error) {
  if (error) {
    console.log("== Unable to make connection to MySQL Database.");
    throw error;
  }
  app.listen(port, function() {
    console.log('== Listening on port', port);
  });
});
