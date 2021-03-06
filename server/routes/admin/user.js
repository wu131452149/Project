const express = require('express');
const router = express.Router();
const db = require('../../db');
var fs = require('fs');
var multer = require('multer');//引入multer
var upload = multer({dest: 'uploads/'});//设置上传文件存储地址
var dbName = "dbo.proUser";

router.post('/uploadFile', upload.single('file'), (req, res, next) => {
    let ret = {};
    ret['code'] = 20000;
    var file = req.file;
    if (file) {
        var fileNameArr = file.originalname.split('.');
        var suffix = fileNameArr[fileNameArr.length - 1];
        fs.readFile('./uploads/' + file.filename, function (err, data) {
//文件上传后默认是一堆字符串的名字并且没有后缀名称的未知格式文件，
// 这里我们要用req.files查看原始文件的数据并且读取，待读取成功后进行下一步操作
            fs.writeFile('./uploads/' + file.filename, data, function (err, data) {
//写入文件
                if (!err) {
                    //文件重命名
                    fs.renameSync('./uploads/' + file.filename, `./uploads/${file.filename}.${suffix}`);
                    file['newfilename'] = `${file.filename}.${suffix}`;
                    ret['file'] = file;
                    res.send(ret);
                } else {
                    console.log(err);
                    res.send(err);
                }
            })
        })

    }

});

router.post('/downloadFile', (req, res, next) => {
    var filename = req.body.name;
    var oldname = req.body.oname;
    var file = './uploads/' + filename;
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',//告诉浏览器这是一个二进制文件
        //'Content-Disposition': 'attachment; filename=' + encodeURI(oldname),//告诉浏览器这是一个需要下载的文件
        'Content-Disposition': 'attachment; filename=' + encodeURI(oldname),//告诉浏览器这是一个需要下载的文件
    });//设置响应头
    var readStream = fs.createReadStream(file);//得到文件输入流
    //debugger
    readStream.setEncoding('utf8');
    readStream.on('data', (chunk) => {
        res.write(chunk, 'binary');//文档内容以二进制的格式写到response的输出流
    });
    readStream.on('end', () => {
        res.end();
    })
})
//更改密码
router.post('/changePwd', function (req, res, next) {
    var param = req.body;
    db.update({password: param.password}, {id: param.id}, dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
//查询用户
router.post('/queryAllUsers', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1";
    var pageSize = 10;

    if (param.id) {
        whereSql = whereSql + " and id= " + param.id;
    }
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }
    if (param.role) {
        whereSql = whereSql + " and role = '" + param.role + "'";
    }
    if (param.grade) {
        whereSql = whereSql + " and grade = " + param.grade;
    }
    var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + whereSql + ") temp_row where rownumber>" + ((param.page - 1) * pageSize);
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryAllUsersCount', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1";
    if (param.id) {
        whereSql = whereSql + " and id= " + param.id;
    }
    if (param.userName) {
        whereSql = whereSql + " and userName = '" + param.userName + "'";
    }
    if (param.role) {
        whereSql = whereSql + " and role = '" + param.role + "'";
    }
    if (param.grade) {
        whereSql = whereSql + " and grade = " + param.grade;
    }
    var sql = "select count(id) as num from " + dbName + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

function dateAndTime(dateTime) {
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth();
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minites = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    month = month + 1 > 9 ? month + 1 : '0' + (month + 1);
    day = day > 9 ? day : '0' + day;
    hour = hour > 9 ? hour : '0' + hour;
    minites = minites > 9 ? minites : '0' + minites;
    second = second > 9 ? second : '0' + second;
    var data = year + "-" + month + "-" + day + " " + hour + ":" + minites + ":" + second;
    return data;
}

router.post('/createUser', function (req, res, next) {
    var param = req.body;
    db.add(param, dbName, function (err, result) {//查询所有news表的数据
        if (param.grade == 1) {
            var data = {};
            data.name = param.role;
            data.userName = param.role;
            data.grade = param.grade;
            data.time = dateAndTime(new Date()) + ".000";
            db.add(data, "dbo.institution", function (err, result) {//插入一条数据
                res.json(result);
            })
        } else  if(param.grade==2){
            var userData = {};
            userData.stepOne = 0;
            userData.stepTwo = 0;
            userData.stepThree = 0;
            userData.stepFour = 0;
            userData.stepFive = 0;
            userData.stepSix = 0;
            userData.stepSeven = 0;
            userData.role = param.role;
            db.add(userData, "dbo.newProject", function (err, result) {//插入一条数据
                res.json(result);
            });
        }else{
            res.json(result);
        }
    });
});
router.post('/updateUser', function (req, res, next) {
    var param = req.body;
    var whereObj = {id: param.id};
    delete param.id;
    db.update(param, whereObj, dbName, function (err, result) {//更新字段
        if (param.grade == 1) {
            var data = {};
            data.name = param.userName;
            data.userName = param.userName;
            data.grade = param.grade;
            data.time = dateAndTime(new Date()) + ".000";
            db.add(data, "dbo.institution", function (err, result) {//插入一条数据
                res.json(result);
            })
        } else {
            res.json(result);
        }
    });
});
router.post('/deleteUser', function (req, res, next) {
    var param = req.body;
    db.del("where id = @id", {id: param.id}, dbName, function (err, result) {//删除字段
        res.json(result);
    });
});
router.post('/queryUserName', function (req, res, next) {
    db.selectAll(dbName, function (err, data) {//查询userName
        if (err) {
            console.log("Error:" + err);
            return res;
        }
        //封装一下
        res.json(data);
    })
});


module.exports = router;
