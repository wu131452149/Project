/**
 * 这个文件主要是准备阶段
 *  created by LilyLee on 2019/9/19.
 **/
import AppropriateMoney from "../../../components/project/step4/AppropriateMoney";
import BudgetChange from "../../../components/project/step5/BudgetChange";
import ProjectProgressAndTriInfo from "../../../components/project/step6/ProjectProgressAndTriInfo";
import EventBus from "../../lib/event/EventBus";


export default {
    name: "ConstructionPeriodView",
    components: {
        "appropriate-money": AppropriateMoney,
        "budget-change": BudgetChange,
        "progress-tri": ProjectProgressAndTriInfo
    },
    data() {
        return {
            activeName: 'appropriate-money',
            curComponents: {
                "appropriate-money": "appropriate-money",
                "budget-change": "",
                "progress-tri": ""
            },
            table: false,
            dialog: false,
            loading: false,
            formLabelWidth: '80px',
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            user: {},
            ifNewPro: {},
            showStepFourRed: false,
            showStepFiveRed: false,
            showStepSixRed: false,
        };
    },
    activated: function () {
        var self = this;
        if (self.user.grade == 2) {
            self.queryIfNewProject();
        }
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        if (self.user.grade == 2) {
            self.queryIfNewProject();
        }
        EventBus.$on("hideFourBadge", function () {
            self.showStepFourRed = false;
        });
        EventBus.$on("hideFiveBadge", function () {
            self.showStepFiveRed = false;
        });
        EventBus.$on("hideSixBadge", function () {
            self.showStepSixRed = false;
        });
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
                        if (self.ifNewPro.stepFour > 0) {
                            self.showStepFourRed = true;
                        } else {
                            self.showStepFourRed = false;
                        }
                        if (self.ifNewPro.stepFive > 0) {
                            self.showStepFiveRed = true;
                        } else {
                            self.showStepFiveRed = false;
                        }
                        if (self.ifNewPro.stepSix > 0) {
                            self.showStepSixRed = true;
                        } else {
                            self.showStepSixRed = false;
                        }
                        if (self.showStepFourRed || self.showStepFiveRed || self.showStepSixRed) {
                            EventBus.$emit('showConstructionBadge');
                        } else {
                            EventBus.$emit('hideConstructionBadge');
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
    },
    watch: {
        "showStepFourRed": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (self.showStepFourRed || self.showStepFiveRed || self.showStepSixRed) {
                    EventBus.$emit('showConstructionBadge');
                } else {
                    EventBus.$emit('hideConstructionBadge');
                }
            }

        },
        "showStepFiveRed": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (self.showStepFourRed || self.showStepFiveRed || self.showStepSixRed) {
                    EventBus.$emit('showConstructionBadge');
                } else {
                    EventBus.$emit('hideConstructionBadge');
                }
            }

        },
        "showStepSixRed": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (self.showStepFourRed || self.showStepFiveRed || self.showStepSixRed) {
                    EventBus.$emit('showConstructionBadge');
                } else {
                    EventBus.$emit('hideConstructionBadge');
                }
            }

        }
    },
}
