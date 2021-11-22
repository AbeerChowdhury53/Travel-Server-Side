const express = require('express')
require('dotenv').config()
var cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())

// mongo connect
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpi7f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

async function run() {
  try {
    await client.connect()
    console.log('database connect')
    const database = client.db('travale')
    const apiCollections = database.collection('services')
    const orderCollections = database.collection('order')


    // get api single 
    app.get('/apis/:id', async function (req, res) {
      const idp = req.params.id;

      console.log(req.body.e)
      const id = req.body.e || idp
      const query = { _id: ObjectId(id) }
      const result = await apiCollections.findOne(query);
      res.json(result)
    })



    //get all data 
    app.get('/apis', async (req, res) => {
      const cursor = apiCollections.find({});
      const users = await cursor.toArray();
      res.json(users);
      // res.json(users);
    })


    //get all data 
    app.get('/order', async (req, res) => {
      const cursor = orderCollections.find({});
      const users = await cursor.toArray();
      res.json(users);
      // res.json(users);
    })


    // post data
    app.post('/order', async function (req, res) {
      console.log(req.body)
      const doc = req.body;
      const result = await orderCollections.insertOne(doc);
      res.json(result)
    })

    // post data
    app.post('/apis', async function (req, res) {
      console.log(req.body)
      const doc = req.body;
      const result = await apiCollections.insertOne(doc);
      res.json(result)
    })

    app.delete('/order/:id', async function (req, res) {
      console.log(req.body.e)
      const id = req.body.e
      const query = { _id: ObjectId(id) }
      const result = await orderCollections.deleteOne(query);
      res.json(result)
    })

    //  put api
    app.put('/order/:id', async (req, res) => {
      // const id = req.params.id;
      const { _id, name, Price, descriotion, Image, assress, Mobile, status, email, serviceId } = req.body.e
      const id = _id
      console.log(_id)
      console.log('update user', req.body)
      const updateUser = "Complite";
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {          
          name:name,
          assress:assress,
          Mobile:Mobile,
          status:updateUser,
          email:email,
          serviceId:serviceId,
          descriotion:descriotion,
          Price:Price,
          image:Image
        },
      }
      const result = await orderCollections.updateOne(filter, updateDoc, options)
      res.json(result);
    })


  }
  finally {

  }
}

run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})