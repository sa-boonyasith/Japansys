const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/rentcar')

router.get('/rentcar',list)
router.post('/rentcar',create)
router.put('/rentcar/:id',update)
router.delete('/rentcar/:id',remove)



module.exports = router