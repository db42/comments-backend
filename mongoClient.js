const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'objectComments';
const collectionName = 'comments';

// Create a new MongoClient
const client = new MongoClient(url);

/**
 * Schema:
 * 
 * Comment: {
 *  id: string,
 *  text: string,
 *  senderId: string,
 *  timestamp: Datetime,
 *  taggedIds: Array<string>,
 *  senderName: string,
 *  ownerId: string
 * }
 * 
 */

// Use connect method to connect to the Server
function connectDB(fn) {
    client.connect(function(err) {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        fn(collection, db, () => client.close());
    });
}

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
    // const promise = new Promise()
    connectDB(function(collection, db, closeCon) {
        collection.insertOne(
            {
                ...comment,
                timestamp: Date.now()
            },
            () => {
                cb();
                closeCon()
            }
        );
    });
}

function getComments(metadataId, cb) {
    // const promise = new Promise()
    connectDB(function(collection, db, closeCon) {
        const cursor = collection.find({ metadataId });
        const records = [];
        cursor.forEach(function(item) {
            if (item != null) {
                records.push(item);
            }
        }, function(err) {
            cb(records);
            db.close();
           }
        );
    });
}

module.exports = {
    insertComment,
    getComments
};