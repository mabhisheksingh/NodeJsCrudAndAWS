import 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import empRouter from "./Routers/EmployeeRouter.js";
import path,{dirname } from "path";
import { fileURLToPath } from 'url';
import log from '../main/config/logger.js';
import awsS3Router from './Routers/awsS3router.js';
//const express = require("express")
//const mongoose = require("mongoose");
// const empRouter = require("./Routers/EmployeeRouter");
// const path = require("path");
// const log = require("../main/config/logger");
// const awsS3Router = require('./Routers/awsS3router');
//for AWS
// const aws = require("aws-sdk");
// const uuid = require("uuid");
// const { request } = require("express");

import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import request from "express";
import randomWordsRouter from '../main/Routers/randomWordsRouter.js';

import { readFile } from 'fs/promises';
import RedisEmployee from './Routers/RedisEmployee.router.js'

//cluster use for threading 
import cluster from 'cluster';
import os from 'os';
 


const json = JSON.parse(
  // await readFile(
  //   new URL('../../public/employeeData.json', import.meta.url)
  // )
   await readFile('../../public/employeeData.json')
  );

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 9001;
app.use(express.static(path.join(__dirname + "../../../public")));

//using cluster for multithreading
if (cluster.isPrimary) {
  //console.log("Is primary is working " , os.cpus())
  for (let index = 0; index < os.cpus().length-1 ; index++) {
    cluster.fork();
  }
}else{
  console.log("Is secondary working ",process.pid)
  //use directly by URL we puts all docs for public purpose
  app.listen(port, () => {
    //console.log("Listing Port : " , port);
  });
}



const url = process.env.DATABASE_URL;

//generated random words

app.use("/random-words",randomWordsRouter);
app.get("/testing",(req,res)=>{
  try {
    console.log("testing",json);
    res.send(json).status(400);
    return;
  } catch (err) {
    console.error(err);
  }

})

mongoose.connect(url, { useNewUrlParser: true });

const con = mongoose.connection;
con.on("open", () => {
  console.log("Mongoose connection opened .. ");
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
app.use('/inMemory',RedisEmployee);


//always put this code in last to handle all exception
app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.status(500);
  res.send("500: Internal server error");
});


