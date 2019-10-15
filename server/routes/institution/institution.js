/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/20.
 **/
const express = require('express');
const router = express.Router();
const db = require('../../db');
var dbName = "dbo.institution";

router.post('/queryAllInstitution', function (req, res, next) {
    // db.selectAll("dbo.institution", function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });
    var whereSql = "where 1=1 ";
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
    db.add(param, "dbo.institution", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryInstitution', function (req, res, next) {
    var param = req.body;
    //2012版本以上才有
    //var sql = "select * from 'dbo.institution' order by id offset 10*"+(param.page-1)+"rows fetch next 10 rows only";
    // select * from [StuDB].[dbo].[ScoreInfo] order by [SID] offset 5*2 rows fetch next 5 rows only
    // db.querySql(sql,function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });
    var pageSize = 10;
    var whereSql = "where 1=1 ";
    if (param.name) {
        whereSql = whereSql + " and name = '" + param.name + "'";
    }
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }
    if (param.page == 1) {
        db.select('dbo.institution', 10, whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    } else {
        var whereSql = " ";
        if (param.name) {
            whereSql = whereSql + " and name = '" + param.name + "'";
        }
        if (param.userName) {
            whereSql = whereSql + " and userName = '" + param.userName + "'";
        }
        var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from dbo.institution) temp_row where rownumber>" + ((param.page - 1) * pageSize) + "";
        // var sql = "select * \n" +
        //     "from (select top 10 * \n" +
        //     "from (select top 20 * \n" +
        //     "from dbo.institution \n" +
        //     "order by id asc) \n" +
        //     "as temp_sum_student \n" +
        //     "order by id desc ) temp_order\n" +
        //     "order by id asc"
        // select top pageSize *
        // from (select row_number()
        // over(order by sno asc) as rownumber,*
        // from student) temp_row
        // where rownumber>((pageIndex-1)*pageSize);
        //var count = 10*(param.page-1);
        //var whereSql = "where id not in (select top "+count+" id from dbo.institution order by id)";
        // db.select('dbo.institution', 10,whereSql,"","order by id",function (err, result) {//查询所有news表的数据
        //     res.json(result);
        // });
        db.querySql(sql, "", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    }


});
router.post('/queryInstitutionCount', function (req, res, next) {
    var param = req.body;
    var whereSql = "where 1=1 ";
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

