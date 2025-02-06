const express = require('express')
const router = express.Router()
const {create,list,update,removeitem, removeInvoice} = require('../controller/Invoice')

router.get('/invoice',list)
router.post('/invoice',create)
router.put('/invoice',update)
router.patch('/invoice/:id',removeitem)
router.delete('/invoice/:invoice_id',removeInvoice)



module.exports = router