/**
 * 这个文件主要是准备阶段
 *  created by LilyLee on 2019/9/19.
 **/
import AppropriateMoney from "../../../components/project/step4/AppropriateMoney";
import BudgetChange from "../../../components/project/step5/BudgetChange";
import ProjectProgressAndTriInfo from "../../../components/project/step6/ProjectProgressAndTriInfo";


export default {
    name: "ConstructionPeriodView",
    components: {
        "appropriate-money":AppropriateMoney,
        "budget-change":BudgetChange,
        "progress-tri":ProjectProgressAndTriInfo
    },
    data() {
        return {
            activeName: 'appropriate-money',
            curComponents:{
                "appropriate-money": "appropriate-money",
                "budget-change":"",
                "progress-tri":""
            },
            table: false,
            dialog: false,
            loading: false,
            formLabelWidth: '80px',
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            projectDetail:{},
            showFundAppropriation:true,
            showBudgetChange:false,
            showProgressAndTri:false
        };
    },
    mounted: function () {
        //this.queryBudgetPlanProject();
        //this.queryBudgetPlanProjectCount();
    },
    methods: {
        /**
         * 动态加载菜单方法，只会加载一次
         * @param tab，event
         * @author 李莉红
         */
        showTabPage(tab, event) {
            var self = this;
            self.curComponents[tab.name]=tab.name;
        },
        //查询在建项目预算评审
        queryBudgetPlanProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.budgetPlanProject.currentPage;
            data.step = 2;
            data.suggestion = 1;
            self.$http.post('/api/project/queryProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        this.budgetPlanProject.budgetPlanProjectList = res.data.recordset;
                        self.$message({
                            message: "保存成功",
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: "保存失败",
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
        //查询条数
        queryBudgetPlanProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.budgetPlanProject.currentPage;
            data.step = 2;
            data.suggestion = 1;
            self.$http.post('/api/project/queryProjectCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.budgetPlanProject.count = res.data.recordset[0].num;
                        self.$message({
                            message: "查询成功",
                            type: 'success'
                        });
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
    }
}
