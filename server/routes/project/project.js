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
const dbNewPro = "dbo.newProject";

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
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= '" + param.projectFinance + "'";
    }
    //var pageSize = 10;
    //分页查询
    // select * from [cz].[dbo].[project] where 1=1 and projectYears= 2 order by [id] offset 10*1 rows fetch next 10 rows only
    // var sql = "select * from " + dbName + whereSql + " order by id offset " + ((param.page - 1) * pageSize) + " rows fetch next " + pageSize + " rows only";
    // db.querySql(sql, "", function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });
    var pageSize = 10;
    var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + " " + whereSql + ") temp_row where rownumber>" + ((param.page - 1) * pageSize);
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

//新建project
router.post('/createProject', function (req, res, next) {
    var param = req.body;
    db.add(param, dbName, function (err, result) {//插入一条project
        if (result.rowsAffected.length > 0) {
            //插入一条表在newProject
            var whereSql = "where role = '" + param.projectFinance + "'";
            db.select(dbNewPro, 1, whereSql, "", "order by id", function (err, res1) {
                if (res1.recordset.length > 0) {
                    var data = res1.recordset[0];
                    data.stepOne = data.stepOne + 1;
                    var whereObj = {id: data.id};
                    delete data.id;
                    db.update(data, whereObj, dbNewPro, function (err, res2) {//插入一条新的数据
                        res.json(result);
                    });
                } else {
                    res.json(result);
                }
            });
        } else {
            res.json(result);
        }


    });
});

//审核project
router.post('/approvalProject', function (req, res, next) {
    var param = req.body;
    var step = param.oldStep;
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
    if (param.projectFinance) {
        var projectFinance = param.projectFinance;
    }
    delete param.id;
    delete param.oldStep;
    delete param.oldSuggestion;
    delete param.projectFinance;
    db.update(param, whereObj, dbName, function (err, result) {//查询所有news表的数据
        if (result.rowsAffected.length > 0) {
            //查询newProject的表
            //TODO 把每个步骤的审核的单位去掉
            var whereSql = "where role = '" + projectFinance + "'";
            db.select(dbNewPro, 1, whereSql, "", "order by id", function (err, res1) {
                if (res1.recordset.length > 0) {
                    var data = res1.recordset[0];
                    var whereObj = {id: data.id};
                    delete data.id;
                    if (step == 1) {
                        data.stepOne = data.stepOne - 1;
                    } else if (step == 2) {
                        data.stepTwo = data.stepTwo - 1;
                    } else if (step == 3) {
                        data.stepThree = data.stepThree - 1;
                    } else if (step == 4) {
                        data.stepFour = data.stepFour - 1;
                    } else if (step == 5) {
                        data.stepFive = data.stepFive - 1;
                    } else if (step == 6) {
                        data.stepSix = data.stepSix - 1;
                    } else if (step == 7) {
                        data.stepSeven = data.stepSeven - 1;
                    }
                    db.update(data, whereObj, dbNewPro, function (err, result2) {//插入一条新的数据
                        res.json(result);
                    });
                } else {
                    res.json(result);
                }
            });
        } else {
            res.json(result);
        }
    });
});
//查询数据库有没有新的数据
router.post('/queryIfNewProject', function (req, res, next) {
    var param = req.body;
    var whereSql = "where role = '" + param.role + "'";
    db.select(dbNewPro, "", whereSql, "", "order by id", function (err, result) {
        res.json(result);
    })
});
//更新project相关东西
router.post('/updateProject', function (req, res, next) {
    var param = req.body;
    var step = param.trueStep || param.step;
    if (param.oldStep == 0 || param.oldStep) {
        step = param.oldStep;
    }
    if (param.id) {
        var whereObj = {id: param.id};
    } else {
        var whereObj = {id: param.id, approvalStep: step};
    }
    delete param.id;
    delete param.step;
    delete param.suggestion;
    delete param.trueStep;
    if (param.oldStep == 0 || param.oldStep) {
        delete param.oldStep;
    }
    if (param.projectFinance) {
        var projectFinance = param.projectFinance;
        delete param.projectFinance;
    }
    db.update(param, whereObj, dbName, function (err, result) {//查询所有news表的数据
        if (result.rowsAffected.length > 0) {
            //传入审批项目的人（插入一条表在newProject）
            var whereSql = "where role = '" + projectFinance + "'";
            db.select(dbNewPro, 1, whereSql, "", "order by id", function (err, res1) {
                if (res1.recordset.length > 0) {
                    var data = res1.recordset[0];
                    var whereObj = {id: data.id};
                    delete data.id;
                    if (step == 1) {
                        data.stepOne = data.stepOne + 1;
                    } else if (step == 2) {
                        data.stepTwo = data.stepTwo + 1;
                    } else if (step == 3) {
                        data.stepThree = data.stepThree + 1;
                    } else if (step == 4) {
                        data.stepFour = data.stepFour + 1;
                    } else if (step == 5) {
                        data.stepFive = data.stepFive + 1;
                    } else if (step == 6) {
                        data.stepSix = data.stepSix + 1;
                    } else if (step == 7) {
                        data.stepSeven = data.stepSeven + 1;
                    }
                    db.update(data, whereObj, dbNewPro, function (err, result2) {//插入一条新的数据
                        res.json(result);
                    });
                } else {
                    res.json(result);
                }
            });
        } else {
            res.json(result);
        }
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
//退库申请
router.post('/deleteProject', function (req, res, next) {
    var param = req.body;
    db.del("where id = @id", {id: param.id}, dbName, function (err, result) {//删除字段
        res.json(result);
    });
});
//查询project表
router.post('/queryProject', function (req, res, next) {
    var param = req.body;
    var pageSize = 10;
    var step = param.step;//1-7
    var suggestion = "";//批准0、1、2
    var ifReturned = param.ifReturned;//0或1
    var suggestionStep = "";
    if (step == 1) {
        suggestionStep = "stepOneApp";
        suggestion = param.stepOneApp;
    } else if (step == 2) {
        suggestionStep = "stepTwoApp";
        suggestion = param.stepTwoApp;
    } else if (step == 3) {//年度预算可以录入多次
        //suggestionStep = "stepThreeApp";
        //suggestion = param.stepThreeApp;
    } else if (step == 4) {//拨付可以录入多次
        //suggestionStep = "stepFourApp";
        //suggestion = param.stepFourApp;
    } else if (step == 5) {//预算可以变更多次
        //suggestionStep = "stepFiveApp";
        //suggestion = param.stepFiveApp;

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
    if (param.ifEdit) {
        whereSql = whereSql + " and ifEdit= " + param.ifEdit;
    }
    //默认查询条件
    if (param.step) {
        if (step == 3) {
            whereSql = whereSql + " and approvalStep>2 and approvalStep<7 "
        } else if (step == 4 || step == 5 || step == 6) {
            whereSql = whereSql + " and approvalStep>3 and approvalStep<7 "
        } else {
            whereSql = whereSql + " and approvalStep= " + param.step;
        }
    }
    if (suggestion) {
        whereSql = whereSql + " and " + suggestionStep + " not in ( " + suggestion + ")";
    }
    if (param.ifReturned) {
        whereSql = whereSql + " and ifReturned= " + param.ifReturned;
    }
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= '" + param.projectFinance + "'";
    }

    //var pageSize = 10;
    //分页查询
    // select * from [cz].[dbo].[project] where 1=1 and projectYears= 2 order by [id] offset 10*1 rows fetch next 10 rows only
    // var sql = "select * from " + dbName + whereSql + " order by id offset " + ((param.page - 1) * pageSize) + " rows fetch next " + pageSize + " rows only";
    // db.querySql(sql, "", function (err, result) {//查询所有news表的数据
    //     res.json(result);
    // });
    var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + " " + whereSql + ") temp_row where rownumber>" + ((param.page - 1) * pageSize);
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });


});
//查询退库project表
router.post('/queryReturnProject', function (req, res, next) {
    var param = req.body;
    var pageSize = 10;
    var ifReturned = param.ifReturned;
    var whereSql = "where ifReturned=" + ifReturned;
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= '" + param.projectFinance + "'";
    }
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
    var sql = "select top " + pageSize + " * from (select row_number() over(order by id asc) as rownumber,* from " + dbName + " " + whereSql + ") temp_row where rownumber>" + ((param.page - 1) * pageSize);
    db.querySql(sql, "", function (err, result) {//查询退库表的数据
        res.json(result);
    });

});
//查询project表数量
router.post('/queryProjectCount', function (req, res, next) {
    var param = req.body;
    var step = param.step;//1-7
    var suggestion = "";//是否通过
    var ifReturned = param.ifReturned;
    var suggestionStep = "";
    if (step == 1) {
        suggestionStep = "stepOneApp";
        suggestion = param.stepOneApp;
    } else if (step == 2) {
        suggestionStep = "stepTwoApp";
        suggestion = param.stepTwoApp;
    } else if (step == 3) {
        // suggestionStep = "stepThreeApp";
        //suggestion = param.stepThreeApp;

    } else if (step == 4) {
        //suggestionStep = "stepFourApp";
        //suggestion = param.stepFourApp;

    } else if (step == 5) {
        //suggestionStep = "stepFiveApp";
        //suggestion = param.stepFiveApp;

    } else if (step == 6) {
        // suggestionStep = "stepSixApp";
        // suggestion = param.stepSixApp;

    } else if (step == 7) {
        // suggestionStep = "stepSevenApp";
        // suggestion = param.stepSevenApp;

    }
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
    //默认查询条件
    if (param.step) {
        if (step == 3) {
            whereSql = whereSql + " and approvalStep>2 and approvalStep<7 "
        } else if (step == 4 || step == 5 || step == 6) {
            whereSql = whereSql + " and approvalStep>3 and approvalStep<7 "
        } else {
            whereSql = whereSql + " and approvalStep= " + param.step;
        }
    }
    if (suggestion) {
        whereSql = whereSql + " and " + suggestionStep + " not in ( " + suggestion + ")";
    }
    if (param.ifReturned) {
        whereSql = whereSql + " and ifReturned= " + param.ifReturned;
    }
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= '" + param.projectFinance + "'";
    }
    if (param.ifEdit) {
        whereSql = whereSql + " and ifEdit= " + param.ifEdit;
    }

    var sql = "select count(id) as num from " + dbName + " where 1=1" + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});
router.post('/queryReturnProjectCount', function (req, res, next) {
    var param = req.body;
    var ifReturned = param.ifReturned;
    var whereSql = "  where ifReturned=" + ifReturned;
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= ' " + param.projectFinance + "'";
    }
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
    var sql = "select count(id) as num from " + dbName + whereSql;
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
    if (param.commitName) {
        whereSql = whereSql + " and commitName= '" + param.commitName + "'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + " and projectFinance= '" + param.projectFinance + "'";
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
/*************************查询总数***************************/
//预算评审金额和估算总额
router.post('/queryAllBudgetReviewMoney', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1 ";
    if (param.commitName) {
        whereSql = whereSql + "and commitName = '" + param.commitName+"'";
    }
    if (param.projectFinance) {
        whereSql = whereSql + "and projectFinance = '" + param.projectFinance+"'";
    }
    var sql = "SELECT SUM(projectMoney) as projectMoney,SUM(budgetReviewMoney) as budgetReviewMoney,SUM(nonPaymentTotalMoneyNo) as nonPaymentTotalMoneyNo FROM dbo.project" + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

//查询拨付金额
router.post('/queryAllAppropriateMoney', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1 ";
    if (param.userName) {
        whereSql = whereSql + "and userName = '" + param.userName+"'";
    }
    if (param.role) {
        whereSql = whereSql + "and role = '" + param.role+"'";
    }
    var sql = "SELECT SUM(money) as money FROM dbo.appropriateMoney" + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

//查询年度安排金额
router.post('/queryAllBudgetPlanMoney', function (req, res, next) {
    var param = req.body;
    var whereSql = " where 1=1 ";
    if (param.userName) {
        whereSql = whereSql + "and userName = '" + param.userName+"'";
    }
    if (param.role) {
        whereSql = whereSql + "and role = '" + param.role+"'";
    }
    var sql = "SELECT SUM(money) as money FROM dbo.budgetPlanMoney" + whereSql;
    db.querySql(sql, "", function (err, result) {//查询所有news表的数据
        res.json(result);
    });
});

module.exports = router;


