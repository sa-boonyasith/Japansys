const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/leaverequest')

router.get('/leaverequest',list)
router.post('/leaverequest',create)
router.put('/leaverequest/:id',update)
router.delete('/leaverequest/:id',remove)



module.exports = router

