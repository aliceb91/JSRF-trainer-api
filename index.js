const express = require('express');
const cors = require('cors');
const database = require('./database');
const { ObjectId } = require('mongodb');
const app = express();
app.use(cors());
const port = 8000;

const db = database.run()

function objectId(string) {
  try {
    return ObjectId(string);
  } catch (e) {
    return string;
  }
}

function randomise(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

app.get('/zones', async (req, res) => {
  const zones = await db.getCollection("Zones").find({}, {projection: {_id: 1, name: 1, objectiveCount: {$size: '$objectives'}}}).toArray();
  res.json(zones);
})

app.get('/zones/:zoneId', async (req, res) => {
  const zone = objectId(req.params.zoneId);
  const number = parseInt(req.query.number);
  const hasGraf = req.query.graffiti === 'true';
  const hasChar = req.query.character === 'true';
  const obj = await db.getCollection("Zones").findOne({_id: zone});
  const arr = obj.objectives;
  const randArr = randomise(arr);
  let cutArr = []
  if (!hasGraf && !hasChar) {
    cutArr = randArr.filter((x) => {
      return x.type !== "Graffiti" && x.type !== "Character";
    });
  } else if (!hasGraf && hasChar) {
    cutArr = randArr.filter((x) => {
      return x.type !== "Graffiti";
    });
  } else if (hasGraf && !hasChar) {
    cutArr = randArr.filter((x) => {
      return x.type !== "Character";
    });
  } else {
    cutArr = randArr;
  };
  res.json(cutArr.slice(0, number));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app