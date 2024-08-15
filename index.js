const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// shopSort11
// C8Gdyyb6b41wROQw



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rz0kihv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("shopSortDB");
    const productsCollection = database.collection("products");


    // all products
    app.get("/products", async (req, res) => {
      const search = req.query.search || "";
      const brand = req.query.brand || "";
      const category = req.query.category || "";
      const priceRange = req.query.priceRange || "";
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      console.log(page, size)
      const query = {
        $and: []
      };
       // Search by product name
    if (search) {
      query.$and.push({
          productName: { $regex: search, $options: "i" }
      });
  }

  // Filter by brand
  if (brand) {
      query.$and.push({
          brand: { $regex: brand, $options: "i" }
      });
  }

  // Filter by category
  if (category) {
      query.$and.push({
          category: { $regex: category, $options: "i" }
      });
  }

  // Filter by price range
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    query.$and.push({
        price: { $gte: minPrice, $lte: maxPrice }
    });
}

  // If no filters are provided, remove $and from the query
  if (query.$and.length === 0) {
      delete query.$and;
  }

  // Fetch products from the database based on the constructed query
      const result = await productsCollection.find(query).toArray()
      res.send(result)
    })

    // products count

    app.get("/products-count", async(req, res) => {
      const count = await productsCollection.estimatedDocumentCount()
      res.send({count})
   })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Shop Sort Server")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})