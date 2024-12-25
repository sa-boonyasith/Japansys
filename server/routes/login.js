const express = require('express')
const router = express.Router()
const {create} = require('../controller/login')


router.post('/login',create)




module.exports = router