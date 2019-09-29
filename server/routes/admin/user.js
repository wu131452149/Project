const express = require('express');
const router = express.Router();
const db = require('../../db');
var fs = require('fs');
var multer = require('multer');//引入multer
var upload = multer({dest: 'uploads/'});//设置上传文件存储地址

router.post('/uploadFile', upload.single('file'), (req, res, next) => {
    let ret = {};
    ret['code'] = 20000;
    var file = req.file;
    if (file) {
        var fileNameArr = file.originalname.split('.');
        var suffix = fileNameArr[fileNameArr.length - 1];
        fs.readFile('./uploads/'+file.filename,function(err,data){
//文件上传后默认是一堆字符串的名字并且没有后缀名称的未知格式文件，
// 这里我们要用req.files查看原始文件的数据并且读取，待读取成功后进行下一步操作
            fs.writeFile('./uploads/'+file.filename,data,function(err,data){
//写入文件
                if(!err){
                    //文件重命名
                    fs.renameSync('./uploads/' + file.filename, `./uploads/${file.filename}.${suffix}`);
                    file['newfilename'] = `${file.filename}.${suffix}`;
                    ret['file'] = file;
                    res.send(ret);
                }else{
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

router.post('/changePwd', function (req, res, next) {
    var param = req.body;
    db.update({password:param.password}, {id:param.id}, "dbo.proUser",function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});


module.exports = router;
