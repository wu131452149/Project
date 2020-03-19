/**
 * 这个文件主要是 在建库
 *  created by LilyLee on 2019/9/19.
 **/
import PreparePeriod from "../../../components/project/PreparePeriod";
import ConstructionPeriod from "../../../components/project/ConstructionPeriod";
import EventBus from "../../lib/event/EventBus";


export default {
    name: "ProjectDoingView",
    components: {
        "prepare-period": PreparePeriod,
        "construction-period": ConstructionPeriod,
    },
    data() {
        return {
            activeName: 'prepare-period',
            curComponents: {
                "prepare-period": "prepare-period",
                "construction-period": "",
            },
            IsNewMediaSessionLargeData: '',
            projectDetail: {},
            ifShowPrepareRed: false,
            ifShowConstructionRed: false,
        }
    },
    mounted: function () {
        // 验证码初始化
        var self = this;
        //$('.main-content').height($(window).height() - 200);
        EventBus.$on("showPrepareBadge", function () {
            self.ifShowPrepareRed = true;
        });
        EventBus.$on("hidePrepareBadge", function () {
            self.ifShowPrepareRed = false;
        });
        EventBus.$on("showConstructionBadge", function () {
            self.ifShowConstructionRed = true;
        });
        EventBus.$on("hideConstructionBadge", function () {
            self.ifShowConstructionRed = false;
        });
    },
    methods: {
        /**
         * 动态加载菜单方法，只会加载一次
         * @param tab，event
         * @author 李莉红
         */
        showTabPage(tab, event) {
            var self = this;
            self.curComponents[tab.name] = tab.name;
        },
        //是否显示小红点


    },

}



