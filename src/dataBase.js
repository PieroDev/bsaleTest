const mysql = require('mysql')


//Mysql
const sqlConn = mysql.createConnection({
    host: "mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com",
    user: "bsale_test",
    password: "bsale_test",
    database: "bsale_test",
})
//Check connection
sqlConn.connect(error =>{
    if(error) throw error;
    console.log('SERVER IS RUNNING')
})

module.exports = sqlConn