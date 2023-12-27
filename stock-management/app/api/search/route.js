import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Replace the uri string with your connection string.


export async function GET(request) {
const query = request.nextUrl.searchParams.get("query")
const uri = "mongodb+srv://User_1:7WNG8MrcnZUeRpXL@mongotube.fkafwkz.mongodb.net/";

const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } },
            ],
          },
        },
        // Add more stages to the pipeline if needed
      ]).toArray()
    
    return NextResponse.json({success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}