const express = require('express')
const router = express.Router()
const {create,list} = require('../controller/login')



router.get('/user',list)
router.post('/login',create)




module.exports = router