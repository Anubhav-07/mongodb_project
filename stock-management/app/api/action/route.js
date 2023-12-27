import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Replace the uri string with your connection string.


export async function POST(request) {
    let {action,slug,initialQuantity} = await request.json()
    const uri = "mongodb+srv://User_1:7WNG8MrcnZUeRpXL@mongotube.fkafwkz.mongodb.net/";
    
    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
       
        const filter = { slug: slug };
        let newQuantity= action=="plus"? (parseInt(initialQuantity)+1):(parseInt(initialQuantity)-1)
        const updateDoc = {
          $set: {
            quantity:newQuantity
          },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc, {});
        
       
        return NextResponse.json({success: true,message:`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
      } finally {
        // Close the connection after the operation completes
        await client.close();
      }
    }