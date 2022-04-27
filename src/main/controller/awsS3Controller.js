import awsS3 from "aws-sdk";
const BUCKET = process.env.aws_bucket_name;


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

export default {getAllS3BucketData}
