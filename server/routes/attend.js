const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/attend')

router.get('/attend',list)
router.post('/attend',create)
router.put('/attend',update)
router.delete('/attend',remove)



module.exports = router