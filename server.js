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

app.post('/', function(req, res) {
  if (req.body && req.body.name)
  {
    // Insert Tracker into database
    mySQLConnection.query(
      'INSERT INTO tracker (name, unit, quantity) VALUES (?, ?, ?)',
      [req.body.name, req.body.unit, req.body.quantity],
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
              'INSERT INTO history (trackerid, date, quantity) VALUES (LAST_INSERT_ID(), ?, ?)',
              [dateString, req.body.quantity],
              function(err) {
                if (err) {
                  console.log("== Error inserting new tracker's history into database: ", err);
                  res.status(500).send("Error inserting new tracker's history into database: " + err);
                }

                // Respond with the new tracker's ID for the link in the entry
                res.status(200).send({
                  trackerID: trackerID
                });
              });
          } else {
            // Respond with the new tracker's ID for the link in the entry
            res.status(200).send({
              trackerID: trackerID
            });
          }
        });
      });

  } else {
    res.status(400).send("Tracker must have a name.");
  }
});

app.get('/track/:trackerid', function(request, response, next) {

  mySQLConnection.query('SELECT * FROM tracker WHERE id = ?',
  [request.params.trackerid],
  function(error, rows) {
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
              id: row.id,
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

app.post('/track/:trackerid', function(req, res)
{ // Quantity is required
  if (req.body && req.body.quantity)
  {
    // If no date is provided, use today
    var trackerDate = req.body.date;
    if (trackerDate === '') {
      var date = new Date();
      // Date format: MM/DD/YYYY with leading zeros as necessary
      trackerDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
        ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
    }
    // Insert History into database
    // TODO: Verify that the associated tracker exists
    mySQLConnection.query(
      'INSERT INTO history (trackerid, date, quantity) VALUES (?, ?, ?)',
      [req.params.trackerid, trackerDate, req.body.quantity],
      function (err, result) {
        if (err) {
          console.log("== ERROR: Failed to insert history into database: ", err);
          response.status(500).send("ERROR: Failed to insert history into database: " + err);
        }
        var id = result.insertId;

        // After inserting history, calculate the tracker's total quantity
        mySQLConnection.query(
          'SELECT SUM(quantity) AS totalQuantity FROM history WHERE trackerid=?',
          [req.params.trackerid], function (err, rows) {
          if (err) {
            console.log("== ERROR: Failed to calculate tracker's total quantity from database: ", err);
            response.status(500).send("ERROR: Failed to calculate tracker's total quantity from database: " + err);
          }
          // Update the tracker's quantity
          mySQLConnection.query('UPDATE tracker SET quantity=? WHERE id=?',
          [rows[0].totalQuantity, req.params.trackerid], function (err) {
            if (err) {
              console.log("== ERROR: Failed to update tracker's total quantity in database: ", err);
              response.status(500).send("ERROR: Failed to update tracker's total quantity in database: " + err);
            }

            mySQLConnection.query('SELECT unit FROM tracker WHERE id=?',
            [req.params.trackerid], function (err, rows) {
              if (err) {
                console.log("== ERROR: Failed to fetch tracker's unit from database: ", err);
                response.status(500).send("ERROR: Failed to fetch tracker's unit from database: " + err);
              }

              res.status(200).send({
                id: id,
                date: trackerDate,
                unit: rows[0].unit
              });
            });
          });
        });
    });

  } else {
    res.status(400).send("Quantity must be specified.");
  }
});

app.post('/track/:trackerid/remove/:historyid', function (req, res) {
  mySQLConnection.beginTransaction(function (err) {
    if (err) {
      console.log("== ERROR: Remove history transaction failed: ", err);
      res.status(500).send("ERROR: Remove history transaction failed: " + err);
    }

    mySQLConnection.query('DELETE FROM history WHERE id=?',
    [req.params.historyid],
    function(err) {
      if (err) {
        console.log("== ERROR: Failed to remove history: ", err);
        mySQLConnection.rollback();
        res.status(500).send("ERROR: Failed to remove history: " + err);
      }

      mySQLConnection.query(
      'SELECT SUM(quantity) AS totalQuantity FROM history WHERE trackerid=?',
      [req.params.trackerid], function (err, rows) {
        if (err) {
          console.log("== ERROR: Failed to calculate tracker's total quantity from database: ", err);
          mySQLConnection.rollback();
          res.status(500).send("ERROR: Failed to calculate tracker's total quantity from database: " + err);
        }

        mySQLConnection.query('UPDATE tracker SET quantity=? WHERE id=?',
        [rows[0].totalQuantity, req.params.trackerid], function (err) {
          if (err) {
            console.log("== ERROR: Failed to update tracker's total quantity in database: ", err);
            mySQLConnection.rollback();
            res.status(500).send("ERROR: Failed to update tracker's total quantity in database: " + err);
          }

          mySQLConnection.commit(function (err) {
            if (err) {
              console.log("== ERROR: Failed to commit remove history transaction: ", err);
              mySQLConnection.rollback();
              res.status(500).send("== ERROR: Failed to commit remove history transaction: " + err);
            }

            console.log("== POST: Removed history item (" + req.params.historyid + ") from database.");
            res.status(200).send();
          });
        });
      });
    });
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
