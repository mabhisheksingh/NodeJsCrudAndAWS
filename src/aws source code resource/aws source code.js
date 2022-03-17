require ("dotenv").config ();
const aws = require ("aws-sdk");
const fs = require ("fs");
const archiver = require ("archiver");
const os = require ('os');
const userName = os.userInfo().username; 
const currentWorkingDir = process.cwd();

//updating credentials in aws account 
const credentials = new aws.SharedIniFileCredentials ({
	profile: process.env.PROFILE, 
	credentialsError: (err) => {
		console.error(err);
	},
});
aws.config.credentials = credentials;
aws.config.update({ region: process.env. REGION});

const lambda= new aws.Lambda ();

//printing all aws functions
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

const getLayerList = async () => {
	let ListLayersRequest = { 
		CompatibleRuntime: process.env.RUNTIME,
		CompatibleArchitecture: process.env.CompatibleArchitecture.
	}
	const layerLists = await lambda.listLayers(ListLayersRequest).promise ().then (d => d. Layers); 
	//console.log("layerLists", layerLists);
	return layerLists;
}

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

const getFunction = async (functionName) => { 
	let functionData = null;
	let response = await lambda.getFunction({ FunctionName: functionName }).promise()
						.then ((response) => response.$response);
	if (response.error) return response.error;
	else return response.data; 
};

const createLambda = (payerName) => {

	// Get the passed in Region and Plan Name
	var where = process.env.PROFILE; //devg account
	const who = payerName;
	let un = ""; // Set the AWS Region for Lambda
	const lambda= new aws. Lambda ({ region: process.env.REGION });

	// Create the Create Function (Lambda) Parameters.
	if (where.includes ("dev")) un = "089973555345"; 
	if (where.includes ("devg")) un = "061671129752";
	if (where.includes ("prod")) un = "304230625117";
	if (where.includes ("prodg")) un = "423522764586";

	var accountName = process.env.ACCOUNTNAME;
	var roleName = process.env.ROLENAME;
	if (where == "devg") { 
		where = "dev";
		accountName = "-globalscape";
		roleName = ":role/Comm-RealtimeLambda";
	}
	if (where == "prodg") {
		where = "prod";
		accountName = "-globalscape"; 
		roleName = ":role/Comm-Realtime Lambda";
	}
	const createFunctionParams = {
		Code: {
			S3Bucket: "comm-chc-" + where + accountname, S3Key: "ERCL/Zips/" + who + ".zip",
		},
		FunctionName: "com-" + where + "-ERCL-" + who, Handler: process.env.HANDLER,
		Role: "arn:aws:iam: :" +un+ roleName,
		Runtime: process.env. RUNTIME,
		Description: "ERCL" + who, Environment: { Variables: { UN: un } },
		MemorySize: 128,
		Publish: true, Tags: { APP_ID: "45", COST_CENTER: "40134" },
		Timeout: 63, 
		Layers: 'arn:aws: lambda:us-east-14061671129752:layer:lambdalayers:6'
	};
	lambda.createFunction (createFunctionParams).promise().then((data) => {
		console.log(data);
	}).catch ((error) => { 
		console.log (error.message);
	});
};

const createZIP = (payerName) => {
	const where = process.env.PROFILE.toLocaleLowerCase(); 
	const who = payerName.toUpperCase();
	let whereDir= "";
	if (where === "dev") 	whereDir= "Development"; 
	if (where === "devg") 	whereDir= "Development";
	if (where === "prod") 	whereDir= "Production"; 
	if (where === "prodg") 	whereDir= "Production";
	
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
	
	if (where === "devg" || where === "prodg") {
		archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" + whereDir + "/" + who + "/index.js",
		{ name: "index.js" }
		);
		archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" + whereDir + "/" + who + "/" + who.toLowerCase() + "_config.json",
		{ name: who.toLowerCase () + "config.json"}
		); 
	} else{ 
		archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/index.js", { name: "index.js" }); 
		archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +who+"/" + who.toLowerCase() + "config.json",
		{ name: who.toLowerCase() + "_config.json"});
	}
	if (who === "ROUTEPAYERTXN") {
		if (where === "devg" || where === "prodg") {
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonALB.txt",	
				{ name: "payersonALB.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonALB-1.txt", 
				{ name: "payersonALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonALB-2.txt",
				{ name: "payersonALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" +"/payersonALB-3.txt", 
				{ name: "payersonALB-3.txt"});
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonINHALB-1.txt",	
				{ name: "/payersonINHALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonINHALB-2.txt", 
				{ name: "/payersonINHALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-3.txt",
				{ name: "/payersonINHALB-3.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-4.txt",
				{ name: "/payersonINHALB-4.txt" });
				archive.file ("C:/Users/abhisheksingh/Documents/AWS/INH/aws-ercl/Lambdas/" +whereDir +"/"+who + "/backhauled-payers.txt",
			{ name: "backhauled-payers.txt" } );
		}else{
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonALB.txt",	
			{ name: "payersonALB.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonALB-1.txt", 
			{ name: "payersonALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonALB-2.txt",
			{ name: "payersonALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +"/payersonALB-3.txt", 
			{ name: "payersonALB-3.txt"});
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonINHALB-1.txt",	
			{ name: "/payersonINHALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonINHALB-2.txt", 
			{ name: "/payersonINHALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-3.txt",
			{ name: "/payersonINHALB-3.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-4.txt",
			{ name: "/payersonINHALB-4.txt" });
			archive.file ("C:/Users/abhisheksingh/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/"+who + "/backhauled-payers.txt",
			{ name: "backhauled-payers.txt" } );
		}
	}
	if (who === "ROUTEPAYERTEST") {
		archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonALB.txt",	
			{ name: "payersonALB.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonALB-1.txt", 
			{ name: "payersonALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonALB-2.txt",
			{ name: "payersonALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +"/payersonALB-3.txt", 
			{ name: "payersonALB-3.txt"});
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" + whereDir +"/" +who +"/payersonINHALB-1.txt",	
			{ name: "/payersonINHALB-1.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" +who +"/payersonINHALB-2.txt", 
			{ name: "/payersonINHALB-2.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-3.txt",
			{ name: "/payersonINHALB-3.txt" });
			archive.file ("C:/Users/" + userName + "/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/" + who +"/payersonINHALB-4.txt",
			{ name: "/payersonINHALB-4.txt" });
			archive.file ("C:/Users/abhisheksingh/Documents/AWS/aws-ercl/Lambdas/" +whereDir +"/"+who + "/backhauled-payers.txt",
			{ name: "backhauled-payers.txt" } );
	}

	archive.finalize();
};

const checkLambdaExistOrNot= (payerName) => { 
	//checking file exist of or not
	const where = process.env.PROFILE.toLocaleLowerCase();
	const who = payerName.toUpperCase();
	const path = "C:/Users/" + userName + "/Documents/AWS/Zips/" + where + "/" + who + ".zip"
	try { 
		if (fs.existsSync (path)) 
			return true;
	}catch(err ){
		return false;
	}
}

const uploadLambdaZipToS3 = async (payerName) => {
	let where = process.env. PROFILE.toLocaleLowerCase(); const who = payerName.toUpperCase();

	// Set the AWS Credentials based on the appropriate section ([dev] or [prod]) in C:/users/the user/.aws/credentails file
	aws.config.credentials = new aws. SharedIniFileCredentials ({ profile: where });
	488

	// Set the AWS Region
	const s3 = new aws.S3 ({ region: process.env. REGION });

	// Read into body the Zip File

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
		console.log("*********wherell:" + where);
		where = "dev";
		accountname = '-globalscape';
	}
	if (where === 'prodg') {
		console.log("*********wherell:" + where);
		where = "prod";
		accountname ='-globalscape';
	} 
	// Create the Upload Parameters
	const uploadParams = {
		Bucket: 'comm-cho-' + where + accountname,
		Key: 'ERCL/Zips/' + who + '.zip',
		StorageClass: 'STANDARD',
		Body: body
	};

	// Execute upload to upload the Zip file to $3
	const uploadStatus = await s3.upload (uploadParams).promise () .then ((data) => data).catch (err => err)	
	return uploadStatus;
}
const modifyExistingLambda = (payerName) => { 
	// Get the passed in Region and Plan Name
	var where = process.env.PROFILE.toLowerCase();
	const who = payerName.toUpperCase();
	let un= "";
	// Set the AWS Credentials based on the appropriate section ([dev] or [prod]) in C:/users/the user/.aws/credentails file
	aws.config.credentials = new aws.SharedIniFileCredentials ({ profile: where });
	// Set the AWS Region for Lambda
	const lambda= new aws.Lambda ({ region: 'us-east-1' });

	if (where.includes ("del")) un = "089973555345";
	if (where.includes ("prod")) un = "304230625117"; 
	if (where. includes ("devg")) un ="061671129752";
	if (where.includes ("prodg")) un = "423522764586";

	// Create the Update Function (Lambda) Code Parameters.
	var accountname = '-ets'
	if (where == "devg") {
		where = 'dev';
		accountname = '-globalscape';
	}
	if (where == "prodg") {
		where = 'prod';
		accountname = '-globalscape';
	}
	// Create the Update Function (Lambda) Code Parameters.

	const updateFunctionCodeParams = {
		FunctionName: 'com-' + where +'-ERCL-' + who,
		DryRun: false, 
		Publish: true,
		S3Bucket: 'comm-che-' + where + accountname, 
		S3Key: 'ERCL/Zips/' + who + ".zip"

	};
	const updateFunctionConfigurationParams ={
		FunctionName: 'com-' + where + '-ERCL-' + who,
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

module.exports = { 
	createLambda,createZIP,getALLFunctions, getFunction,getLayerList,modifyExistingLambda,uploadLambdaZipToS3
};
