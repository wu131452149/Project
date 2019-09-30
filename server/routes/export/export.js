/**
 * 这个文件主要是导出
 *  created by LilyLee on 2019/9/24.
 **/
const express = require('express');
const router = express.Router();
const db = require('../../db');
const dbName = "dbo.project";
var fs = require('fs');
const nodeExcel = require('node-xlsx');
const urlencode = require('urlencode');
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const excelTitleConfig = [{
    name: 'id',
    title: '项目编号',
}, {
    name: 'commitName',
    title: '主管部门',
}, {
    name: 'projectInstitution',
    title: '项目单位',
}, {
    name: 'projectName',
    title: '项目名称',
}, {
    name: 'projectType',
    title: '项目类型',
}, {
    name: 'projectMoney',
    title: '概算金额',
}, {
    name: 'projectYears',
    title: '项目周期',
}, {
    name: 'budgetReviewMoney',
    title: '预算评审金额',
}, {
    name: 'yearsPlanTotalMoneyNo',
    title: '三年滚动预算合计',
}, {
    name: 'yearsPlanTotalMoney',
    title: '以前年度累计安排',
    format: function (data) {
        let value = "0";
        var thisYears = new Date().getFullYear();
        //var thisYears = 2020;
        if (data) {
            let money = JSON.parse(data);
            var list = money.filter(function (item) {
                return item.years < thisYears;
            });
            var totalMoney = 0;
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    totalMoney = totalMoney + parseInt(list[i].money);
                }
                return totalMoney;
            } else {
                return value;
            }
        } else {
            return value;
        }
    }
}, {
    name: 'yearsPlanTotalMoney',
    title: '当年安排',
    format: function (data) {
        let value = "0";
        var thisYears = new Date().getFullYear();
        if (data) {
            let money = JSON.parse(data);
            var index = money.find(function(x) {
                return x.years == thisYears;
            });
            if(index){
                value = index.money;
            }
            return value;
        } else {
            return value;
        }
    }
}, {
    name: 'yearsPlanTotalMoney',
    title: '次年安排',
    format: function (data) {
        let value = "0";
        var nextYears = new Date().getFullYear() + 1;
        if (data) {
            let money = JSON.parse(data);
            var index = money.find(function(x) {
                return x.years == nextYears;
            });
            if(index){
                value = index.money;
            }
            return value;
        } else {
            return value;
        }
    }
}, {
    name: 'yearsPlanTotalMoney',
    title: '第三年安排',
    format: function (data) {
        let value = "0";
        var nextYearsA = new Date().getFullYear() + 2;
        if (data) {
            let money = JSON.parse(data);
            var index = money.find(function(x) {
                return x.years == nextYearsA;
            });
            if(index){
                value = index.money;
            }
            return value;
        } else {
            return value;
        }
    }
}, {
    name: 'approTotalMoney',
    title: '资金当年拨付',
    format: function (data) {
        let value = "0";
        var thisYears = new Date().getFullYear();
        if (data) {
            let money = JSON.parse(data);
            var index = money.find(function(x) {
                return x.years == thisYears;
            });
            if(index){
                value = index.money;
            }
            return value;
        } else {
            return value;
        }
    }
}, {
    name: 'approTotalPlanMoneyNo',
    title: '资金累计拨付',
}, {
    name: 'nonPaymentTotalMoneyNo',
    title: '欠付金额',
}]
router.post('/exportExcel', jsonParser, async (req, res) => {
    console.log(req.body);
    var param = req.body;
    var whereSql = "where 1=1";
    if (param.id) {
        whereSql = whereSql + " and id= " + param.id;
    }
    if (param.projectInstitution) {
        whereSql = whereSql + " and projectInstitution = '" + param.projectInstitution + "'";
    }
    if (param.projectName) {
        whereSql = whereSql + " and projectName = '" + param.projectName + "'";
    }
    if (param.projectType) {
        whereSql = whereSql + " and projectType= '" + param.projectType + "'";
    }
    if (param.projectYears) {
        whereSql = whereSql + " and projectYears= " + param.projectYears;
    }
    db.select(dbName, "", whereSql, param, "order by id", function (err, result) {//查询所有news表的数据
        let excelConfig = [];
        var listData = result.recordset;
        excelConfig.push(excelTitleConfig.map(item => {
            return item.title
        }))

        listData.forEach(list => {
            excelConfig.push(excelTitleConfig.map(item => {
                const value = list[item.name];
                // 不一定要有value， 因为可能是自由组合的value
                return item.format && item.format(value, list) || value;
            }))
        })
        var excelName = "report";
        let buffer = nodeExcel.build([{name: excelName, data: excelConfig}]);
        res.setHeader('Content-Type', 'application/octet-stream');
        let name = urlencode(excelName + '_' + (+new Date()) + '.xlsx', "utf-8");
        res.setHeader("Content-Disposition", "attachment; filename* = UTF-8''" + name);
        res.end(buffer, 'binary');
    });

});

module.exports = router;

