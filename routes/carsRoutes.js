const express = require('express');
const carsController = require('../controllers/carsController');

const router = express.Router();

router.get('/', carsController.car_getList);
router.post('/', carsController.car_search);

module.exports = router;