const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
app.use(express.json())
const port = process.env.PORT || 5000
// middleware
var cors = require('cors')
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9clk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Yooda-Hostel
// vDSwRN7XeAkGZVZT

async function run() {
    try {
        await client.connect();
        const database = client.db("Yooda-Hostel");
        const foodCollection = database.collection("foodItems");



        // get all foodeitems
        app.get('/foodItems', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })

        // add single foodItems
        app.post('/foodItems', async (req, res) => {
            const food = req.body;
            const result = await foodCollection.insertOne(food)
            res.json(result);
        })

        // single food delete 
        app.delete('/foodItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            console.log(result);
            res.json(result)
        })












    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Node Server ok')
})

app.listen(port, () => {
    console.log(`Running Node Server at http://localhost:${port}`)
})




