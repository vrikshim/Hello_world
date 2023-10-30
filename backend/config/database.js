const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
        .connect("mongodb://localhost:27017/Ecommerce", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
        })
        .then((data) => {
            console.log(`Mongo connected with server: ${data.connection.host}`);
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = connectDatabase;