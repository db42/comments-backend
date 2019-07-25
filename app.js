const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const mongoClient = require('./mongoClient');

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
  // sendTestMessage();
  res.json({ "foo": "bar" });
  // res.render('index', {weather: null, error: null});
})

const comments = [{ 'object_id': '41004', 'text': 'hello world', 'sender_guid': 'shreya.raj', 'sender_name': 'Shreya', 'comment_timeStamp': '1:12pm', 'tagged_guids': 'shreya.raj' }];
const notificationsDict = { 'user_guid': 'device_token' };


//Fetch all the comments
app.get('/comments/:id', function (req, res) {
    console.log('Fetch API: ', req.params.id);
  mongoClient.getComments(req.params.id, (comments) => {
    res.json(comments);
  })
  // res.render('index', {weather: null, error: null});
})


//Post comment
app.post('/comments', function (req, res) {
  let newComment = {
    'metadataId': req.body.object_id,
    'ownerId': req.body.object_creator_guid,
    'text': req.body.text,
    'senderId': req.body.sender_guid,
    'senderName': req.body.sender_name,
    'taggedIds': req.body.taggedIds,
  };

  mongoClient.insertComment(newComment, (data) => {
    res.send(data);
    onNewComment(newComment);
  });
})

app.post('/register_token', function (req, res) {

  let notificationParams = {
    'userId': req.body.user_guid,
    'deviceToken':req.body.device_token
  };

  mongoClient.registerNotification(notificationParams, () => {
    res.send('success');
  });



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
});

app.get('/sendNotif', function(req, res) {
    const data = {
        "_id": "5d397a9fc34fdc3a7e86dc7a",
        "metadataId": "f90529ee-e3b2-4a2a-8227-c2dc8809d587",
        "ownerId": "bfa70956-50f0-413f-beba-5a68eaca0d5c",
        "text": "<span class='bk-anomaly-value-more'>2,203%</span> Higher <span class='bk-anomaly-measure'>Unique count User GUID</span> of <span class='bk-anomaly-new-attribute'>walmart</span> for <span class='bk-anomaly-filters'>Week of 07/08/2019(Mixpanel Time)</span> compared to average",
        "senderId": "0",
        "senderName": "SpotIQ Bot",
        "taggedIds": "",
        "timestamp": 1564048031303
    };
    onNewComment(data);
    res.sendStatus(200);
});

function onNewComment(newComment) {
    // mongoClient.getRegisteredToken(newComment.ownerId, (token) => {
    //     if (token) {
            // sendMessage(newComment.text, token.deviceToken);
    //     }
    // });
    const token = "dvf6DTBNQl4:APA91bE7QlrEJ6y3Q3lrkGhy2LWL8EmE_WCnSkzdARgSCxeFsqGAYtgsc2UoK1IJlLFliOADk7Jtb-wYDSgqTJPNBR1HR2-JLmAi6LnH1NxSKF4VMRtffrzU4siABMnmLvBIkracrb1n"
    sendMessage(newComment.text, newComment.metadataId, token);
}


function sendMessage(body, objectId, deviceToken) {
  var payload = {
    notification: {
      title: "New insight from Thoughtspot",
      body: (body || '').replace(/<.*?>|<\/.*?>/g, '')
    },
    data: {
        objectId
    }
  };

  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

//   const deviceToken = "dvf6DTBNQl4:APA91bE7QlrEJ6y3Q3lrkGhy2LWL8EmE_WCnSkzdARgSCxeFsqGAYtgsc2UoK1IJlLFliOADk7Jtb-wYDSgqTJPNBR1HR2-JLmAi6LnH1NxSKF4VMRtffrzU4siABMnmLvBIkracrb1n";

  admin.messaging().sendToDevice(deviceToken, payload, options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
