const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '*****************';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.json({"foo": "bar"});
  // res.render('index', {weather: null, error: null});
})

const comments = [{'object_id': '34343434', 'text': 'hello world'}];

//Fetch all the comments
app.get('/comments', function (req, res) {
  res.json(comments);
  // res.render('index', {weather: null, error: null});
})

//Post comment
app.post('/comments', function (req, res) {
  let newComment = {
    object_id: req.body.object_id,
    text: req.body.text,
  }

  //TODO save in database
  comments.push(newComment);



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