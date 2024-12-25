const express = require('express')
const router = express.Router()
const {create,update} = require('../controller/register')



router.post('/register',create)
router.put('/change-role',update)




module.exports = router