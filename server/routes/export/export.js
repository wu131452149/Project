/**
 * 这个文件主要是导出
 *  created by LilyLee on 2019/9/24.
 **/
var nodeExcel = require("excel-export");//首先，引入excel模块：
var express = require('express');
var app = express();
var router = express.Router();
const db = require('../../db');
const dbName = "dbo.project";


router.get('/exportExcel',function (req,res) {
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
    var conf ={};
    conf.name = "mysheet";
    conf.cols = [{
        caption:'string',
        type:'string',
    },{
        caption:'date',
        type:'date',
    },{
        caption:'bool',
        type:'bool'
    },{
        caption:'number',
        type:'number'
    }];
    conf.rows = [
        ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
        ["e", new Date(2012, 4, 1), false, 2.7182],
        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
        ["null date", null, true, 1.414]
    ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
});
app.listen(3000);
module.exports = router;

