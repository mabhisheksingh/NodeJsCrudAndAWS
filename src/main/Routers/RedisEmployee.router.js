import express from "express";
import RedisEmployeeController from "../controller/RedisEmployee.controller.js";
const router = express.Router()
import bodyParser  from "body-parser";


router.get('/getAllEmp',RedisEmployeeController.getAllEmp);
router.get('/getEmpByID',RedisEmployeeController.getEmpByID);
router.post('/saveEmp',bodyParser.json(),RedisEmployeeController.saveEmp);
router.delete('/delEmp',RedisEmployeeController.delEmp);
// router.patch('/updateEmpData/:id',RedisEmployeeController.updateEmpById);

export default router;