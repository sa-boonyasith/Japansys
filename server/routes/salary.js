const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/salary')

router.get('/salary',list)
router.post('/salary',create)
router.put('/salary/:id',update)
router.delete('/salary/:id',remove)



module.exports = router