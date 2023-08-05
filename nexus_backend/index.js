const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
const path = require('path');
const {postTrimmer} = require('./src/utils/trimmer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(postTrimmer);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api",require("./src/routes/index"));

app.listen(port, () => {
    console.log(`listening at port ${port}`)
})
