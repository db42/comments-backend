const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '*****************';
var admin = require("firebase-admin");

var serviceAccount = require("./commentbackend-firebase-adminsdk-hd4rr-a809e69fd1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://commentbackend.firebaseio.com"
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')

app.get('/comments', function (req, res) {
  res.json({"foo": "bar"});
  // res.render('index', {weather: null, error: null});
})

const comments = [{'object_id': '41004', 'text': 'hello world', 'sender_guid':'shreya.raj', 'sender_name':'Shreya', 'comment_timeStamp':'1:12pm', 'tagged_guids':'shreya.raj'}];
const notificationsDict = {'demo_user_id': 'demo token';}
//Fetch all the comments
app.get('/comments', function (req, res) {
  res.json(comments);
  // res.render('index', {weather: null, error: null});
})

//Post comment
app.post('/comments', function (req, res)
{
  let newComment = {
    'object_id': req.body.object_id,
    'object_creator_guid':req.body.object_creator_guid,
    'text': req.body.text,
    'sender_guid': req.body.sender_guid,
    'sender_name':req.body.sender_name,
    'comment_timeStamp': req.body.comment_timeStamp,
    'tagged_guids':req.body.shreya.raj,
  };
  console.log(req.body);
  //TODO save in database
  comments.push(newComment);

  res.sendStatus(200);
}


  app.post('/register_token', function(req, res) {
    let user_guid = req.body.user_guid;
    let device_token = req.body.device_token;

    notificationsDict[user_guid] = device_token;
    res.sendStatus(200);
}



  // let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  // request(url, function (err, response, body) {
  //   if(err){
  //     res.render('index', {weather: null, error: 'Error, please try again'});
  //   } else {
  //     let weather = JSON.parse(body)
  //     if(weather.main == undefined){
  //       res.render('index', {weather: null, error: 'Error, please try again'});
  //     } else {
  //       let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  //       res.render('index', {weather: weatherText, error: null});
  //     }
  //   }
  // });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
