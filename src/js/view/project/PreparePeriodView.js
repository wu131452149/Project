/**
 * 这个文件主要是准备阶段
 *  created by LilyLee on 2019/9/19.
 **/
import BudgetApproval from "../../../components/project/step2/BudgetApproval";
import BudgetYearsPlan from "../../../components/project/step3/BudgetYearsPlan";
import ProjectNew from "../../../components/project/ProjectNew";
import ShowProjectDetail from "../../../components/project/ShowProjectDetail";

export default {
    name: "PreparePeriodView",
    components: {
        "budget-approval": BudgetApproval,
        "budget-year-plan":BudgetYearsPlan,
        "show-project-Detail":ShowProjectDetail
    },
    data() {
        return {
            activeName: 'budget-approval',
            curComponents:{
                "budget-approval": "budget-approval",
                "budget-year-plan":"",
            },
            table: false,
            dialog: false,
            loading: false,
            createProject: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '80px',
            projectDetail:{},
            showBudgetPlan:true,
            showBudgetPlanWithYear:false
        };
    },
    mounted: function () {
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
        showBudgetPlanTab:function () {
            var self = this;
            self.showBudgetPlanWithYear = false;
            self.showBudgetPlan = true;
        },
        showBudgetPlanWithYearTab:function () {
            var self = this;
            self.showBudgetPlanWithYear = true;
            self.showBudgetPlan = false;
        },
        showDefaultQuickQuery: function () {

        },
        handleSelectionChange: function () {

        }
    }
}
