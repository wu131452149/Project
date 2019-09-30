/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/21.
 **/
/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/20.
 **/
const express = require('express');
const router = express.Router();
const db = require('../../db');
const dbName = "dbo.project";
const dbBudgetPlanName = "dbo.budgetPlanMoney";
const dbAppMoney = "dbo.appropriateMoney";
const dbAppNo = "dbo.approvalNumber";

router.post('/queryNewProject', function (req, res, next) {
    db.selectAll(dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
//首页的报表统计
router.post('/queryAllProject', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1";
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
    //var pageSize = 10;
    //分页查询
    // select * from [cz].[dbo].[project] where 1=1 and projectYears= 2 order by [id] offset 10*1 rows fetch next 10 rows only
    // var sql = "select * from " + dbName + whereSql + " order by id offset " + ((param.page - 1) * pageSize) + " rows fetch next " + pageSize + " rows only";
    // db.querySql(sql, "", function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });
    var pageSize = 10;
    if (param.page == 1) {
        db.select(dbName, 10, whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    } else {
        var whereSql = " ";
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

        var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + whereSql;

        db.querySql(sql, "", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    }
});

//新建project
router.post('/createProject', function (req, res, next) {
    var param = req.body;
    db.add(param, dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

//审核新建project
router.post('/approvalProject', function (req, res, next) {
    var param = req.body;
    var whereObj = {id: param.id, approvalStep: param.oldStep};
    if (param.oldStep == 1) {
        //如果是第1步并且是stepOneApp待审核状态也就是等于2，则更新为审核状态
        whereObj.stepOneApp = param.oldSuggestion;
    } else if (param.oldStep == 2) {
        //如果是第2步并且是stepTwoApp待审核状态也就是等于2，则更新为审核状态
        whereObj.stepTwoApp = param.oldSuggestion;
    } else if (param.oldStep == 3) {
        whereObj.stepThreeApp = param.oldSuggestion;
    } else if (param.oldStep == 4) {
        whereObj.stepFourApp = param.oldSuggestion;
    } else if (param.oldStep == 5) {
        whereObj.stepFiveApp = param.oldSuggestion;
    } else if (param.oldStep == 6) {
        whereObj.stepSixApp = param.oldSuggestion;
    } else if (param.oldStep == 7) {
        whereObj.stepSevenApp = param.oldSuggestion;
    }
    delete param.id;
    delete param.oldStep;
    delete param.oldSuggestion;
    db.update(param, whereObj, dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
//更新预算准备
router.post('/updateProject', function (req, res, next) {
    var param = req.body;
    var whereObj = {id: param.id, approvalStep: param.step};
    delete param.id;
    delete param.step;
    delete param.suggestion;
    db.update(param, whereObj, dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
//退库申请
router.post('/returnProject', function (req, res, next) {
    var param = req.body;
    var whereObj = {id: param.id};
    delete param.id;
    db.update(param, whereObj, dbName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
//查询project表
router.post('/queryProject', function (req, res, next) {
    var param = req.body;
    var pageSize = 10;
    var step = param.step;//1-7
    var suggestion = param.suggestion;//1-7
    var ifReturned = param.ifReturned;//0或1
    var suggestionStep = "";
    if (step == 1) {
        suggestionStep = "stepOneApp";
        suggestion = param.stepOneApp;
    } else if (step == 2) {
        suggestionStep = "stepTwoApp";
        suggestion = param.stepTwoApp;
    } else if (step == 3) {//年度预算可以录入多次
        suggestionStep = "stepThreeApp";
        suggestion = param.stepThreeApp;
    } else if (step == 4) {//拨付可以录入多次
        suggestionStep = "stepFourApp";
        suggestion = param.stepFourApp;
    } else if (step == 5) {
        suggestionStep = "stepFiveApp";
        suggestion = param.stepFiveApp;

    } else if (step == 6) {//6不用查审核，工程进度可以直接录入多次
        // suggestionStep = "stepSixApp";
        // suggestion = param.stepSixApp;

    } else if (step == 7) {//完工库都可以显示，无论是否审核
        // suggestionStep = "stepSevenApp";
        // suggestion = param.stepSevenApp;
    }
    var whereSql = " where 1=1";
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
    //默认查询条件
    if (param.step) {
        whereSql = whereSql + " and approvalStep= " + param.step;
        if(step == 3 || step == 4){
            var mstep = step - 1;
            var whereSql = whereSql +"and approvalStep>" + mstep + " and approvalStep<7 "
        }
    }
    if (param.suggestion) {
        whereSql = whereSql + " and "+suggestionStep+ "= "+ param.suggestion;
    }
    if (param.ifReturned) {
        whereSql = whereSql + " and ifReturned= " + param.ifReturned;
    }

    //var pageSize = 10;
    //分页查询
    // select * from [cz].[dbo].[project] where 1=1 and projectYears= 2 order by [id] offset 10*1 rows fetch next 10 rows only
    // var sql = "select * from " + dbName + whereSql + " order by id offset " + ((param.page - 1) * pageSize) + " rows fetch next " + pageSize + " rows only";
    // db.querySql(sql, "", function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });

    if (param.page == 1) {
        db.select(dbName, 10, whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    } else {
        whereSql = " ";
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
        //默认查询条件
        if (param.step) {
            whereSql = whereSql + " and approvalStep= " + param.step;
            if(step == 3 || step == 4){
                var mstep = step - 1;
                var whereSql = whereSql +"and approvalStep>" + mstep + " and approvalStep<7 "
            }
        }
        if (param.suggestion) {
            whereSql = whereSql + " and "+suggestionStep+ "= "+ param.suggestion;
        }
        if (param.ifReturned) {
            whereSql = whereSql + " and ifReturned= " + param.ifReturned;
        }
        if (step == 7 || step == 6) {
            var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + whereSql;
        } else if (step == 3 || step == 4) {
            var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + whereSql;
        } else {
            var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + whereSql;
        }
        db.querySql(sql, "", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    }


});
//查询退库project表
router.post('/queryReturnProject', function (req, res, next) {
    var param = req.body;
    var pageSize = 10;
    var name = param.name;
    var ifReturned = param.ifReturned;
    if (name) {
        var whereSql = "where ifReturned=" + ifReturned;
        db.select(dbName, 10, whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
            res.json(result);
        });
    } else {
        if (param.page == 1) {
            var whereSql = "where ifReturned=" + ifReturned;
            db.select(dbName, 10, whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
                res.json(result);
            });
        } else {
            var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + ") temp_row where rownumber>" + ((param.page - 1) * pageSize) + " and ifReturned=" + ifReturned;
            db.querySql(sql, "", function (err, result) {//查询所有news表的数据
                res.json(result);
            });
        }
    }


});
router.post('/queryProjectCount', function (req, res, next) {
    var param = req.body;
    var step = param.step;//1-7
    var suggestion = param.suggestion;//是否通过
    var ifReturned = param.ifReturned;
    var suggestionStep = "";
    if (step == 1) {
        suggestionStep = "stepOneApp";
        suggestion = param.stepOneApp;
    } else if (step == 2) {
        suggestionStep = "stepTwoApp";
        suggestion = param.stepTwoApp;
    } else if (step == 3) {
        suggestionStep = "stepThreeApp";
        suggestion = param.stepThreeApp;

    } else if (step == 4) {
        suggestionStep = "stepFourApp";
        suggestion = param.stepFourApp;

    } else if (step == 5) {
        suggestionStep = "stepFiveApp";
        suggestion = param.stepFiveApp;

    } else if (step == 6) {
        suggestionStep = "stepSixApp";
        suggestion = param.stepSixApp;

    } else if (step == 7) {
        suggestionStep = "stepSevenApp";
        suggestion = param.stepSevenApp;

    }
    var sql = "select count(id) as num from " + dbName + " where approvalStep=" + step + " and " + suggestionStep + " not in (" + suggestion + ") and ifReturned=" + ifReturned;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryReturnProjectCount', function (req, res, next) {
    var param = req.body;
    var ifReturned = param.ifReturned;
    var sql = "select count(id) as num from " + dbName + " where ifReturned=" + ifReturned;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryAllProjectCount', function (req, res, next) {
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
    var sql = "select count(id) as num from " + dbName + " " + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

/*************************预算表****************************/
//增加预算
router.post('/addBudgetYearsPlan', function (req, res, next) {
    var param = req.body;
    db.add(param, dbBudgetPlanName, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

router.post('/queryBudgetYearsPlanMoney', function (req, res, next) {
    var param = req.body;
    var whereSql = "where userName ='" + param.userName + "'";
    db.select(dbBudgetPlanName, "", whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

/*************************拨付表****************************/

//增加预算
router.post('/addAppMoney', function (req, res, next) {
    var param = req.body;
    db.add(param, dbAppMoney, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

router.post('/queryAppMoney', function (req, res, next) {
    var param = req.body;
    var whereSql = "where userName ='" + param.userName + "'";
    db.select(dbAppMoney, "", whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
/*************************评审文号****************************/

//增加评审文号
router.post('/addAppNo', function (req, res, next) {
    var param = req.body;
    db.add(param, dbAppNo, function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

router.post('/queryAppNo', function (req, res, next) {
    var param = req.body;
    var whereSql = "where userName ='" + param.userName + "'";
    db.select(dbAppNo, "", whereSql, "", "order by id", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

module.exports = router;


