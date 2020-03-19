/**
 * 这个文件主要是修改项目每项
 *  created by LilyLee on 2020/3/18.
 **/
import Utils from "../../lib/utils/Utils";


export default {
    name: "ShowAllDetailView",
    props: ['projectDetail'],
    data() {
        return {
            dialog: false,
            drawer: false,
            drawerCreated: false,
            loading: false,
            direction: 'rtl',
            defaultDate: new Date(),
            newProject: [],
            projectInstitution: [],
            planYearsMoneyList3: [],
            appropriateBudgetList4: [],
            appropriateTopBudgetList4: [],
            cutBudget: [],
            addBudget: [],
            triInfoList: [],
            editProject: {
                projectInstitution: "",
                projectFinance: "行政政法股",
                projectName: "",
                projectType: "新建",
                projectMoney: "",
                projectIndustry: {
                    first: "",
                    second: ""
                },
                projectMoneyFrom: [],
                projectBeginTime: "",
                projectContactUserName: "",
                projectContactUserPhone: "",
                projectSituation: "",
                projectYears: 1,
                //第2步
                gvApproval: "是",//政府批示
                budgetReviewMoney: "",
                approvalNumber: "",
                stateOwnedRegistration: "是",
                gvBuy: "是",
                //fileList: [],
                //第6
                speed: "",//进度
                //第7
                finishMoney: "",
                planYearsMoneyList3: [],
                planYearsTopMoneyList3: [],//没有定义的话就不可以编辑
                appropriateBudgetList4: [],
                appropriateTopBudgetList4: [],
                cutBudget: [],
                addBudget: [],
                triInfoList: [],
            },
            rules: {
                projectInstitution: [
                    {required: true, message: '请选择项目单位', trigger: 'change'}
                ],
                projectFinance: [
                    {required: true, message: '请选择财政归口股室', trigger: 'change'}
                ],
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'},
                ],
                projectMoney: [
                    {required: true, message: '请输入投资估算总额', trigger: 'blur'},
                ],
                projectYears: [
                    {required: true, message: '请选择项目建设周期', trigger: 'change'},
                ],
                projectBeginTime: [
                    {required: true, message: '请选择项目开工时间', trigger: 'change'},
                ],
                budgetReviewMoney: [
                    {required: true, message: '请输入预算评审金额', trigger: 'blur'},
                ],
                approvalNumber: [
                    {required: true, message: '请输入评审文号', trigger: 'blur'},
                ],
                // money: [
                //     {required: true, trigger: 'blur', validator: checkMoney},
                // ],
                type: [
                    {required: true, message: '请选择拨付类型', trigger: 'change'},
                ],

            },
            newIndustry: [],
            selectIndustry: Utils.getIndustryData(),
            moneyFrom: Utils.getMoneyFrom(),
            projectType: Utils.getProjectType(),
            getProjectYears: Utils.getProjectYears(),
            user: {},
            //第2步
            booleanData: [{name: "是", value: 1}, {name: "否", value: 0}],
            //第3步
            yearsPlanType: Utils.getYearsPlanType(),//3个
            yearsOptionType: Utils.getOptionYears(),//如果有自筹金额了就不用显示自筹的修改了
            //第4步，
            options: [],
            yearsPlanType4: Utils.getOptionYears(),
        }

    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //self.projectInstitution = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            self.projectInstitution = list;
        })
    },
    computed:{
        check3Money:()=> {
            var self = this;
            //累计县级预算合计小于预算评审金额总数
            console.log("11+",this);
            console.log(this.editProject);
            if(this.editProject){
                var total1 = 0;
                for (var x = 0; x < this.editProject.planYearsMoneyList3.length; x++) {
                    total1 = total1 + Number(this.editProject.planYearsMoneyList3[x].money);
                }
                var total2 = 0;
                for (var y = 0; y < this.editProject.planYearsTopMoneyList3.length; y++) {
                    total2 = total2 + Number(this.editProject.planYearsTopMoneyList3[y].money);
                }
                var total = total1 + total2 + Number(value);
                return total
            }else{
                return 0
            }

        }

    },
    methods: {
        checkMoney4: (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            //累计拨付小于累计安排，累计安排总数yearsPlanTotalMoneyNo，累计拨付总数approTotalPlanMoneyNo
            if (!self.editProject1.approTotalPlanMoneyNo) {
                self.editProject1.approTotalPlanMoneyNo = 0;
            }
            //未审核的拨付也要算上总数
            var bjbf = 0;
            var sjbf = 0;
            var bjap = 0;
            var sjap = 0;
            //本级拨付
            var appropriateTotalBudgetList = self.editProject.appropriateBudgetList4;
            for (var a = 0; a < appropriateTotalBudgetList.length; a++) {
                bjbf = bjbf + Number(appropriateTotalBudgetList[a].money);
            }
            console.log("本级拨付", bjbf);
            //上级拨付
            var appropriateBudgetList = self.editProject.appropriateTopBudgetList4;
            for (var b = 0; b < appropriateBudgetList.length; b++) {
                sjbf = sjbf + Number(appropriateBudgetList[b].money);
            }
            console.log("上级拨付", sjbf);
            //本级安排
            var yearsPlanTotalMoneyList = self.editProject.planYearsMoneyList3;
            for (var c = 0; c < yearsPlanTotalMoneyList.length; c++) {

                bjap = bjap + Number(yearsPlanTotalMoneyList[c].money);
            }
            console.log("本级安排", bjap);
            //上级安排
            var yearsPlanTotalTopMoneyList = self.editProject.planYearsTopMoneyList3;
            for (var d = 0; d < yearsPlanTotalTopMoneyList.length; d++) {
                sjap = sjap + Number(yearsPlanTotalTopMoneyList[d].money);
            }
            console.log("上级安排", sjap);
            //self.projectDetail.approTotalPlanMoneyNo是审核通过的不用了
            if (Number(bjbf) > bjap) {
                callback(new Error('累计本级拨付总数必须小于等于本级累计安排总数'));
            } else {
                callback();
            }
            if (Number(sjbf) > sjap) {
                callback(new Error('累计上级拨付总数必须小于等于累计上级安排总数'));
            } else {
                callback();
            }
        },
        checkMoney3: (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            console.log(this);
            // console.log(total1);
            // console.log(total2);
            // console.log(total);
            if (this.check3Money > this.editProject.budgetReviewMoney) {
                callback(new Error('累计县级预算合计必须小于等于预算评审金额总数'));
            } else {
                callback();
            }
        },
        checkMoney: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('金额必须大于等于0'))
            }
        },
        check2Money: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('金额必须大于等于0'))
            }
        },
        checkApprovalChangeNo: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('请输入评审文号'))
            }
        },
        //查询单位
        queryInstitution: function (callback) {
            let self = this;
            let data = {};
            data.userName = self.user.role;
            self.$http.post('/api/institution/queryAllInstitution', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //self.dataList = res.data.recordset;
                        callback(res.data.recordset);
                    } else {
                        console.log("查询单位失败");
                        callback([]);
                    }
                }
            })

        },
        closeForm: function () {
            //this.$emit('onListen', false);
            this.drawerClick.drawerNew.hide();
        },
        //新建表单，项目
        commitEditForm: function () {
            //this.$emit('onListen');
            var self = this;
            self.$refs.editProject.validate((valid) => {
                if (valid) {
                    let editProject = _.cloneDeep(self.editProject);
                    if (editProject.projectIndustry.first) {
                        editProject.projectIndustry = '{"' + editProject.projectIndustry.first + '","' + editProject.projectIndustry.second + '"}';
                    } else {
                        editProject.projectIndustry = "";
                    }
                    if (editProject.projectMoneyFrom) {
                        editProject.projectMoneyFrom = JSON.stringify(editProject.projectMoneyFrom).replace("[", "{").replace("]", "}");
                    } else {
                        editProject.projectMoneyFrom = [];
                    }
                    for (var i = 0; i < self.getProjectYears.length; i++) {
                        if (editProject.projectYears == self.getProjectYears[i].name) {
                            editProject.projectYears = self.getProjectYears[i].value;
                        }
                    }
                    console.log(editProject);
                    //上级安排金额
                    var newObj1 = JSON.parse(self.planYearsMoneyList3);//先解成数组；
                    editProject.planYearsTopMoney = JSON.stringify(self.planYearsTopMoneyList3);
                    //本级安排金额
                    editProject.planYearsMoney = JSON.stringify(self.planYearsMoneyList3);
                    var obj = {};
                    //status是审核状态
                    // if(!self.projectDetail.planYearsMoney){//第一次录入县级预算安排
                    //     obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2}]);
                    // }else{
                    //     var newObj = JSON.parse(self.projectDetail.planYearsMoney);//先解成数组；
                    //     newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2});
                    //     obj = JSON.stringify(newObj);
                    // }
                    // //var obj = self.initObj(self.projectDetail.planYearsMoney, editBudgetData);
                    // self.projectDetail.planYearsMoney = obj;
                    // editBudgetData.planYearsMoney = obj;
                    //
                    // if(!self.projectDetail.planYearsTopMoney){//第一次录入县级预算安排
                    //     obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2}]);
                    // }else{
                    //     var newObj = JSON.parse(self.projectDetail.planYearsTopMoney);//先解成数组；
                    //     newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2});
                    //     obj = JSON.stringify(newObj);
                    // }
                    // self.projectDetail.planYearsTopMoney = obj;
                    // editBudgetData.planYearsTopMoney = obj;
                    //     //计算总的
                    //     yearsPlanTotalMoney分年度安排金额总额
                    //     本级拨付
                    //     appropriateBudget
                    // 上级拨付
                    // appropriateTopBudget
                    // //计算
                    // approTotalMoney分年度拨付金额总额
                    //
                    // nonPaymentTotalMoneyNo欠付金额数字
                    // approTotalPlanMoneyNo 拨付总额数字
                    // yearsPlanTotalMoneyNo 安排总额数字
                    //     [thisYearPlanMoney]	当年安排金额
                    //     [nextYearPlanMoney]	次年安排金额
                    //     [nextAYearPlanMoney]	第三年安排金额
                    //     [beforeYearPlanMoney]	以前年度累计安排金额
                    //     [thisYearGiveMoney]	当年拨付
                    //     [triInfo]       	三方信息
                    //     [addBudget]		增加金额
                    //     [cutBudget]		减少金额


                    self.$http.post('/api/project/editProject', editProject).then(res => {
                        let status = res.status;
                        let statusText = res.statusText;
                        if (status !== 200) {
                            self.$message({
                                message: statusText,
                                type: 'error'
                            });
                        } else {
                            if (res.data.length != 0) {
                                self.$message({
                                    message: "提交成功",
                                    type: 'success'
                                });
                                //关闭当前页，并清空表格数据
                                self.clearFormData();
                                self.closeForm();
                                //刷新当前页
                                self.$emit("refreshPro");
                            } else {
                                self.$message({
                                    message: "提交失败",
                                    type: 'warning'
                                });
                            }
                        }
                    })
                        .catch(error =>
                                self.$message({
                                    message: error.message,
                                    type: 'error'
                                }),
                            self.logining = false
                        );
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearFormData: function () {
            var self = this;
            self.editProject.projectInstitution = "";
            self.editProject.projectFinance = "行政政法股";
            self.editProject.projectName = "";
            self.editProject.projectType = "新建";
            self.editProject.projectMoney = "";
            self.editProject.projectIndustry = {first: "", second: ""};
            self.editProject.projectMoneyFrom = [];
            self.editProject.projectBeginTime = "";
            self.editProject.projectContactUserName = "";
            self.editProject.projectContactUserPhone = "";
            self.editProject.projectSituation = "";
            self.editProject.projectYears = 1;

        },
        //选择一级
        selectFirstChange(value) {
            var self = this;
            var index = _.findIndex(self.selectIndustry, function (o) {
                return o.value == value;
            });
            self.newIndustry = self.selectIndustry[index].childrens;
            self.editProject.projectIndustry.second = self.newIndustry[0].name;
        },
        //选择二级
        selectSecondChange(value) {
            this.editProject.projectIndustry.second = value;
        },
        //重新入库
        updateForm: function (oldStep) {
            let self = this;
            self.$refs.editProject.validate((valid) => {
                if (valid) {
                    //更新新建表的退库状态为false，更新表的step为1
                    let data = _.cloneDeep(self.editProject);
                    data.step = 1;
                    data.ifReturned = 0;
                    data.oldStep = oldStep;
                    if (oldStep == 1) {
                        data.stepOneApp = 2;
                    }
                    if (data.projectIndustry.first) {
                        data.projectIndustry = '{"' + data.projectIndustry.first + '","' + data.projectIndustry.second + '"}';
                    } else {
                        data.projectIndustry = "";
                    }
                    if (data.projectMoneyFrom) {
                        data.projectMoneyFrom = JSON.stringify(data.projectMoneyFrom).replace("[", "{").replace("]", "}");
                    } else {
                        data.projectMoneyFrom = [];
                    }
                    data.commitName = self.user.role;
                    data.projectCommitTime = Utils.formatDate(new Date()) + ".000";
                    for (var i = 0; i < self.getProjectYears.length; i++) {
                        if (data.projectYears == self.getProjectYears[i].name) {
                            data.projectYears = self.getProjectYears[i].value;
                        }
                    }
                    self.$http.post('/api/project/updateProject', data).then(res => {
                        let status = res.status;
                        let statusText = res.statusText;
                        if (status !== 200) {
                            self.$message({
                                message: statusText,
                                type: 'error'
                            });
                        } else {
                            if (res.data.length != 0) {
                                self.$message({
                                    message: "提交成功",
                                    type: 'success'
                                });
                                //关闭当前页，并清空表格数据
                                self.clearFormData();
                                self.closeForm();
                                //刷新当前页
                                if (oldStep == 0) {
                                    self.$emit('updateReturnForm');
                                } else {
                                    self.$emit('refreshPro');
                                }
                            } else {
                                self.$message({
                                    message: "提交失败",
                                    type: 'warning'
                                });
                            }
                        }
                    })
                        .catch(error =>
                            self.$message({
                                message: error.message,
                                type: 'error'
                            }),
                        );
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }
        ,
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        }
        ,
        queryNewProject: function () {

        }
        ,
        queryNewProjectCount: function () {

        }
        ,
        showDefaultQuickQuery: function () {

        }
        ,
        handleSelectionChange: function () {

        }


// //点击详情接口返回的数据
// this.wids = res.data.result.wids                 //点击详情接口返回的 table里被选中的行的wids
// let a = res.data.result.wids.split(',')          //分割成数组
// console.log(a)
// let b = []
// this.tableData1.forEach(res=>{                  //把表格里所有的id加入到b里
//     b.push(res.id.toString())
// })
// console.log(b)
// // console.log(typeof(b[0]))
// for(let c = 0;c<b.length;c++){                 //对b循环  如果b里面有a（a是被选中的行） 则把索引代入到first函数里 让这些行的复选框选中
//     // console.log(b[c])
//     // console.log(a.indexOf(b[c]))
//     if(b.indexOf(a[c])>=0){
//         console.log(a.indexOf(b[c]))
//         this.first([this.tableData1[b.indexOf(a[c])]])
//     }
// }
//
//
//
// //封装的让table表格的复选框默认选中的函数
// first(rows){
//     this.$nextTick(()=>{
//         rows.forEach(row => {
//             this.$refs.multipleTable.toggleRowSelection(row,true);
//         });
//     })
// },
// //清除的
// clear(){
//     this.$nextTick(()=>{
//         this.$refs.multipleTable.clearSelection();
//     })
// },
    },
    watch: {
        "projectDetail": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (val) {
                    self.editProject1 = val;
                    self.editProject.id = val.id;
                    self.editProject.projectInstitution = val.projectInstitution;
                    self.editProject.projectFinance = val.projectFinance;
                    self.editProject.projectName = val.projectName;
                    self.editProject.projectType = val.projectType;
                    self.editProject.projectMoney = val.projectMoney;
                    self.editProject.projectIndustry = val.projectIndustry;
                    if (val.projectIndustry) {
                        var ins1 = val.projectIndustry.split(",")[0].replace("{", "");
                        var ins2 = val.projectIndustry.split(",")[1].replace("}", "");
                    } else {
                        var ins1 = "";
                        var ins2 = "";
                    }
                    self.editProject.projectIndustry = {first: ins1, second: ins2};
                    if (val.projectMoneyFrom) {
                        self.editProject.projectMoneyFrom = JSON.parse(val.projectMoneyFrom.replace("{", "[").replace("}", "]"));
                    } else {
                        self.editProject.projectMoneyFrom = [];
                    }
                    self.editProject.projectBeginTime = val.projectBeginTime;
                    self.editProject.projectContactUserName = val.projectContactUserName;
                    self.editProject.projectContactUserPhone = val.projectContactUserPhone;
                    self.editProject.projectSituation = val.projectSituation;
                    self.editProject.projectYears = val.projectYears;
                    //第2步的显示更改
                    //self.editProject.gvApproval = val.gvApproval;
                    if (val.gvApproval != false) {
                        self.editProject.gvApproval = "是";
                    }
                    self.editProject.budgetReviewMoney = val.budgetReviewMoney;
                    self.editProject.approvalNumber = val.approvalNumber;
                    if (val.gvApproval != false) {
                        self.editProject.stateOwnedRegistration = "是";
                    }
                    if (val.gvApproval != false) {
                        self.editProject.gvBuy = "是";
                    }
                    //第三步：显示更改
                    self.editProject.planYearsSelfMoney = val.planYearsSelfMoney;
                    if (val.planYearsMoney) {
                        self.editProject.planYearsMoneyList3 = JSON.parse(val.planYearsMoney);
                    } else {
                        self.editProject.planYearsMoneyList3 = [];
                    }
                    if (val.planYearsTopMoney) {
                        self.editProject.planYearsTopMoneyList3 = JSON.parse(val.planYearsTopMoney);
                    } else {
                        self.editProject.planYearsTopMoneyList3 = [];
                    }
                    //第4步拨付
                    if (val.appropriateBudget) {//本级拨付
                        self.editProject.appropriateBudgetList4 = JSON.parse(val.appropriateBudget);
                    } else {
                        self.editProject.appropriateBudgetList4 = [];
                    }
                    if (val.appropriateTopBudget) {//上级拨付
                        self.editProject.appropriateTopBudgetList4 = JSON.parse(val.appropriateTopBudget);
                    } else {
                        self.editProject.appropriateTopBudgetList4 = [];
                    }
                    //5
                    if (val.cutBudget) {
                        self.editProject.cutBudget = JSON.parse(val.cutBudget);
                    } else {
                        self.editProject.cutBudget = [];
                    }
                    if (val.addBudget) {
                        self.editProject.addBudget = JSON.parse(val.addBudget);
                    } else {
                        self.editProject.addBudget = [];
                    }
                    //6
                    if (val.triInfo) {//第三方
                        self.editProject.triInfoList = JSON.parse(val.triInfo);
                    } else {
                        self.editProject.triInfoList = [];
                    }
                    self.editProject.speed = val.speed;
                    self.editProject.finishMoney = val.finishMoney;
                    // self.editProject = Object.assign({},self.editProject,row)
                }
            }

        }
    },
}

