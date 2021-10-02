const mysql = require('mysql')
const express = require('express')
const path = require('path')
const app = express()


const PORT = process.env.PORT || 3000



//Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use("/bsaleApi", require('./routes/bsaleApi'))

app.use(express.json())


app.listen(PORT, () => console.log("app running at port: "+PORT))





// app.get('/', (req, res) => {
//     connection.query("SELECT * FROM product", 
//     (err, rows, fields) =>{ 
//         if(!err){
//             // const respuesta = res.json(rows)
//             // res.send(respuesta)
//             // console.log(respuesta)
//             res.json(rows)
//         }
//         else{
//             console.log(err)
//             res.json({status: false})
//         }
//     })
// })

// app.get("/:id", (req, res) => {
//     const { id } = req.params
//     connection.query("SELECT * FROM product WHERE id = ?", [id], 
//     (err, rows, fields) =>{ 
//         if(!err){
//             // const respuesta = res.json(rows)
//             // res.send(respuesta)
//             // console.log(respuesta)
//             res.json(rows)
//         }
//         else{
//             console.log(err)
//             res.json({ status: false })
//         }
//     })
// })

// app.get('/category/all', (req, res) => {
//     console.log("Aqui estoy 1")
//     connection.query("SELECT * FROM category", 
//     (err, rows, fields) => {
//         if(!err){
//             // const respuesta = res.json(rows)
//             // res.send(respuesta)
//             // console.log(respuesta)
//             res.json(rows)
//         }
//         else{
//             console.log(err)
//             res.json({ status: false })
//         }
//     })
// })

// app.get("/category/:id", (req, res) => {
//     console.log("Aqui estoy 2")
//     const { id } = req.params
    
//     connection.query("SELECT * FROM category WHERE id = ?", [id], 
//     (err, rows, fields) =>{ 
//         if(!err){
//             // const respuesta = res.json(rows)
//             // res.send(respuesta)
//             // console.log(respuesta)
//             res.json(rows)
//         }
//         else{
//             console.log(err)
//             res.json({ status: false })
//         }
//     })
// })


