import awsS3 from "aws-sdk";
import DynamoDb from 'aws-sdk/clients/dynamodb.js';

const BUCKET = process.env.aws_bucket_name;

const putDataInDynamoDb = async (req,res) => {
  console.log("PUT ")
  const ddb = new DynamoDb.DocumentClient({region:'us-east-1'});
  const put = {
    TableName :'Testing',
    Item:{
      ID:'Abhishek2',
      Name:"Abhishek Sing1h",
      N:'a'
    }
  }
  ddb.put(put,(err,data)=>{
    if(err)
      res.send(err);
      console.log("Abhishek ",data)
    res.send(data);
  })
}

const getAllS3BucketData = async (req, res) => {
  
  try {
    console.log("Bucket : ", BUCKET);
   const s3Object = new awsS3.S3();
    let s3Response = await s3Object.listObjectsV2({ Bucket: BUCKET }).promise();
    let x = s3Response.Contents;
    //console.log("response : ", s3Response, " X : ", x);
    res.json(s3Response);

  } catch (error) { res.status(400).send(error);}
};

export default {getAllS3BucketData,putDataInDynamoDb}
