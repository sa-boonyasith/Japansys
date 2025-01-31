const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/quotation')

router.get('/quotation',list)
router.post('/quotation',create)
router.put('/quotation/:id',update)
router.delete('/quotation/:id',remove)



module.exports = router