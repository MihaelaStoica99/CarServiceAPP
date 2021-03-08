const express = require('express');
const clientsController = require('../controllers/clientsController');

const router = express.Router();

router.get('/', clientsController.client_getList);
router.post('/', clientsController.client_search);

module.exports = router;