var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');


var app = express();
var port = process.env.PORT || 3000;


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use("/styles", express.static(__dirname + 'public/styles'));
app.use("/index", express.static(__dirname + 'public/index'));
app.use(express.static(path.join(__dirname, 'public')));
var ItemTest = require('./ItemTest.json');

app.get('/', function (request, response) {
  response.render('index', {title: 'Consumption Tracker', item: ItemTest});
});

app.get('/track/:data', function (request, response) {
  response.render('tracker', {title: 'Consumption Tracker'}); // TODO: Pass in entries, update title to reflect the dat
});

app.get('*', function (request, response) {
  response.status(404);
  response.render('404', {title: '404: Page Not Found'});
});

app.listen(port, function () {
  console.log('== Listening on port', port);
});
