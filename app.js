require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//MyRoutes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");

const app = express();

//DB connection
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("DB CONNECTED");
})

//MiddleWares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get("/" , function(req, res){
    res.send("Hello there mate");
});

//MyRoutes
app.use("/api" , authRoutes);
app.use("/api" , userRoutes);

let port = process.env.PORT || 3000;

app.listen(port , function(){
    console.log(`Server is running on port ${port}`);
});