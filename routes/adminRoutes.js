const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/', adminController.admin_getList);

module.exports = router;