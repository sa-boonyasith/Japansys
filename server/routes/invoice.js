const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/invoice')

router.get('/invoice',list)
router.post('/invoice',create)
router.put('/invoice',update)
router.delete('/invoice/:id',remove)



module.exports = router