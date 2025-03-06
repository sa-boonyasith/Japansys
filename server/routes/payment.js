const express = require('express')
const router = express.Router()
const {create,list,update, remove} = require('../controller/payment')

router.get('/payment',list)
router.post('/payment',create)
router.put('/payment/:id',update)
router.delete('/payment/:id',remove)



module.exports = router