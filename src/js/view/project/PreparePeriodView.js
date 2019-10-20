/**
 * 这个文件主要是准备阶段
 *  created by LilyLee on 2019/9/19.
 **/
import BudgetApproval from "../../../components/project/step2/BudgetApproval";
import BudgetYearsPlan from "../../../components/project/step3/BudgetYearsPlan";
import ProjectNew from "../../../components/project/ProjectNew";
import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import Vue from "vue";

export default {
    name: "PreparePeriodView",
    components: {
        "budget-approval": BudgetApproval,
        "budget-year-plan": BudgetYearsPlan,
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            activeName: 'budget-approval',
            curComponents: {
                "budget-approval": "budget-approval",
                "budget-year-plan": "",
            },
            formLabelWidth: '80px',
            user: {},
            ifNewPro:{},
            showStepTwoRed:false,
            showStepThreeRed:false,
        };
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        if(self.user.grade==2){
            self.queryIfNewProject();
        }
    },
    methods: {
        queryIfNewProject: function () {
            let self = this;
            var data = {};
            data.role = self.user.role;
            self.$http.post('/api/project/queryIfNewProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.ifNewPro = res.data.recordset[0];
                        if(self.ifNewPro.stepTwo >0){
                            self.showStepTwoRed = true;
                        }
                        if(self.ifNewPro.stepThree >0){
                            self.showStepThreeRed = true;
                        }
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

        /**
         * 动态加载菜单方法，只会加载一次
         * @param tab，event
         * @author 李莉红
         */
        showTabPage(tab, event) {
            var self = this;
            self.curComponents[tab.name] = tab.name;
        },
    }
}
