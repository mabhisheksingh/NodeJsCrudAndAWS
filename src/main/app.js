require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const empRouter = require("./Routers/EmployeeRouter");
const path = require("path");
const log = require("../main/config/logger");
const awsS3Router = require('./Routers/awsS3router');
//for AWS
const aws = require("aws-sdk");
const uuid = require("uuid");
const { request } = require("express");
const app = express();

const port = process.env.PORT || 9001;
app.use(express.static(path.join(__dirname + "../../../public")));
//use directly by URL we puts all docs for public purpose
app.listen(port, () => {
  console.log("Listing Port : " + port);
});

const url = process.env.DATABASE_URL;

mongoose.connect(url, { useNewUrlParser: true });

const con = mongoose.connection;
con.on("open", () => {
  console.log("connected..A");
  //console.log(AWS_ACCESS_KEY_ID+" " +AWS_SECRET_ACCESS_KEY)
});
app.use(express.json());

app.use("/EMPApi", empRouter);

//aws
aws.config.update({
  region: process.env.aws_bucket_region,
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});

app.use("/awsS3API", awsS3Router);

//generated random words

const randomWordsRouter = require('../main/Routers/randomWordsRouter');
app.use("/random-words",randomWordsRouter);


//always put this code in last to handle all exception
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.status(500);
  res.send("500: Internal server error");
});

