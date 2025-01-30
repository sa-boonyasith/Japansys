const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/customer')

router.get('/customer',list)
router.post('/customer',create)
router.put('/customer/:id',update)
router.delete('/customer/:id',remove)



module.exports = router