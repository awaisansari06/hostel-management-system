// Simple test file to check MongoDB connection
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not Found');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected successfully!');
        console.log('Host:', mongoose.connection.host);
        console.log('DB Name:', mongoose.connection.name);
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection failed:');
        console.error(err);
        process.exit(1);
    });
