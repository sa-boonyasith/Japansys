const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/meetingcus')

router.get('/meetingcus',list)
router.post('/meetingcus',create)
router.put('/meetingcus/:id',update)
router.delete('/meetingcus/:id',remove)



module.exports = router