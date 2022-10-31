const { MongoClient } = require('mongodb');

const uri = "mongodb://admin:admin@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256";

const client = new MongoClient(uri);

module.exports = {};
module.exports.run = function run() {
    try {
        const database = client.db("JSRF");
        return {
          getCollection: (coll) => database.collection(coll)
        };
    } catch (e) {
        console.error(e);
    }
}