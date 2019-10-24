/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/20.
 **/
const express = require('express');
const router = express.Router();
const db = require('../../db');
var dbName = "dbo.institution";

router.post('/queryAllInstitution', function (req, res, next) {
    var whereSql = " where 1=1 ";
    var param = req.body;
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }
    db.select(dbName, "", whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/createInstitution', function (req, res, next) {
    var param = req.body;
    db.add(param, dbName, function (err, result) {//插入一条数据
        res.json(result);
    });
});
router.post('/queryInstitution', function (req, res, next) {
    var param = req.body;
    var pageSize = 10;
    var whereSql = " where 1=1 ";
    if (param.name) {
        whereSql = whereSql + " and name = '" + param.name + "'";
    }
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }

    var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + whereSql + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + "";
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryInstitutionCount', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1 ";
    if (param.name) {
        whereSql = whereSql + " and name = '" + param.name + "'";
    }
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }
    var sql = "select count(id) as num from dbo.institution " + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
module.exports = router;

