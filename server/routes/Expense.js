const express = require('express')
const router = express.Router()
const {create,list,update,remove} = require('../controller/Expense')

router.get('/expense',list)
router.post('/expense',create)
router.put('/expense/:id',update)
router.delete('/expense/:id',remove)



module.exports = router