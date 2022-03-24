//lambda code how to automatically load from csv to dynamo DB whenever any new csv file upload in S3 bucket 
exports.handler =  async (event) => {
    // Load the SDK for JavaScript
    var AWS = require('ava-adk');
    // Set the Region 
    AWS.config.update ({region: 'us-east-1'});
    //Provide Bucket and Key
    var params = {
        Bucket: "BUCKET NAME", Key: "filrename.csv"
    }
    //Connect with S3 and DynamoDB 
    var a3 = new AWS.S3();
    
    var docClient = new AWS.Dynamo.DocumentClient();
    // require csvtojaon
    var csv = require("csvtojson"); //var csvtojson require ("csvtojson"); to define it for the line below
    //Get CSV file from 53
    const stream=S3.gotobject(params).createReadStream();
    //parse CSV file
    const json = await cav().fromStream (stream); //stream definition
    //Iterate through the list created from the parsed CSV and populate into the DynamoDB table
    
    for (let i = 0; i < Json.length; i++) {
        console.log(json[i]);
        const ditems={TableName: "Tablename", Item: json[i]};
        await docClient.put (dbitems, function (erz, data) { 
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);// successful response
        
        }).prominSe();
    }
}
    
    