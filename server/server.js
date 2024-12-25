const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const {readdirSync} = require('fs')



app.use(morgan('dev'))
app.use(express.json())
app.use(cors())


readdirSync('routes')
.map((c)=>app.use('/api',require('./routes/' + c)))




app.listen(8080,()=>console.log('Server is running on port 8080'))