const express = require('express');
const employeesController = require('../controllers/employeesController');

const router = express.Router();

router.get('/', employeesController.employees_getList);
router.post('/', employeesController.employee_add);
router.delete('/:id', employeesController.employee_delete);
router.put('/:id', employeesController.employee_edit);


module.exports = router;

