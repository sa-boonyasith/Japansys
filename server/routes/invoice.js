const express = require('express')
const router = express.Router()
const {create,list,update, remove} = require('../controller/Invoice')

router.get('/invoice',list)
router.post('/invoice',create)
router.put('/invoice/:id',update)
router.delete('/invoice/:id',remove)



module.exports = router