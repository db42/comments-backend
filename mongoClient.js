const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'objectComments';
const commentCollection = 'comments';
const userCollection = 'registeredUsers';

// Create a new MongoClient
const client = new MongoClient(url);

/**
 * Schema:
 *
 * Comment: {
 *  id:string,
 *  text: string,
 *  senderId: string,
 *  timestamp: Datetime,
 *  taggedIds: Array<string>,
 *  senderName: string,
 *  ownerId: string
 * }
 *
 }
 **/

// Use connect method to connect to the Server
let db;
client.connect(function (err) {
    db = client.db(dbName);
});

/**
 * comment = {
 *  metadataId: string,
 *  text: string,
 *  senderId: string,
 *  senderName: string,
 *  taggedIds: Array<string>,
 *  ownerId: string
 * }
 */
function insertComment(comment, cb) {
    db.collection(commentCollection).insertOne(
        {
            ...comment,
            timestamp: Date.now()
        },
        (err, result) => {
            if (err) console.log(err);
            cb(result.ops[0]);
        }
    );
}

function getComments(metadataId, cb) {
    const cursor = db.collection(commentCollection).find({ metadataId });
    const records = [];
    cursor.forEach(function (item) {
        if (item != null) {
            records.push(item);
        }
    }, function (err) {
        if (err) console.log(err);
        cb(records);
    }
    );
}

function registerNotification(params, cb) {
    db.collection(userCollection).updateOne(
        { userId: params.userId },
        params,
        {
            upsert: true
        },
        (err) => {
            if (err) console.log(err);
            console.log('Registration success');
            cb();
        }
    );
}

function getRegisteredToken(userId, cb) {
    const cursor = db.collection(userCollection).find({ userId });
    const records = [];
    cursor.forEach(function (item) {
        if (item != null) {
            records.push(item);
        }
    }, function (err) {
        if (err) console.log(err);

        cb(records[0]);
    });
}


module.exports = {
    insertComment,
    getComments,
    registerNotification,
    getRegisteredToken
};
