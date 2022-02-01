const express = require("express");
const router = express.Router();
const multer = require("multer");
const awsS3Controller = require("../controller/awsS3Controller");

router.get("/getAllS3BucketData", awsS3Controller.getAllS3BucketData);

const awsS3 = require("aws-sdk/clients/s3");
const multerS3 = require("multer-s3");
let awsS3Object = new awsS3();
const BUCKET = process.env.aws_bucket_name;
const multerObject = multer({
  storage: multerS3({
    s3: awsS3Object,
    bucket: BUCKET,
    metadata: function (req, file, cb) {
      console.log("Req : ", req, " File : ", file, " CB ", cb);
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log("key Req : ", req, " File : ", file, " CB ", cb);
      cb(null, Date.now().toString());
    },
  }),
});
router.post(
  "/saveFileInS3Bucket",
  multerObject.array("photos", 5),
  (req, res) => {
    res.send("Successfully uploaded " + req.files.length + " files!");
  }
);
// router.get('/getEmpById/:id',awsS3Controller.getEmpById);
// router.post('/saveEmp',awsS3Controller.saveEmp);
// router.delete('/deleteEmpById/:id',awsS3Controller.deleteEmpById);
// router.patch('/updateEmpData/:id',awsS3Controller.updateEmpById);

module.exports = router;
