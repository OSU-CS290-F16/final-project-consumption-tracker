var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var config = require('./config.json');

var ItemTest = require('./ItemTest.json');

var app = express();
var port = process.env.PORT || 3000;


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use("/styles", express.static(__dirname + 'public/styles'));
app.use("/index", express.static(__dirname + 'public/index'));



app.get('/', function (request, response) {
  response.render('index', {title: 'Consumption Tracker', item: ItemTest});
});

app.get('/track/:trackerid', function (request, response) {
  var tracker = ItemTest[request.params.trackerid];

  response.render('tracker', {
    title: tracker.name + ' Tracker',
    tracker: tracker
  });
});

app.get('*', function (request, response) {
  response.status(404);
  response.render('404', {title: '404: Page Not Found'});
});

app.listen(port, function () {
  console.log('== Listening on port', port);
});
