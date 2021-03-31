const express = require('express')
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
require('dotenv').config()

const port = 5000
console.log(process.env.DB_USER)

app.use(bodyParser.json())
app.use(cors()) 


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bd9js.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");

//   **************************************************  Post ********************************* 
  app.post("/addProduct" , (req,res) => {
      const product = req.body
    //   products.insertOne(product)
        productsCollection.insertMany(product)
      .then(result =>{
          console.log(result)
          console.log(result.insertedCount)
          res.send(result.insertedCount)
      })
  })

//   **************************************************** get **********************

  app.get("/products",(req,res)=>{
    productsCollection.find({})
    .toArray ((err,documents) =>{
        res.send(documents)
    })
  })


  app.get("/products/:key",(req,res)=>{
    productsCollection.find({key : req.params.key})
    .toArray ((err,documents) =>{
        res.send(documents[0])
    })
  })


  app.post("/productsByKeys",(req,res)=>{
      const productKeys = req.body
      productsCollection.find({key : {$in : productKeys}}) 
      .toArray((err ,documents) => {
          res.send(documents)
      })
  })

  
});


app.get('/', (req, res) => {
  res.send('Hello Ema John!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})