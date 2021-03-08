const express = require('express');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

router.get('/', servicesController.services_getList);
router.post('/', servicesController.service_add);
router.delete('/:id', servicesController.service_delete);
router.put('/:id', servicesController.service_edit);

module.exports = router;
