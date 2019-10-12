/**
 *sqlserver Model
 **/
const mssql = require("mssql");
const util = require("util");
const conf = require("./dbConfig");

let restoreDefaults = function () {
    conf;
};
const con = new mssql.ConnectionPool(conf);

con.on('error', err => {
    if (err) {
        throw err;
    }
});

con.connect(err => {
    if (err) {
        console.error(err);
    }
});

let querySql = async function (sql, params, callBack) {
    try{
        let ps = new mssql.PreparedStatement(con);
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        console.log("querySql",sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(params, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};


var select = async function (tableName, topNumber, whereSql, params, orderSql, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "select * from " + tableName + " ";
        if (topNumber != "") {
            sql = "select top(" + topNumber + ") * from " + tableName + " ";
        }
        sql += whereSql + " ";
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        sql += orderSql;
        console.log(sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(params, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var selectAll = async function (tableName, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "select * from " + tableName + " ";
        console.log(sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute("", (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var add = async function (addObj, tableName, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "insert into " + tableName + "(";
        if (addObj != "") {
            for (var index in addObj) {
                if (typeof addObj[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof addObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
                sql += index + ",";
            }
            sql = sql.substring(0, sql.length - 1) + ") values(";
            for (var index in addObj) {
                if (typeof addObj[index] == "number") {
                    sql += addObj[index] + ",";
                } else if (typeof addObj[index] == "string") {
                    sql += "'" + addObj[index] + "'" + ",";
                }
            }
        }
        sql = sql.substring(0, sql.length - 1) + ")";
        console.log(sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(addObj, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var update = async function (updateObj, whereObj, tableName, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "update " + tableName + " set ";
        if (updateObj != "") {
            for (var index in updateObj) {
                if (typeof updateObj[index] == "number") {
                    ps.input(index, mssql.Int);
                    sql += index + "=" + updateObj[index] + ",";
                } else if (typeof updateObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + updateObj[index] + "'" + ",";
                }
            }
        }
        sql = sql.substring(0, sql.length - 1) + " where ";
        if (whereObj != "") {
            for (var index in whereObj) {
                if (typeof whereObj[index] == "number") {
                    ps.input(index, mssql.Int);
                    sql += index + "=" + whereObj[index] + " and ";
                } else if (typeof whereObj[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                    sql += index + "=" + "'" + whereObj[index] + "'" + " and ";
                }
            }
        }
        sql = sql.substring(0, sql.length - 5);
        console.log(sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(updateObj, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

var del = async function (whereSql, params, tableName, callBack) {
    try{
        var ps = new mssql.PreparedStatement(con);
        var sql = "delete from " + tableName + " ";
        if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        sql += whereSql;
        console.log(sql);
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute(params, (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
};

exports.config = conf;
exports.del = del;
exports.select = select;
exports.update = update;
exports.querySql = querySql;
exports.selectAll = selectAll;
exports.restoreDefaults = restoreDefaults;
exports.add = add;
// const connect =  () => {
//     return new Promise((resolve, reject) => {
//         sql.connect(config, err => {
//             const request = new sql.Request();
//             request.stream = true ;//开启streaming
//             request.query('select * from dbo.A_admin') //或者执行request.execute(procedure)
//             request.on('recordset', columns => {
//                 //每次查询会触发一次 recordset事件，返回结果集
//                 console.log(columns);
//             });
//             request.on('row', row => {
//                 //每个结果集会出发row事件，返回row信息
//             })
//             request.on('error', err => {
//                 //监听error事件，可能被触发多次
//                 console.log(err);
//             })
//             request.on('done', result => {
//                 //最后触发
//             })
//         })
//         sql.on('error', err => {
//             //error 处理
//         })
//     });
// };
// function _connectDB(callback) {
//     sql.connect(config, err => {
//         const request = new sql.Request();
//         request.stream = true ;//开启streaming
//         if (err) {
//             console.log("连接失败!")
//             console.log(err.errmsg)
//             throw err
//         }
//         console.log("连接成功!");
//         callback(err, db)
//     })
// }
// module.exports = connect;
