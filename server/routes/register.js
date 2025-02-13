const express = require('express')
const router = express.Router()
const {create,update,changepass} = require('../controller/register')



router.post('/register',create)
router.put('/change-role',update)
router.patch('/changepass',changepass)




module.exports = router