const express = require('express');
const sqlConn = require('../dataBase');
const router = express.Router()


router.get('/', (req, res) =>{
    sqlConn.query("SELECT * FROM product", 
    (err, rows, fields) =>{ 
        if(!err){
            // const respuesta = res.json(rows)
            // res.send(respuesta)
            // console.log(respuesta)
            res.json(rows)
        }
        else{
            console.log(err)
            res.json({status: false})
        }
    })
})








module.exports = router;