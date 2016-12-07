var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./config.json');

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

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  mySQLConnection.query('SELECT * FROM tracker', function(error, rows) {
    if (error) {
      console.log("== Error fetching trackers from the database: ", error);
      response.status(500).send("Error fetching trackers from the database: " + error);
    } else {
      var trackers = [];
      rows.forEach(function(row) {
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

app.post('/', function(req, res, next) {
  if (req.body && req.body.name)
  {
    // Insert Tracker into database
    mySQLConnection.query(
      'INSERT INTO tracker (name, unit, quantity) VALUES (?, ?, ?)', [req.body.name, req.body.unit, req.body.quantity],
      function(error, result) {
        if (error) {
          console.log("== Error inserting tracker into database:", error);
          res.status(500).send("Error inserting tracker into database: " + error);
        }

        // After tracker has been inserted, get its ID
        mySQLConnection.query('SELECT LAST_INSERT_ID() AS trackerID', function(error, result) {
          if (error) {
            console.log("== Error getting ID of inserted tracker:", error);
            res.status(500).send("Error getting ID fo inserted tracker: " + error);
          }
          var trackerID = result[0].trackerID;

          // If the new tracker has a starting quantity, store a historyItem
          if (req.body.quantity != 0) {
            var date = new Date();
            var dateString = ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
              ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();

            mySQLConnection.query(
              'INSERT INTO history (trackerid, date, quantity) VALUES (LAST_INSERT_ID(), ?, ?)', [dateString, req.body.quantity],
              function(err, result) {
                if (err) {
                  console.log("== Error inserting new tracker's history into database: ", err);
                  res.status(500).send("Error inserting new tracker's history into database: " + err);
                }
              });
          }

          // Respond with the new tracker's ID for the link in the entry
          res.status(200).send({
            trackerID: trackerID
          });

        });
      });

  } else {
    res.status(400).send("Tracker must have a name.");
  }
});

app.get('/track/:trackerid', function(request, response, next) {

  mySQLConnection.query('SELECT * FROM tracker WHERE id = ?', [request.params.trackerid], function(error, rows) {
    if (error) {
      console.log("== Error fetching tracker (", request.params.trackerid, ") from database: ", error);
      res.status(500).send("Error fetching tracker from database: " + error);
    } else if (rows.length >= 1) {
      var tracker = rows[0];

      mySQLConnection.query('SELECT * FROM history WHERE trackerid = ?', [request.params.trackerid], function(error, rows) {
        if (error) {
          console.log("== Eror fetching history for tracker (", request.params.trackerid, ") from database: ", error);
          res.status(500).send("Error fetching history for tracker from database: " + error);
        } else {
          var history = [];
          rows.forEach(function(row) {
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

app.get('*', function(request, response) {
  response.status(404);
  response.render('404', {
    title: '404: Page Not Found'
  });
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
