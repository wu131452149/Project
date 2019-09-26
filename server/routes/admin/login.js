const express = require('express');
const router = express.Router();
const db = require('../../db');

/* Post login page. */
router.post('/login', function (req, res, next) {
    var param = req.body;
    var whereSql = "where userName ='"+param.userName+"'"+"and password='"+param.password+"'";
    db.select('dbo.proUser', 20,whereSql,param,"",function (err, result) {//查询所有user表的数据
        res.json(result);
    });
});
/* get menu page. */
router.get('/menu', function (req, res, next) {
    db.selectAll("dbo.menu", function (err, data) {//查询menu
        if (err) {
            console.log("Error:" + err);
            return res;
        }
        //封装一下
        res.json(data);
    })
});
/* GET home page. */
// router.get('/', function (req, res, next) {
//     db.selectAll('news', function (err, result) {//查询所有news表的数据
//         res.render('newsList', {results:records.recordset, moment:moment});
//     });
// });
//
// router.get('/delete/:id', function (req, res, next) {//删除一条id对应的news表的数据
//     var id = req.params.id;
//     db.del("where id = @id", {id:id}, "news", function(err, result){
//         res.redirect('back');//返回前一个页面
//     });
// });
// router.post('/update/:id', function (req, res, next) {//更新一条对应id的news表的数据
//     var id = req.params.id;
//     var content = req.body.content;
//     db.update({content:content}, {id:id}, "news", function(err, result){
//         res.redirect('back');
//     });
// });

module.exports = router;
