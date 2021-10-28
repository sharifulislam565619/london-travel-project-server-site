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

        // get all data
        app.get('/hotels', async (req, res) => {
            const result = await hotels.find({}).toArray()
            res.json(result);
        })

        // get single data
        app.get('/hotels/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await hotels.findOne(query);
            res.json(result);


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