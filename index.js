const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://JobDB:7GW0xrB527XwyFfp@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("UIJobDB");
    const jobCollection = database.collection("job");
    const userCallaction = database.collection("user");



    app.get('/api/v1/job', async (req, res) => {
      const result = await jobCollection.find().toArray()
      res.send(result)
    })

    app.post('/api/v1/user', async (req,res) => {
      const createUser=req.body
      const existUser= await userCallaction.findOne({email:createUser.email}) 
      if (existUser) {
        return res.status(400).send({message:'Already User Exis'})
      }

      const result=await userCallaction.insertOne(createUser);
      res.status(200).send(result)
      console.log(result);
    })


    app.get('/api/v1/user/:email', async (req,res) => {
     const email=req.params.email
     const result= await userCallaction.findOne({email:email})
     if (result?.email) {
    
      return res.status(200).send({
        status:true,
        data:result
      })
     }
    return res.status(404).send({
      status:false
     })
    })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})