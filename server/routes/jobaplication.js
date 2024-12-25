const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/jobaplication')

router.get('/jobaplication',list)
router.post('/jobaplication',create)
router.put('/jobaplication/:id',update)
router.delete('/jobaplication/:id',remove)



module.exports = router