const express = require('express');
const sqlConn = require('../dataBase');
const router = express.Router()


router.get('/', (req, res) =>{
    sqlConn.query("SELECT * FROM product", 
    (err, rows) =>{ 
        if(err){
            console.log(err)
            res.json({status: false})
        }
        else{
            res.json(rows)
        }
    })
})

router.get('/category/all', (req, res) => {
    sqlConn.query("SELECT * FROM category", 
    (err, rows) =>{ 
        if(err){
            console.log(err)
            res.json({status: false})
        }
        else{
            res.json(rows)
        }
    })
})

router.get('/category/:id', (req, res) => {
    const { id } = req.params
    sqlConn.query( `SELECT * FROM product WHERE category = ?`, [id], 
    (err, rows) =>{ 
        if(err){
            console.log(err)
            res.json({status: false})
        }
        else{
            res.json(rows)
        }
    })
})


router.get("/search/:name", (req, res) => {
    const { name } = req.params;
    sqlConn.query(
      `SELECT * FROM product WHERE name LIKE '%${name}%'`,
      (err, rows) => {
        if(err){
            console.log(err)
            res.json({status: false})
        }
        else{
            res.json(rows)
        }
      }
    );
});


router.get("/product/:id", (req, res) => {
    const { id } = req.params
    connection.query("SELECT * FROM product WHERE id = ?", [id], 
    (err, rows, fields) =>{ 
        if(err){
            console.log(err)
            res.json({status: false})
        }
        else{
            res.json(rows)
        }
    })
})





module.exports = router;