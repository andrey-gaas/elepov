const { MongoClient } = require('mongodb');

class Mongo {
  static db = null;
  static users = null;
  static reports = null;

  static async connect() {
    const client = new MongoClient(
      'mongodb://gaas:o9OyV9SEue@mongodb.gpntbsib.ru:27017',
      {useNewUrlParser: true, useUnifiedTopology: true }
    );

    const result = await client.connect();

    Mongo.db = result.db('elepov');
    Mongo.users = Mongo.db.collection('users');
    Mongo.reports = Mongo.db.collection('reports');
  }
}

module.exports = Mongo;