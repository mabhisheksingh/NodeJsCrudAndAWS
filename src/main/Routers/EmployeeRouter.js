import express from "express";
import EmpController from '../controller/EmpController.js'
const router = express.Router()


router.get('/getAllEmp',EmpController.getAllEmp);
router.get('/getEmpById/:id',EmpController.getEmpById);
router.post('/saveEmp',EmpController.saveEmp);
router.delete('/deleteEmpById/:id',EmpController.deleteEmpById);
router.patch('/updateEmpData/:id',EmpController.updateEmpById);

export default router;