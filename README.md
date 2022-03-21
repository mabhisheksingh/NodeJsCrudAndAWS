you need to run app.js it is our main file and its path is 
src/main/app.js


# Sample source code for AWS-SDK 


## Authors

- [@Abhishek Singh](https://github.com/mabhisheksingh)


## Basic Liberary required for code


```bash
    require ("dotenv").config ();
    const aws = require ("aws-sdk");
    const fs = require ("fs");
    const archiver = require ("archiver");
    const os = require ('os');
    const userName = os.userInfo().username; 
    const currentWorkingDir = process.cwd();
```

## Running Tests

To run tests, run the following command



## updating credentials in aws account

```javascript
const credentials = new aws.SharedIniFileCredentials ({
	profile: process.env.PROFILE, 
	credentialsError: (err) => {
		console.error(err);
	},
});
aws.config.credentials = credentials;
aws.config.update({ region: process.env. REGION});
const lambda= new aws.Lambda ();
```


## Printing all aws functions

```javascript
const listFunctions = [];
let returning = [];
let indexLambda = 0;
const getALLFunctions1 = (marker) => {
	const params = {
		Marker: marker != undefined ? marker: undefined, 
	}; 
	lambda.listFunctions(params, (err, data) => {
		if (err) {
			console.error (err);
		}else {
			marker = data.NextMarker; listFunctions.push (data. Functions);
			if (marker !== null) {
				getALLFunctions (marker) ;
			} else {
				for (let index = 0; index < listFunctions.length; index++) {
					const element = listFunctions [index]; 
					//console.log("functions : element);
					for (const [index, val] of element.entries ()) { 
						//returning.push(val);
						// console.log(indexLambda++, val.FunctionName);
						//listFunctions.push (val);
					}
				} 
				//console.log (listFunctions);
			}
		}
	});
	//return returning;
};
```


## Get ALL the layers details this give at max 50 item in one way for more you need to pass a marker(is token type system in which if it is not null then more more function are available)
```javascript
const getLayerList = async () => {
	let ListLayersRequest = { 
		CompatibleRuntime: process.env.RUNTIME,
		CompatibleArchitecture: process.env.CompatibleArchitecture.
	}
	const layerLists = await lambda.listLayers(ListLayersRequest).promise ().then (d => d. Layers); 
	//console.log("layerLists", layerLists);
	return layerLists;
}
```

## Get ALL the function details this give at max 50 item in one way for more you need to pass a marker

```javascript
const getALLFunctions = async (marker) => {
	const params = { 
		Marker: marker != undefined ? marker : undefined,
	};
	let response = await lambda.listFunctions(params).promise().then((data) => {
		console.log("Length ", listFunctions.length);
		if (data.NextMarker !== null) { 
			listFunctions.push (data. Functions); 
		} else { 
			for(let index = 0; index < listFunctions.length; index++) {
				const element = listFunctions [index]; 
				//console.log("functions: ", element); 
			}
			marker = data.NextMarker; getALLFunctions (marker);
			listFunctions.push (data.Functions); 
			//console.log("hhhh ", list Functions.length);
			for (const [index, val] of element.entries ()) { 
				returning.push (val);
			} 
			console.log (returning.length); 
			return returning;
		} data = data.Functions;
	}).catch ((err) => {
		console.error ("error : ", err);
	});
	
	if (response !== undefined) { 
		console.log("response ", response.length);
		return response;
	} else {};
};
```

## Get a specific function details
```javascript
const getFunction = async (functionName) => { 
	let functionData = null;
	let response = await lambda.getFunction({ FunctionName: functionName }).promise()
						.then ((response) => response.$response);
	if (response.error) return response.error;
	else return response.data; 
};
```
## Create a specific function with layers name lambdalayers version 6
```javascript
const createLambda = (functionName) => {
	// Get the passed in Region and Plan Name
	var where = process.env.PROFILE; //devg account
	const who = functionName;
	let un = ""; // Set the AWS Region for Lambda
	const lambda= new aws. Lambda ({ region: process.env.REGION });

	var accountName = process.env.ACCOUNTNAME;
	var roleName = process.env.ROLENAME;
	where = "dev";
	accountName = "-globalscape";
	roleName = ":role/RealtimeLambda";
  
	const createFunctionParams = {
		Code: {
			S3Bucket: "comm-chc-" + where + accountname, S3Key: who + ".zip",
		},
		FunctionName:who,
    Handler: process.env.HANDLER,
		Role: "arn:aws:iam: :" +un+ roleName,
		Runtime: process.env. RUNTIME,
		Description: "ERCL" + who, Environment: { Variables: { UN: un } },
		MemorySize: 128,
		Publish: true, Tags: { APP_ID: "123", COST_CENTER: "12345" },
		Timeout: 63, 
		Layers: ['arn:aws: lambda:us-east-123456789:layer:lambdalayers:6']
	};
	lambda.createFunction (createFunctionParams).promise().then((data) => {
		console.log(data);
	}).catch ((error) => { 
		console.log (error.message);
	});
};
```

## Creating a ZIP file
```javascript
const createZIP = (payerName) => {
	const where = process.env.PROFILE.toLocaleLowerCase(); 
	const who = payerName.toUpperCase();
	let whereDir= "";
	whereDir= "Development"; 
	
	// Create the Zip File
	let output = fs.createWriteStream( "C:/Users/" + userName + "/Documents/AWS/Zips/" + where + "/" + who + ".zip");
	let archive = archiver("zip", { zlib: { level: 9 } });
	output.on("close", () => { console.log("Archiver has been finalized and the output file descriptor has closed.");});
	output.on ("end", () => { console.log("Data has been drained");});
	output.on("finish", () => {console.log("Data has been finish");});
	archive.on("warning", (err) => { 
		if (err.code === "ENOENT") {console.log("EONENT");
		} else { 
			throw err;
		}
	});
	archive.on ("error", (err) => { throw err;});

	// Zip the node_modules directory from AWS/Zips/base into the Zip File. 
	// Zip the package-lock.json and package.json files from AWS/2ips/base into the Zip File
	// Zip the index.js file for the Plan from AWS/Lambdas/Plan Name into the Zip File
  
	archive.pipe (output);
  
	archive.directory ("C:/Users/" + userName + "/Documents/AWS/Zips/base/node_modules", "node_modules"); 
	archive.file("C:/Users/" + userName + "/Documents/AWS/Zips/base/package.json", { name: "package.json", }); 
	archive.file("C:/Users/" + userName + "/Documents/AWS/Zips/base/package-lock.json", { name: "package-lock.json" });
	archive.finalize();
};
```

## Check ZIP file exist in a folder or not
```javascript
const checkLambdaExistOrNot = (payerName) => { 
	//checking file exist of or not
	const where = process.env.PROFILE.toLocaleLowerCase();
	const who = payerName.toUpperCase();
	const path = "C:/Users/" + userName + "/Documents/AWS/Zips/" + where + "/" + who + ".zip"
	try { 
		if (fs.existsSync(path)) 
			return true;
	}catch(err){
		return false;
	}
}
```

## Upload Lambda ZIP file in S3 bucket
```javascript
const uploadLambdaZipToS3 = async (payerName) => {
	let where = process.env. PROFILE.toLocaleLowerCase(); 
  const who = payerName.toUpperCase();

	// Set the AWS Credentials based on the appropriate section ([dev] or [prod]) in C:/users/the user/.aws/credentails file
	aws.config.credentials = new aws. SharedIniFileCredentials ({ profile: where });

	// Set the AWS Region
	const s3 = new aws.S3 ({ region: process.env. REGION });

	//Read into body the Zip File

	let body= "undefined"

	if (checkLambdaExistOrNot(payerName)) {
		body = fa.readFileSync ("C:/Users/" + userName + "/Documents/AWS/Zips/" + where + "/" + who + ".zip")
	} else {
		createZIP (payerName);
		body = fs.readFileSync ("C:/Users/" + userName + "/Documents/AWS/Zips/" + where + "/" + who + ".zip")
	}
	console.log("Body: 32 " + body.length);

	var accountname = '-ets' 
	if (where === 'devg') {
		console.log("wherell:" + where);
		where = "dev";
		accountname = '-globalscape';
	}
	
	// Create the Upload Parameters
	const uploadParams = {
		Bucket:  where + accountname,
		Key: 'Zips/' + who + '.zip',
		StorageClass: 'STANDARD',
		Body: body
	};

	// Execute upload to upload the Zip file to $3
	const uploadStatus = await s3.upload(uploadParams).promise () .then ((data) => data).catch (err => err)	
	return uploadStatus;
}
```

## Modify the existing Lambda

```javascript

const modifyExistingLambda = (LambdaName) => { 
	// Get the passed in Region and Plan Name
	var where = process.env.PROFILE.toLowerCase();
	const who = LambdaName.toUpperCase();
	let un= "";
	// Set the AWS Credentials based on the appropriate section ([dev] or [prod]) in C:/users/the user/.aws/credentails file
	aws.config.credentials = new aws.SharedIniFileCredentials ({ profile: where });
	// Set the AWS Region for Lambda
	const lambda= new aws.Lambda ({ region: 'us-east-1' });


	// Create the Update Function (Lambda) Code Parameters.
	var accountname = '-ets'
	if (where == "devg") {
		where = 'dev';
		accountname = '-globalscape';
	}
	
	// Create the Update Function (Lambda) Code Parameters.

	const updateFunctionCodeParams = {
		FunctionName:  who,
		DryRun: false, 
		Publish: true,
		S3Bucket: where + accountname, 
		S3Key: 'Zips/' + who + ".zip"

	};
	const updateFunctionConfigurationParams ={
		FunctionName:  who,
		Environment: { Variables: { "UN": un } },
		Description: 'ERCI' + who,
		Runtime: 'nodejs14.x'
	};

	// Execute updateFunctionCode to update the Function (Lambda) Code
	
	lambda.updateFunctionCode(updateFunctionCodeParams).promise()
	.then ((data) => { 
		console.log(data)
		// Execute updateFunctionConfiguration to update the Function (Lambda) Configuration.
		lambda.updateFunctionConfiguration (updateFunctionConfigurationParams).promise().then ((data) => { 
			console.log (data);
		}).catch ((error) => { 
			console.log(error, error.stack);
		});
	}).catch ((error) => { 
		console.log (error, error.stack);
	});
}
```




## Export this  functions to other class 

```javascript
module.exports = { 
	createLambda,createZIP,getALLFunctions, getFunction,getLayerList,modifyExistingLambda,uploadLambdaZipToS3
};
```
