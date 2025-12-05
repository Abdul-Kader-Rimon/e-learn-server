const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();
const port = 3000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfwnnwz.mongodb.net/?appName=Cluster0`;

console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASS);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
 
    const db = client.db("e-learn")
    const courseCollection = db.collection("courses")
    const enrolledcourseCollection = db.collection("enrolled-courses")


    app.get("/courses", async (req, res) => {
      const { category } = req.query
      
      const query = {}
      if (category) {
        query.category = category
      }

      const result = await courseCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/courses/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await courseCollection.findOne({ _id: objectId });

      res.send(result)
    })

    app.get("/my-courses", async(req, res) => {
      const  email  = req.query.email
      const result = await courseCollection.find({ email: email }).toArray()
      res.send(result)
    })

    app.put("/update-course/:id", async (req, res) => {
      const data = req.body;
      const id = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      

      const updateCourse = {
        $set: data
      }

      const result = await courseCollection.updateOne(filter, updateCourse);

      res.send({
        success: true,
        result,
      })
    })

    app.delete("/delete-course/:id", async (req, res) => {
      const id = req.params
      const objectId = new ObjectId(id)
       
      const result = await courseCollection.deleteOne({ _id: objectId })
      
      res.send(result)
    })


    app.post("/courses", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      console.log(data);
      const result = await courseCollection.insertOne(data);

      res.send(result);
    });

    app.post("/enrolled-courses", async (req, res) => {
      const data = req.body
      console.log(data)

      const result = await enrolledcourseCollection.insertOne(data);

      res.send(result)
    });
    app.get("/enrolled-courses", async (req, res) => {
      const result = await enrolledcourseCollection.find().toArray();

      res.send(result)
    });




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
 
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" server is running find");
});

app.listen(port, () => {
  console.log(` server is  listening on port ${port}`);
});