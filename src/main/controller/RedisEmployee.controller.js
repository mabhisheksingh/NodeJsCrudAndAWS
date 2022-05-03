import 'dotenv/config'
import EmployeeModel from '../Model/Employee.model.js'
import { readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import { createClient } from 'redis';
const client = createClient();
const REDIS_KEY = process.env.REDIS_KEY;
(async () => {
  
  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect', () => console.log('Connected successfully..'))
  await client.connect();
  const data = await  JSON.parse(await readFile('../../public/MOCK_DATA.json'));  
  for (let i =0 ;i<data.length;i++) {
   // console.log("data[i].emp_id ",data[i].emp_id);
    await client.HSET(REDIS_KEY,data[i].emp_id, JSON.stringify( data[i] ) )
  }  
  // await client.set('key', 'value');
  // const value = await client.HGETALL('EMPLOYEE');
  // console.log("value12 : ",value[100]);
})();



const getAllEmp = async (req, res) => {
    try {
      const response =( await client.HVALS(REDIS_KEY));
      console.log("Process id  ",process.pid)
      res.header('Content-Type','application/json');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
};

const getEmpByID = async (req, res) => {
  try {
    let id = req.query.emp_id;
    const response = await client.HKEYS(REDIS_KEY);
    if (response.includes(id)){
      let responseObj = await client.HGET(REDIS_KEY,id);
      res.header('Content-Type','application/json');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.status(200).send(responseObj);
    }else
      res.status(200).send(id+" is not a valid id in query params"); 
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error);
  }
};

const saveEmp = async (req, res) => {
  try {
    
    let emp = req.body;
    let response = await client.HKEYS(REDIS_KEY);
    console.log(
      "response.sort() ",
      response.sort().length,
      " Len ",
      response.length
    );
    let emp_id =  uuidv4();
    let empData = {
      "emp_id": emp_id,
      ...emp,
    };

    console.log("EMPID ", empData);

    let responseObj = await client.HSET(
      REDIS_KEY,
      emp_id,
      JSON.stringify(empData)
    );
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    console.log(responseObj);
    res.status(200).send(empData);
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error);
  }
};


const delEmp = async (req,res) => {
  try {
    
    let id = req.query.emp_id;
    const response = await client.HKEYS(REDIS_KEY);
    if (response.includes(id)){
      let responseObj = await client.HDEL(REDIS_KEY,id);
      res.header('Content-Type','application/json');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
      res.status(200).send("Id : "+id+' Successfully deleted '+responseObj);
    }else
      res.status(200).send(id+" is not a valid id in query params"); 
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error);
  }
}

export default {getAllEmp,getEmpByID,saveEmp,delEmp}