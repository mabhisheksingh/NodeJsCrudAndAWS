const express = require('express');
const router = express.Router()
const EmpController = require('../controller/EmpController')

router.get('/getAllEmp',EmpController.getAllEmp);
router.get('/getEmpById/:id',EmpController.getEmpById);
router.post('/saveEmp',EmpController.saveEmp);
router.delete('/deleteEmpById/:id',EmpController.deleteEmpById);
router.patch('/updateEmpData/:id',EmpController.updateEmpById);

module.exports = router;