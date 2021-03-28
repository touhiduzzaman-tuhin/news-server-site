const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.9mvne.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const newsCollection = client.db("newsData").collection("news");
  // perform actions on the collection object
//   client.close();
  console.log('Db Test');

  app.post('/addFakeNews', (req, res) => {
      const news = req.body;
      newsCollection.insertMany(news)
      .then(result => {
          res.send(result);
      })
  })

  app.post('/addSingleNews', (req, res) => {
      const singleNews = req.body;
      newsCollection.insertOne(singleNews)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })

  app.get('/news', (req, res) => {
      newsCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      }) 
  })

  app.get('/news/:id', (req, res) => {
    //   const id = req.param.id;
      newsCollection.find({_id : ObjectId(req.params.id)})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/editNews/:id', (req, res) => {
      newsCollection.find({_id : ObjectId(req.params.id)})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.patch('/updateNews/:id', (req, res) => {
      newsCollection.updateOne({_id : ObjectId(req.params.id)},
      {
          $set : {siteName : req.body.siteName, authorName : req.body.authorName, title : req.body.title, image : req.body.image, summary : req.body.summary}
      })
      .then(result => {
          res.send(result.matchedCount > 0)
      })
  })

  app.delete('/deleteNews/:id', (req, res) => {
      newsCollection.deleteOne({_id : ObjectId(req.params.id)})
      .then(result => {
          console.log(result);
          res.send(result.deletedCount > 0)
      })
  })

});


app.get('/', (req, res) => {
    res.send('Hello News Back-End Here');
})

app.listen(process.env.PORT || port);