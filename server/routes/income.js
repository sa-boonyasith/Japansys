const express = require('express')
const router = express.Router()
const {create,list,update, remove} = require('../controller/income')

router.get('/income',list)
router.post('/income',create)
router.put('/income/:id',update)
router.delete('/income/:id',remove)



module.exports = router