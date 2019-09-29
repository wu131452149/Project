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
    }
}
