const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser= require('body-parser');
const notifier = require('node-notifier');
const path = require('path');
const cronJob = require('cron').CronJob;
const app = express();
const hbs = exphbs.create();

let job;
let db;

// set up view engine to use handlebars with .html file extension
app.engine('html', hbs.engine);
app.set('view engine', 'html');
// set root as view directory
app.set('views', 'views');
app.set('public', 'public');

// middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))

MongoClient.connect('mongodb://kmak:buckybear97@ds023442.mlab.com:23442/volt-project', (err, database) => {
  if (err) return console.log(err)

  db = database;

  // init server
  app.listen(3000, function(){
    console.log('listening on 3000')
  })
})

// routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


app.post('/challenge', (req, res) => {

  db.collection('challenges').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database');
    setScheduler(req, res, () => {
      res.redirect(`/month/${req.body.month}`)
    });
  })

})

// render monthly challenge by month
app.get('/month/:month', (req, res) => {

  db.collection('challenges').findOne({ month: req.params.month }, (err, result) => {
    if (err) return res.send(err);

    res.render('month.html', { result })
  })

})

// delete monthly challenge
app.delete('/month/:month', (req, res) => {
  db.collection('challenges').findOneAndDelete({ month: req.params.month }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('deleted');
  })
})


// set notifier per form request

function setNotifier(req, res) {
  notifier.notify({
    title: 'Be awesome today',
    icon: path.join(__dirname, 'inkandvoltfav.png'),
    message: req.body.challenge,
    sound: false,
    wait: true
  });
}

function processTime(input) {
  const timeArray = input.split(':');
  const hour = timeArray[0];
  const minute = timeArray[1];

  return { hour, minute };
}

function getMonthIndex(month) {
  const indexMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
  }

  return indexMap[month];
}

// set scheduler per form request
function setScheduler(req, res, callback) {
  const { hour, minute } = processTime(req.body.notificationTime);
  const month = getMonthIndex(req.body.month);

  job = new cronJob({
    cronTime: `00 ${minute} ${hour} * ${month} *`,
    onTick: function() {
      setNotifier(req, res)
    },
    start: false,
  });

  job.start();
  callback();
}

function cancelScheduler() {
  job.stop();
  console.log('existing job cancelled');
}


