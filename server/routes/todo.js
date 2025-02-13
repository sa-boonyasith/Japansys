const express = require('express')
const router = express.Router()
const {create,list,update,remove, listproject} = require('../controller/todo')
const authenticateUser = require ('../middleware/auth')

router.get('/todo', list)
router.post('/todo',create)
router.put('/todo',update)
router.delete('/todo/:id',remove)
router.get("/project",listproject)



module.exports = router