/**
 * 这个文件主要是导出
 *  created by LilyLee on 2019/9/24.
 **/
//var nodeExcel = require("excel-export");//首先，引入excel模块：
var express = require('express');
const xlsx = require('xlsx');
var app = express();
var router = express.Router();
const db = require('../../db');
const dbName = "dbo.project";
var fs = require('fs');

const nodeExcel = require('node-xlsx');
const urlencode = require('urlencode');
router.get('/exportExcel', function (req, res) {
    var list = [];
    db.selectAll(dbName, function (err, result) {//执行数据操作
        if (err) {
            //执行出错
        } else {
            var rows = ['id', 'projectInstitution', 'projectName', 'projectType', 'projectMoney', 'projectMoneyFrom'];//创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
            if(result){
                list = result.recordset;
            }
            exportList(res, config, list,"1");
            // 将格式化的数据写如excel文件
            // let data = [
            //     {
            //         name: '第一个sheet',
            //         data: [['字段1', '字段2', '字段3'], ['1', 'Michael', '99'], ['2', 'Tom', '98']]
            //     },
            //     {
            //         name: '第二个sheet',
            //         data: [['A1', 'B1'], ['A2', 'B2']]
            //     }
            // ]
            // let buffer = nodeExcel.build(data);
            // fs.writeFile('./resut.xls', buffer, function (err) {
            //     if (err) {
            //         console.log(err, '保存excel出错')
            //     } else {
            //         console.log('写入excel成功!!!')
            //         // 读取excel
            //         var obj = nodeExcel.parse('./' + 'resut.xls');
            //         console.log('读取excel成功' + JSON.stringify(obj))
            //
            //         // 下载excel表
            //         res.setHeader('Content-Type', 'application/vnd.openxmlformats')
            //         res.setHeader('Content-Disposition', 'attachment; filename=' + 'export.xlsx')
            //         res.end(buffer, 'binary')
            //     }
            // })
        }

    })





});

function exportList(ctx, config, listData, excelName) {
    let excelConfig = [];
    excelConfig.push(config.map(item => {
        return item.title
    }))

    listData.forEach(list => {
        excelConfig.push(config.map(item => {
            const value = list[item.name];
            // 不一定要有value， 因为可能是自由组合的value
            return item.format && item.format(value, list) || value;
        }))
    })

    let buffer = nodeExcel.build([{name: excelName, data: excelConfig}]);
    ctx.set('Content-Type', 'application/octet-stream');
    // ctx.request.headers['user-agent']
    let name = urlencode(excelName + '_' + (+new Date()) + '.xlsx', "utf-8");
    ctx.set("Content-Disposition", "attachment; filename* = UTF-8''" + name);
    // ctx.set("Content-Disposition", "attachment; filename="+ (+new Date()) + '.xlsx');
    //ctx.body = buffer;
    ctx.end(buffer,'binary');//将文件内容传入
}

const config = [{
    name: 'id',
    title: '项目编号',
}, {
    name: 'projectInstitution',
    title: '项目单位',
    format: function (value) {
        return value;
    }
}, {
    name: 'projectName',
    // name: 'appl_status_byhand_desc',
    title: '项目名称',
    format: function (value) {
        return value
    }
}];


module.exports = router;
// },{
//     name: 'available_quota/credit_quota',
//     title: '剩余额度/授信额度',
//     format: function(value, item) {
//         return `¥${item.available_quota/100 || 0}/¥${item.credit_quota/100 || 0}`
//     }
// },{
//     name: 'user_type_desc',
//     title: '名单类型',
//     format: function(value, item) {
//         if(item.user_type) {
//             item.user_type.forEach(user => {
//                 userTypeText.push(user_type_define[user] || '-');
//             });
//             return userTypeText.join('|');
//         } else {
//             return '';
//         }
//     }

//router.get('/exportExcel',function (req,res) {
//     var conf ={};//创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
//     var cols =['项目编号','项目单位','项目名称','项目类型','项目估算总额','资金来源'];//手动创建表头中的内容
//     conf.cols =[];//在conf中添加cols
//
//     for(var i=0;i<cols.length;i++){
//         var tits ={};//创建表头数据所对应的类型,其中包括 caption内容 type类型
//         tits.caption = cols[i];//添加内容
//         tits.type='string';//添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
//         conf.cols.push(tits);//将每一个表头加入cols中
//     }
//
//     db.selectAll(dbName,function(err,data){//执行数据操作
//         if(err){
//             //执行出错
//         }else{
//             var rows = ['id','projectInstitution','projectName','projectType','projectMoney','projectMoneyFrom'];//创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
//             var datas =[];//用于承载数据库中的数据
//             var list = data.recordset;
//             for(var i=0;i<list.length;i++){//循环数据库得到的数据，因为取出的数据格式为
//                 //[{'id':2312,'name':'张三','age':'22','sex':'男','banji':'高三一班'},{…………},{…………}]
//                 var tow =[];//用来装载每次得到的数据
//                 for(var j=0;j<rows.length;j++){//内循环取出每个
//                     tow.push(list[i][rows[j]].toString());//或者tow.push((data[i].tows[j]).toString());两种形式都是相同的
//                 }
//                 datas.push(tow);//将每一个{ }中的数据添加到承载中
//             }
//             conf.rows = datas;//将所有行加入rows中
//             var result =nodeExcel.execute(conf);//将所有数据写入nodeExcel中
//             //定义下载的文件名（CDRReport+年月日时分秒.xlsx）
//             var fileName="Report"+new Date()+".xlsx";
// //声明头部
//             res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
//             res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(fileName));
//             //res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');//设置响应头
//             //res.setHeader('Content-Disposition','attachment; filename="+encodeURLComponent("report")+".xlsx');//设置下载文件命名
//             res.end(result,'binary');//将文件内容传入
//
//         }
//    });
//     var conf ={};
//     conf.name = "mysheet";
//     conf.cols = [{
//         caption:'string',
//         type:'string',
//     },{
//         caption:'date',
//         type:'date',
//     },{
//         caption:'bool',
//         type:'bool'
//     },{
//         caption:'number',
//         type:'number'
//     }];
//     conf.rows = [
//         ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
//         ["e", new Date(2012, 4, 1), false, 2.7182],
//         ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
//         ["null date", null, true, 1.414]
//     ];
//     var result = nodeExcel.execute(conf);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//     res.end(result, 'binary');
// });
// app.listen(3000);


