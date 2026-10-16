import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intellmeet';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${mongoURI}.`);
    console.warn(`[Database] Running in Fallback Data Mode / Free Tier Memory Mode so all features continue working seamlessly! Error: ${error.message}`);
    return false;
  }
};
