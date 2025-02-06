const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/product')

router.get('/product',list)
router.post('/product',create)
router.put('/product/:id',update)
router.delete('/product/:id',remove)



module.exports = router