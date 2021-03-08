const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/', usersController.user_getList);
router.post('/', usersController.user_login);
router.put('/:id', usersController.user_edit);
router.delete('/:id', usersController.user_delete);


module.exports = router;