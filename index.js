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


async function run() {
    try {
        await client.connect();
        const database = client.db("Yooda-Hostel");
        const foodCollection = database.collection("foodItems");
        const studentCollection = database.collection("students");
        const servedItemCollection = database.collection("servedItem");

        //food items all function start here

        // get all foodeitems
        app.get('/foodItems', async (req, res) => {
            const cursor = foodCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let foods;
            const count = await cursor.count();
            if (page) {
                foods = await cursor.skip(page * size).limit(size).toArray();
            } else {
                foods = await cursor.toArray();
            }


            res.send({
                count,
                foods
            });
        })

        // get single product details 
        app.get('/foodItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query)
            res.json(result);
        })
        // add single foodItems
        app.post('/foodItems', async (req, res) => {
            const food = req.body;
            const result = await foodCollection.insertOne(food)
            res.json(result);
        })

        //delete single food  
        app.delete('/foodItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.json(result)
        })

        // update food item details 
        app.put('/foodItems/:id', async (req, res) => {
            const id = req.params.id;
            const updateFood = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    foodId: updateFood.foodId,
                    foodName: updateFood.foodName,
                    price: updateFood.price,
                    category: updateFood.category,
                },
            };
            const result = await foodCollection.updateOne(query, updateDoc, options);
            res.json(result)

        })

        app.get('/students', async (req, res) => {

            let cursor;
            cursor = studentCollection.find({});
            const search = req.query.search;
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let students;
            const count = await cursor.count();
            if (page) {
                students = await cursor.skip(page * size).limit(size).toArray();
            } else if (search) {
                const query = { roll: { $regex: search, $options: '$i' } }
                cursor = studentCollection.find(query);
                students = await cursor.toArray();

            } else {
                students = await cursor.toArray();
            }
            res.send({
                count,
                students
            });


        })


        // get single student details 
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query)
            res.json(result);
        })
        // add single foodItems
        app.post('/students', async (req, res) => {
            const student = req.body;
            const result = await studentCollection.insertOne(student)
            res.json(result);
        })
        //delete single student  
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
            res.json(result)
        })
        // update food item details 
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updateStudent = req.body;



            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            let updateDoc
            if (updateStudent.checkBox) {
                updateDoc = {
                    $set: {
                        status: updateStudent.status,
                    },
                };
            } else {
                updateDoc = {
                    $set: {
                        name: updateStudent.name,
                        roll: updateStudent.roll,
                        age: updateStudent.age,
                        class: updateStudent.class,
                        hall: updateStudent.hall,
                        status: updateStudent.status,
                    },
                };
            }
            const result = await studentCollection.updateOne(query, updateDoc, options);
            res.json(result)

        })


        //serve item for student

        app.post('/servedItem', async (req, res) => {
            const student = req.body;
            const result = await servedItemCollection.insertOne(student)
            res.json(result);
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




