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
        const productsCollection = database.collection("foodItem");



        // get all products or  products by search result
        app.get('/foodItem', async (req, res) => {
            const search = req.query.search;
            if (search) {
                const query = { productName: { $regex: search, $options: '$i' } }
                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            } else {
                const cursor = productsCollection.find({});
                const products = await cursor.toArray();
                res.send(products);
            }

        })












    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Node Server')
})

app.listen(port, () => {
    console.log(`Running Node Server at http://localhost:${port}`)
})




