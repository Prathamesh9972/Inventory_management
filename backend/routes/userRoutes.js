const express = require('express')
const router = express.Router()
const { registerUser, loginUser, createStaff } = require('../controllers/userController')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/staff_add',createStaff)

module.exports = router
