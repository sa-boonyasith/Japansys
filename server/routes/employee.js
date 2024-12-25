const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/employee')

router.get('/employee',list)
router.post('/employee',create)
router.put('/employee/:id',update)
router.delete('/employee/:id',remove)



module.exports = router