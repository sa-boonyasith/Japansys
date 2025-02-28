const express = require('express')
const router = express.Router()
const {create,list,update, remove} = require('../controller/receipt')

router.get('/receipt',list)
router.post('/receipt',create)
router.put('/receipt/:id',update)
router.delete('/receipt/:id',remove)



module.exports = router