/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/22.
 **/
import Utils from "../../lib/Utils/Utils";

export default {
    /**
     * @author shuaijg
     * @method 获取坐席名称
     * @param id,坐席id
     */
    renderMoneyFrom: function (data) {
        let moneyFrom = data.replace("{", "").replace("}", "").replace(/\"/g, "");
        if (!data) return "";
        return moneyFrom;
    },
    //所属行业
    renderIndustry: function (data) {
        let industry = data.replace("{", "").replace("}", "").replace(/\"/g, "");
        return industry;
    },
    //所属行业
    renderBeginTime: function (data) {
        let time = "";
        if (data) {
            time = data.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').substring(0, 10);
        }
        return time;
    },
    renderTime: function (data) {
        let time = "";
        if (data) {
            time = data.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        }
        return time;
    },
    //所属行业
    renderBoolean: function (data) {
        let time = "";
        if (data) {
            time = "是";
        } else {
            time = "否";
        }
        return time;
    },
    //县级年度安排明细
    renderPlanYearsMoneyList: function (data) {
        let list = [];
        if(data){
            list = JSON.parse(data);
        }
        return list;

    },
    //审核状态
    renderStatus: function (data) {
        let status = "";
        switch (data) {
            case 1:
                status = "审核通过";
                break;
            case 2:
                status = "待审核";
                break;
            case 0:
                status = "未通过审核";
                break;
            default:
                status = "未知类型";
        }

        return status;
    },
    renderProjectYears: function (data) {
        let status = "";
        switch (data) {
            case 1:
                status = "1年";
                break;
            case 2:
                status = "2年";
                break;
            case 0:
                status = "3年";
                break;
            default:
                status = "未知";
        }

        return status;
    },
    //审核步骤
    renderStep: function (data) {
        let industry = data.replace("{", "").replace("}", "").replace(/\"/g, "");
        return industry;
    },
    renderPlanYearsSelfMoney: function (data) {
        if (data) {
            let obj = JSON.parse(data);
            let money = "";
            for (var i in obj) {
                if (obj[i]) {
                    var string = "";
                    string = obj[i].years + "，自筹安排" + Number(obj[i].money) + "万元，";
                    money = money + string;
                }
            }
            return money;
        } else {
            return "";
        }
    },
    renderPlanYearsTopMoney: function (data) {
        if (data) {
            let obj = JSON.parse(data);
            let money = "";
            for (var i in obj) {
                if (obj[i]) {
                    var string = "";
                    string = obj[i].years + ", 上级累计安排" + Number(obj[i].money) + "万元，";
                    money = money + string;
                }
            }
            return money;
        } else {
            return "";
        }
    },
    renderPlanYearsMoney: function (data) {
        let dataA = JSON.parse(data);
        var list = _.cloneDeep(dataA);
        var obj = Utils.mergeArr(list);
       return obj;
    },
    //累计以前年度安排
    renderBeforeYearPlanTotalMoney: function (data) {
        let money = "";
        var thisYears = new Date().getFullYear();
        //var thisYears = 2020;
        if (data) {
            money = JSON.parse(data);
            var list = money.filter(function (item) {
                return item.years < thisYears;
            });
            var totalMoney = 0;
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    totalMoney = totalMoney + Number(list[i].money);
                }
                return totalMoney;
            } else {
                return "";
            }
        } else {
            return money;
        }

    },
    //当年安排
    renderThisYearPlanTotalMoney: function (data) {
        let money = "";
        var thisYears = new Date().getFullYear();
        if (data) {
            money = JSON.parse(data);
            var index = _.findIndex(money, function (o) {
                return o.years == thisYears;
            });
            if (index > -1) {
                return money[index].money;
            } else {
                return "";
            }

        } else {
            return money;
        }
    },
    //次年安排
    renderNextYearsPlanTotalMoney: function (data) {
        let money = "";
        var nextYears = new Date().getFullYear() + 1;
        if (data) {
            money = JSON.parse(data);
            var index = _.findIndex(money, function (o) {
                return o.years == nextYears;
            });
            if (index > -1) {
                return money[index].money;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
    //第三年安排
    renderThirdYearsPlanTotalMoney: function (data) {
        let money = "";
        var nextYearsA = new Date().getFullYear() + 2;
        if (data) {
            money = JSON.parse(data);
            var index = _.findIndex(money, function (o) {
                return o.years == nextYearsA;
            });
            if (index > -1) {
                return money[index].money;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
    //累计合计安排
    renderPlanTotalMoney: function (data) {
        let money = "";
        //var thisYears = 2020;
        if (data) {
            money = JSON.parse(data);
            var totalMoney = 0;
            if (money.length > 0) {
                for (var i = 0; i < money.length; i++) {
                    totalMoney = totalMoney + Number(money[i].money);
                }
                return totalMoney;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
    //欠付金额
    renderNonPaymentTotalMoney: function (data) {
        let money = "";
        //var thisYears = 2020;
        console.log("qianfu", data);
        if (data) {
            money = JSON.parse(data);
            var totalMoney = 0;
            if (money.length > 0) {
                for (var i = 0; i < money.length; i++) {
                    totalMoney = totalMoney + Number(money[i].money);
                }
                return totalMoney;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
    //累计拨付
    renderAppTotalMoney: function (data) {
        let money = "";
        //var thisYears = 2020;
        if (data) {
            money = JSON.parse(data);
            var totalMoney = 0;
            if (money.length > 0) {
                for (var i = 0; i < money.length; i++) {
                    totalMoney = totalMoney + Number(money[i].money);
                }
                return totalMoney;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
    //当年拨付
    renderAppThisYearMoney: function (data) {
        let money = "";
        var thisYears = new Date().getFullYear();
        //var thisYears = 2020;
        if (data) {
            money = JSON.parse(data);
            var index = _.findIndex(money, function (o) {
                return o.years == thisYears;
            });
            if (index > -1) {
                return money[index].money;
            } else {
                return "";
            }
        } else {
            return money;
        }
    },
}
