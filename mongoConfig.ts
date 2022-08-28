import mongoose from "mongoose";

var mongoDb = process.env['DB_DEV'] as string;
mongoose.connect(mongoDb);
mongoose.connection.on('error', console.error.bind(console, 'MongoDb connection error: '));
