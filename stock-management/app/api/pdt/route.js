import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Replace the uri string with your connection string.


export async function GET(request) {
const uri = "mongodb+srv://User_1:7WNG8MrcnZUeRpXL@mongotube.fkafwkz.mongodb.net/";

const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const products = await inventory.find(query).toArray();
    
    return NextResponse.json({success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function POST(request) {
    let body = await request.json()
    const uri = "mongodb+srv://User_1:7WNG8MrcnZUeRpXL@mongotube.fkafwkz.mongodb.net/";
    
    const client = new MongoClient(uri);
      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body)
        
        return NextResponse.json({product,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }