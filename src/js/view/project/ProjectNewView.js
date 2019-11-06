/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/19.
 **/
import Utils from "../../lib/utils/Utils";


export default {
    name: "ProjectNewView",
    props: ['returnProjectInfo', 'type','drawerClick','reCommitProjectInfo'],
    data() {
        return {
            dialog: false,
            drawer: false,
            drawerCreated: false,
            loading: false,
            direction: 'rtl',
            defaultDate:new Date(),
            newProject: [],
            projectInstitution: [],
            createProject: {
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
                projectYears: 1
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
                projectMoney:[
                    {required: true, message: '请输入投资估算总额', trigger: 'blur'},
                ],
                projectYears:[
                    {required: true, message: '请选择项目建设周期', trigger: 'change'},
                ],
                projectBeginTime:[
                    {required: true, message: '请选择项目开工时间', trigger: 'change'},
                ]
            },
            newIndustry: [],
            selectIndustry: Utils.getIndustryData(),
            moneyFrom: Utils.getMoneyFrom(),
            projectType: Utils.getProjectType(),
            getProjectYears: Utils.getProjectYears(),
            user: {},
        }

    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //self.projectInstitution = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            self.projectInstitution = list;
        })

    }
    ,
    methods: {
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
        commitForm: function () {
            //this.$emit('onListen');
            var self = this;
            self.$refs.createProject.validate((valid) => {
                if (valid) {
                    let createProject = _.cloneDeep(self.createProject);
                    if(createProject.projectIndustry.first){
                        createProject.projectIndustry = '{"' + createProject.projectIndustry.first + '","' + createProject.projectIndustry.second + '"}';
                    }else{
                        createProject.projectIndustry = "" ;
                    }
                    if(createProject.projectMoneyFrom){
                        createProject.projectMoneyFrom = JSON.stringify(createProject.projectMoneyFrom).replace("[", "{").replace("]", "}");
                    }else{
                        createProject.projectMoneyFrom = [];
                    }
                    createProject.approvalStep = 1;
                    createProject.ifReturned = 0;
                    createProject.stepOneApp = 2;
                    createProject.commitName = self.user.role;
                    delete createProject.id;
                    createProject.projectCommitTime = Utils.formatDate(new Date()) + ".000";
                    for (var i = 0; i < self.getProjectYears.length; i++) {
                        if (createProject.projectYears == self.getProjectYears[i].name) {
                            createProject.projectYears = self.getProjectYears[i].value;
                        }
                    }
                    self.$http.post('/api/project/createProject', createProject).then(res => {
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
            self.createProject.projectInstitution = "";
            self.createProject.projectFinance = "行政政法股";
            self.createProject.projectName = "";
            self.createProject.projectType = "新建";
            self.createProject.projectMoney = "";
            self.createProject.projectIndustry = {first: "", second: ""};
            self.createProject.projectMoneyFrom = [];
            self.createProject.projectBeginTime = "";
            self.createProject.projectContactUserName = "";
            self.createProject.projectContactUserPhone = "";
            self.createProject.projectSituation = "";
            self.createProject.projectYears = 1;

        },
        //选择一级
        selectFirstChange(value) {
            var self = this;
            var index = _.findIndex(self.selectIndustry, function (o) {
                return o.value == value;
            });
            self.newIndustry = self.selectIndustry[index].childrens;
            self.createProject.projectIndustry.second = self.newIndustry[0].name;
        },
        //选择二级
        selectSecondChange(value) {
            this.createProject.projectIndustry.second = value;
        },
        //重新入库
        updateForm: function (oldStep) {
            let self = this;
            //更新新建表的退库状态为false，更新表的step为1
            let data = _.cloneDeep(self.createProject);
            data.step = 1;
            data.ifReturned = 0;
            data.oldStep = oldStep;
            if (oldStep == 1){
                data.stepOneApp = 2;
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
                        if (oldStep == 0) {
                            self.$emit('updateReturnForm');
                        }else{
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
        "returnProjectInfo": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if(val){
                    self.createProject.id = val.id;
                    self.createProject.projectInstitution = val.projectInstitution;
                    self.createProject.projectFinance = val.projectFinance;
                    self.createProject.projectName = val.projectName;
                    self.createProject.projectType = val.projectType;
                    self.createProject.projectMoney = val.projectMoney;
                    self.createProject.projectIndustry = val.projectIndustry;
                    if(val.projectIndustry){
                        var ins1 = val.projectIndustry.split(",")[0].replace("{","");
                        var ins2 = val.projectIndustry.split(",")[1].replace("}","");
                    }else{
                        var ins1 = "";
                        var ins2 = "";
                    }

                    // console.log(ins1);
                    // console.log(ins2);
                    // self.createProject.projectIndustry.first = ins1;
                    // self.createProject.projectIndustry.second = ins2;
                    self.createProject.projectIndustry = {first:ins1,second:ins2};
                    if(val.projectMoneyFrom){
                        self.createProject.projectMoneyFrom = JSON.parse(val.projectMoneyFrom.replace("{", "[").replace("}", "]"));
                    }else{
                        self.createProject.projectMoneyFrom = [];
                    }
                    self.createProject.projectBeginTime = val.projectBeginTime;
                    self.createProject.projectContactUserName = val.projectContactUserName;
                    self.createProject.projectContactUserPhone = val.projectContactUserPhone;
                    self.createProject.projectSituation = val.projectSituation;
                    self.createProject.projectYears = val.projectYears;
                }
            }

        },
        "reCommitProjectInfo": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if(val){
                    self.createProject.id = val.id;
                    self.createProject.projectInstitution = val.projectInstitution;
                    self.createProject.projectFinance = val.projectFinance;
                    self.createProject.projectName = val.projectName;
                    self.createProject.projectType = val.projectType;
                    self.createProject.projectMoney = val.projectMoney;
                    self.createProject.projectIndustry = val.projectIndustry;
                    if(val.projectIndustry){
                        var ins1 = val.projectIndustry.split(",")[0].replace("{","");
                        var ins2 = val.projectIndustry.split(",")[1].replace("}","");
                    }else{
                        var ins1 = "";
                        var ins2 = "";
                    }

                    // console.log(ins1);
                    // console.log(ins2);
                    // self.createProject.projectIndustry.first = ins1;
                    // self.createProject.projectIndustry.second = ins2;
                    self.createProject.projectIndustry = {first:ins1,second:ins2};
                    if(val.projectMoneyFrom){
                        self.createProject.projectMoneyFrom = JSON.parse(val.projectMoneyFrom.replace("{", "[").replace("}", "]"));
                    }else{
                        self.createProject.projectMoneyFrom = [];
                    }
                    self.createProject.projectBeginTime = val.projectBeginTime;
                    self.createProject.projectContactUserName = val.projectContactUserName;
                    self.createProject.projectContactUserPhone = val.projectContactUserPhone;
                    self.createProject.projectSituation = val.projectSituation;
                    self.createProject.projectYears = val.projectYears;
                }
            }

        },
        'type':{
            immediate: true,
            handler: function (val) {
                var self = this;
                if(val=='new'){
                    self.clearFormData();
                }
            }
        }
    },
}

