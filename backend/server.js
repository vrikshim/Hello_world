const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const PORT = 4000;
const cloudinary = require("cloudinary");

//handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log("shutting down the server due to uncaught exception");
    process.exit(1);
});

connectDatabase();

// config
dotenv.config({ path: `${__dirname}/config/config1.env` });
//console.log(process.env.PORT);
const server = app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
//console.log("hello");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});