/**
 * 这个文件主要是
 *  created by LilyLee on 2019/9/22.
 **/
export default {
    /**
     * @author shuaijg
     * @method 获取坐席名称
     * @param id,坐席id
     */
    renderMoneyFrom: function (data) {
        let moneyFrom = data.replace("{","").replace("}","").replace(/\"/g,"");
        if (!data) return "";
        return moneyFrom;
    },
    //所属行业
    renderIndustry: function (data) {
        let industry =  data.replace("{","").replace("}","").replace(/\"/g,"");
        return industry;
    },
    //所属行业
    renderBeginTime: function (data) {
        let time = "";
        if(data){
           time =  data.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').substring(0,10);
        }
        return time;
    },
    //所属行业
    renderBoolean: function (data) {
        let time = "";
        if(data){
            time =  "是";
        }else{
            time =  "否";
        }
        return time;
    },
    //审核状态
    renderStatus: function (data) {
        let status =  "";
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
    renderProjectYears:function(data){
        let status =  "";
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
        let industry =  data.replace("{","").replace("}","").replace(/\"/g,"");
        return industry;
    },
    renderPlanYearsSelfMoney: function (data) {
        if(data){
            let obj =  JSON.parse(data);
            let money ="";
            for(var i in obj){
                if(obj[i]){
                    var string = "";
                    string = obj[i].years+"，自筹安排"+parseInt(obj[i].money)+"万元，";
                    money = money + string;
                }
            }
            return money;
        }else{
            return "";
        }
    },
    renderPlanYearsTopMoney: function (data) {
        if(data){
            let obj =  JSON.parse(data);
            let money ="";
            for(var i in obj){
                if(obj[i]){
                    var string = "";
                    string = obj[i].years+", 上级累计安排"+parseInt(obj[i].money)+"万元，";
                    money = money + string;
                }
            }
            return money;
        }else{
            return "";
        }
    },
    renderPlanYearsMoney: function (data) {
        if(data){
            let obj =  JSON.parse(data);
            let money ="";
            for(var i in obj){
                if(obj[i]){
                    var string = "";
                    string = obj[i].years+", 本级累计安排"+parseInt(obj[i].money)+"万元，";
                    money = money + string;
                }
            }
            return money;
        }else{
            return "";
        }
    },
}
