const express = require('express');
const interventionsController = require('../controllers/interventionsController');

const router = express.Router();

router.get('/', interventionsController.intervention_getList);
router.post('/', interventionsController.intervention_search);

module.exports = router;