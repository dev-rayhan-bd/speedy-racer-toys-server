const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njyz70v.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db("toysStore").collection("carToys");
    // const indexKeys = { toyName: 1, price: 1 };
    // const indexOptions = { name: "toyNameprice" };
    // const result = await toysCollection.createIndex(indexKeys, indexOptions);

    app.get("/toys", async (req, res) => {
      const result = await toysCollection
        .find()
        .sort({ price: 1 })
        .limit(20)
        .toArray();
      res.send(result);
    });
    app.get("/toys/home/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });
    // api for tab implement
    app.get("/toys/:text", async (req, res) => {
      // console.log(req.params.text);
      if (req.params.text == "bike") {
        const result = await toysCollection
          .find({ category: req.params.text })
          .sort({ price: 1 })
          .toArray();
        // console.log(result);
        res.send(result);
      } else if (req.params.text == "mini-train") {
        const result = await toysCollection
          .find({ category: req.params.text })
          .sort({ price: 1 })
          .toArray();
        // console.log(result);
        res.send(result);
      } else {
        const result = await toysCollection
          .find({ category: req.params.text })
          .sort({ price: 1 })
          .toArray();
        // console.log(result);
        res.send(result);
      }
    });

    // // api for sorting
  
    app.get("/myToys", async (req, res) => {
      // console.log(req.query);
      const query = { sellerEmail: req.query.email };
      const result = await toysCollection.find(query).sort({price: Number(req.query.sortby)}).toArray();
      res.send(result);
      // console.log(result);
    });


    // api for search
    app.get("/toys/searchbyToy/:text", async (req, res) => {
      const text = req.params.text;

      const result = await toysCollection
        .find({
          $or: [{ toyName: { $regex: text, $options: "i" } }],
        })
        .toArray();
      res.send(result);
    });
    // post method
    app.post("/post-toys", async (req, res) => {
      const body = req.body;
      // console.log(body);
      const result = await toysCollection.insertOne(body);
      res.send(result);
    });

    // update a toy
    app.patch("/post-toys/:id", async (req, res) => {
      const id = req.params.id;
      const updateToy = req.body;
      console.log(updateToy);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };

      const updateDoc = {
        $set: {
          description: updateToy.description,
          price: updateToy.price,
          quantity: updateToy.quantity,
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    // delete toy

    app.delete("/post-toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Speedy car toys server is running on port ${port}`);
});
