const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2wssq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
   try {
      await client.connect();
      const database = client.db("london-travel");
      const hotels = database.collection("hotels");

      const database2 = client.db("allOrder");
      const orders = database2.collection("orders");

      // insert a hotel
      app.post("/addHotel", async (req, res) => {
         const data = req.body;
         const doc = {

            name: data.name,
            description: data.description,
            charge: data.charge,
            img: data.img
         }
         const result = await hotels.insertOne(doc);
         res.json(result)
         console.log(result);

      })

      // get all hotels data
      app.get('/hotels', async (req, res) => {
         const result = await hotels.find({}).toArray()
         res.json(result);
      })

      // get all orders data
      app.get("/manageOrders", async (req, res) => {

         const cursor = await orders.find({}).toArray();
         res.send(cursor)

      })

      // get MyOrders
      app.get("/myOrders/:email", async (req, res) => {
         const result = await orders.find({
            email: req.params.email,
         }).toArray();
         res.send(result);
      });

      // update status
      app.put("/status/:id", async (req, res) => {

         const id = req.params.id
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               status: req.body.status
            },
         };
         const result = await orders.updateOne(filter, updateDoc, options);
         res.json(result)


      })

      // delete orders
      app.delete("/delete/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) }
         const result = await orders.deleteOne(query)
         res.json(result)
         console.log(result);
      })

      // get single data
      app.get('/hotels/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: ObjectId(id) };
         const result = await hotels.findOne(query);
         res.json(result);
      })



      // post a single data
      app.post("/booking", async (req, res) => {
         const data = req.body;
         const doc = {
            Order_Id: data.Id,
            name: data.name,
            emailAddress: data.emailAddress,
            phone: data.phone,
            date: data.date,
            status: data.status,
            description: data.description,
            email: data.email
         }
         const result = await orders.insertOne(doc);
         res.json(result)
         console.log(result);
      })


   } finally {
      // await client.close()
   }
}
run().catch(console.dir)



app.get('/', (req, res) => {
   res.send("Travel london site is running");
})

app.listen(port, () => {
   console.log("Running port is", port);
})