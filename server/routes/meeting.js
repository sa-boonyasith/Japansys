const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/meeting')

router.get('/meeting',list)
router.post('/meeting',create)
router.put('/meeting/:id',update)
router.delete('/meeting/:id',remove)



module.exports = router