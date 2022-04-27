
import  empModel  from '../Model/Employee.js'
import logger  from "../config/logger.js";
//to print all records of find
var echoRecords = function (err, log) {
  console.log("Total Records Found:" + log.length);
  for (var i = 0; i < log.length; i++) {
    console.log(
      i + 1 + "\t" + log[i]._id + "\t" + log[i].name + "\t" + log[i].empDep
    );
  }
};

const getAllEmp = async (req, res) => {
  try {
    console.log("Calling logs : ");
    // //START logging in file
    // logger.error("Hello, Winston logger, the first error!");
    // logger.warn("Hello, Winston logger, the first warning!");
    // logger.warn("Hello, Winston logger, the second warning!");
    // logger.error("Hello, Winston logger, the second error!");
    // logger.info("Hello, Winston logger, some info!");
    // logger.debug("Hello, Winston logger, a debug!");
    // //END
    console.log("Get Request All Emp");
    const output = await empModel.find().limit(1);
    //   .then((result) => {
    //     console.log("Then " + result);
    //   })
    //   .catch((err) => {
    //     console.log("Error ", err);
    //   });
    console.log("output : " + output);
    res.json(output);
  } catch (error) {
    res.send(error);
  }
};

const getEmpById = async (req, res) => {
  try {
    console.log("Get EMP by Id : " + req.params.id);
    //try it tomorrow
    let id = req.params.id;
    const result = await empModel.findById({ _id: id });
    console.log("result " + result);
    res.json(result);
  } catch (error) {
    throw new Error("Some thing happend wrong in getemp  id " + error);
  }
};

const saveEmp = async (req, res) => {
  try {
    console.log("Post Request for save Emp ",req.body);

    const emp = new empModel({
      name: req.body.name,
      empDep: req.body.empDep,
    });
    console.log("post request");
    // save in DB
    emp
      .save()
      .then((result) => {
        res.json({
          Id: result._id,
        });
      })
      .catch((err) => {
        console.log("Error ", err);
      });
  } catch (error) {
    console.log(error);
  }
};

const deleteEmpById = async (req, res) => {
  try {
    console.log("Delete EMP by Id : " + req.params.id);
    let id = req.params.id;
    console.log(await empModel.countDocuments({ _id: id })); //if id is present then is should be  1
    const result = await empModel.deleteOne({ _id: id });
    console.log(await empModel.countDocuments({ _id: id })); //if id is not present then is should be 0
    if (result.deletedCount == 1) {
      res.json({ "Id ": id, "Message ": "Id deleted succesfully" });
    } else {
      res.json({ "Id ": id, "Message ": "Id not present in DB" });
    }
    console.log("result " + result.deletedCount);
  } catch (error) {
    throw new Error("Some thing happend wrong in deleteEmpById");
  }
};

const updateEmpById = async (req, res) => {
  try {
    console.log("Update EMP by Id : " + req.params.id);
    //try it tommorow
    let id = req.params.id;
    console.log(await empModel.countDocuments({ _id: id })); //if id is present then is should be  1
    const updateEmp = new empModel({
      _id: id,
      name: req.body.name,
      empDep: req.body.empDep,
    });
    const result = await empModel.updateOne(updateEmp);
    console.log(await empModel.countDocuments({ _id: id })); //if id is not present then is should be 0
    console.log("result " + result.modifiedCount);
    if (result.modifiedCount) {
      res.json({ "Id ": id, "Message ": "Id updated succesfully" });
    } else {
      res.json({ "Id ": id, "Message ": "Id not updated in DB" });
    }
  } catch (error) {
    console.log("Some thing happend wrong in updateEmpById " + error);
  }
};

export default {getAllEmp,getEmpById,saveEmp,deleteEmpById,updateEmpById}
