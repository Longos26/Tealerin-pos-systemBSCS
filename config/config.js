const mongoose = require("mongoose");
require("colors");

// connectDB Function
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgYellow.black);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`.bgRed.white);
        process.exit(1); // Exit with failure
    }
};

// Export the connection function
module.exports = connectDb;
