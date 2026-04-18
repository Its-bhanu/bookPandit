/**
 * MongoDB Index Cleanup Script
 * Use this script to remove duplicate key indexes from the poojaBooks collection
 * Run this once from MongoDB shell or compass to fix duplicate key errors
 */

// Method 1: Running in MongoDB Shell
// Connect to your database and run these commands:

// Show all indexes on poojaBooks collection
db.poojabooks.getIndexes();

// Drop the unique index on phoneNo if it exists
db.poojabooks.dropIndex("phoneNo_1");

// Verify the index is removed
db.poojabooks.getIndexes();

// ===================================

// Method 2: If using MongoDB Compass
// 1. Go to your database
// 2. Select the poojabooks collection
// 3. Go to the Indexes tab
// 4. Find any index named "phoneNo_1" 
// 5. Click the trash/delete icon to remove it

// ===================================

// Method 3: Using Node.js and Mongoose
// Add this to a temporary Node.js script and run it once:

const mongoose = require('mongoose');

async function cleanupIndexes() {
    try {
        await mongoose.connect('YOUR_MONGODB_CONNECTION_STRING');
        
        // Get the collection
        const db = mongoose.connection.db;
        const collection = db.collection('poojabooks');
        
        // Get all indexes
        const indexes = await collection.getIndexes();
        console.log('Current indexes:', indexes);
        
        // Drop phoneNo unique index if it exists
        try {
            await collection.dropIndex('phoneNo_1');
            console.log('✅ Dropped phoneNo_1 index');
        } catch (err) {
            console.log('ℹ️ phoneNo_1 index does not exist:', err.message);
        }
        
        // Get updated indexes
        const updatedIndexes = await collection.getIndexes();
        console.log('Updated indexes:', updatedIndexes);
        
        console.log('✅ Index cleanup completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanupIndexes();

// ===================================

// Common Issues and Solutions:

// Issue: "E11000 duplicate key error"
// Solution: 
// 1. The phoneNo field should NOT have a unique constraint
// 2. Multiple users can book with the same phone number for different dates/poojas
// 3. Run the index cleanup script above to remove any existing unique index

// Issue: Still getting duplicate key errors after cleanup?
// Solution:
// 1. Check if there's a compound index (phoneNo + something else)
// 2. Use getIndexes() to see all indexes
// 3. Drop any index that includes phoneNo: db.poojabooks.dropIndex("indexName")

// Issue: "MongoServerError: cannot drop index on _id"
// Solution: Never drop the _id index - that's the default MongoDB index and is required

// ===================================

// Rebuilding Indexes (if needed):
// db.poojabooks.dropIndex("*");  // Drops all indexes except _id
// db.poojabooks.createIndex({ createdAt: -1 });  // Recreate needed indexes
