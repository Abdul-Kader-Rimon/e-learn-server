const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors")
require("dotenv").config();
const port = 3000;

app.use(cors())

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


    app.get("/courses", async (req, res) => {
      const result = await
        courseCollection.find().toArray()
      
      
      res.send(result)
    })




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