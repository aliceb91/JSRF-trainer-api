const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

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