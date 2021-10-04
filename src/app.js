const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8000

//Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use("/bsaleApi", require('./routes/bsaleApi'))

app.use(express.json())

//Listener
app.listen(port, () => console.log("app running at port: "+port))
