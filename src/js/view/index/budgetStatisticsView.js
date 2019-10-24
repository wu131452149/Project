/**
 * 这个文件主要是金额统计及
 *  created by LilyLee on 2019/10/25.
 **/
import Filters from "../common/Filters";
import Utils from "../../lib/Utils/Utils";


export default {
    name: "budgetStatisticsView",
    data() {
        return {
            checkList:[],
            projectDetail: {},
            user: {},
            allBudgetReviewMoney:{},
            allAppropriateMoneyList:[],//拨付
            allBudgetPlanMoneyList:[],//安排
        }
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.queryData();
        // self.queryAllAppropriateMoneyList();//查询拨付金额
        // self.queryAllBudgetPlanMoneyList();//查询年度安排金额

    },
    methods: {
        queryData:function(){
            var self = this;
            self.queryAllAppropriateMoneyList();
            self.queryAllBudgetPlanMoneyList();
        },
        //查询拨付金额
        queryAllAppropriateMoneyList: function () {
            let self = this;
            let data = {};
            for(var i=0;i<self.checkList.length;i++){
                if(self.checkList[i]=="主管部门"){
                    data.userName = self.checkList[i];
                }else if(self.checkList[i]=="类型"){
                    data.type = self.checkList[i];
                }else if(self.checkList[i]=="年份"){
                    data.years = self.checkList[i];
                }else if(self.checkList[i]=="项目单位"){
                    data.role = self.checkList[i];
                }
            }
            self.$http.post('/api/project/queryAllAppropriateMoneyList', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allAppropriateMoneyList = res.data.recordset;
                    } else {
                        self.$message({
                            message: "查询失败",
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
        },
        //查询年度安排金额
        queryAllBudgetPlanMoneyList: function () {
            let self = this;
            let data = {};
            for(var i=0;i<self.checkList.length;i++){
                if(self.checkList[i]=="主管部门"){
                    data.userName = self.checkList[i];
                }else if(self.checkList[i]=="类型"){
                    data.type = self.checkList[i];
                }else if(self.checkList[i]=="年份"){
                    data.years = self.checkList[i];
                }else if(self.checkList[i]=="项目单位"){
                    data.role = self.checkList[i];
                }
            }
            self.$http.post('/api/project/queryAllBudgetPlanMoneyList', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allBudgetPlanMoneyList = res.data.recordset;
                    } else {
                        self.$message({
                            message: "查询失败",
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
        },

    },
    filters: {

    }
}


