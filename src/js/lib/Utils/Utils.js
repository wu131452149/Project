export default {
    /**
     * @version 1.0
     * @author shuaijg
     * @method 清空对象中的数据(可以是数组或字符串)
     * @param data 数据对象
     */
    wipeObjectData(data) {
        data = data || {};
        if (!data) return;
        for (let item in data) {
            if (data[item] instanceof Array) {
                data[item] = [];
            } else if (typeof data[item] === "string") {
                data[item] = "";
            }
        }
        return data;
    },
    formatDate: function (dateTime, isTimestamp) {
        var dateFormat = "";
        if (isTimestamp) {
            dateFormat = Math.round(dateTime.getTime() / 1000);
        } else {
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth();
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minites = dateTime.getMinutes();
            var second = dateTime.getSeconds();
            month = month + 1 > 9 ? month + 1 : '0' + (month + 1);
            day = day > 9 ? day : '0' + day;
            hour = hour > 9 ? hour : '0' + hour;
            minites = minites > 9 ? minites : '0' + minites;
            second = second > 9 ? second : '0' + second;
            dateFormat = year + "-" + month + "-" + day + " " + hour + ":" + minites + ":" + second;
        }
        return dateFormat;
    },
    format: function (dateTime, isTimestamp) {
        var dateFormat = "";
        if (isTimestamp) {
            dateFormat = Math.round(dateTime.getTime() / 1000);
        } else {
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth();
            var day = dateTime.getDate();
            month = month + 1 > 9 ? month + 1 : '0' + (month + 1);
            day = day > 9 ? day : '0' + day;
            dateFormat = year + "-" + month + "-" + day;
        }
        return dateFormat;
    },
    getYearsPlanType: function () {
        var data = [{
            name: "县级预算安排",
            value: "县级预算安排",
        }, {
            name: "上级专款",
            value: "上级专款",
        },
            {
                name: "自筹金额",
                value: "自筹金额",
            }];
        return data
    },
    getOptionYears: function () {
        var data = [{
            name: "县级预算安排",
            value: "县级预算安排",
        }, {
            name: "上级专款",
            value: "上级专款",
        }];
        return data
    },
    getIndustryData: function () {
        var data = [
            //----------------能源
            {
                "code": 1,
                "value": '能源',
                "name": '能源',
                "childrens": [
                    {"value": '风电', "name": '风电'}, {"value": '水电', "name": '水电'}, {"value": '光电', "name": '光电'}, {
                        "value": '垃圾发电',
                        "name": '垃圾发电'
                    },
                    {"value": '煤电', "name": '煤电'}, {"value": '生物质能', "name": '生物质能'}, {
                        "value": '充电桩',
                        "name": '充电桩'
                    }, {"value": '能源储备', "name": '能源储备'},
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------交通运输
            {
                "code": 2,
                "value": '交通运输',
                "name": '交通运输',
                "childrens": [
                    {"value": '高速公路', "name": '高速公路'}, {"value": '一级公路', "name": '一级公路'}, {
                        "value": '二级公路',
                        "name": '二级公路'
                    }, {"value": '交通枢纽', "name": '交通枢纽'},
                    {"value": '桥梁', "name": '桥梁'}, {"value": '铁路（不含轨道交通）', "name": '铁路（不含轨道交通）'}, {
                        "value": '港口码头',
                        "name": '港口码头'
                    }, {"value": '航道航运', "name": '航道航运'},
                    {"value": '机场', "name": '机场'}, {"value": '隧道', "name": '隧道'}, {
                        "value": '仓储物流',
                        "name": '仓储物流'
                    }, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------水利建设
            {
                "code": 3,
                "value": '水利建设',
                "name": '水利建设',
                "childrens": [
                    {"value": '水库', "name": '水库'}, {"value": '防洪', "name": '防洪'}, {"value": '灌溉', "name": '灌溉'}, {
                        "value": '引水',
                        "name": '引水'
                    },
                    {"value": '水利枢纽', "name": '水利枢纽'}, {"value": '其他', "name": '其他'},
                ],
            },
            //-------------------生态建设和环境保护
            {
                "code": 4,
                "value": '生态建设和环境保护',
                "name": '生态建设和环境保护',
                "childrens": [
                    {"value": '综合治理', "name": '综合治理'}, {"value": '湿地保护', "name": '湿地保护'}, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------农业
            {
                "code": 5,
                "value": '农业',
                "name": '农业',
                "childrens": [
                    {"value": '粮油物资储备', "name": '粮油物资储备'}, {"value": '农产品交易中心', "name": '农产品交易中心'}, {
                        "value": '其他',
                        "name": '其他'
                    }

                ],
            },
            //-------------------林业
            {
                "code": 6,
                "value": '林业',
                "name": '林业',
                "childrens": [
                    {"value": '其他', "name": '其他'}

                ],
            },
            //-------------------科技
            {
                "code": 7,
                "value": '科技',
                "name": '科技',
                "childrens": [
                    {"value": '智慧城市', "name": '智慧城市'}, {"value": '信息网络建设', "name": '信息网络建设'}, {
                        "value": '其他',
                        "name": '其他'
                    }
                ],
            },
            //-------------------保障性安居工程
            {
                "code": 8,
                "value": '保障性安居工程',
                "name": '保障性安居工程',
                "childrens": [
                    {"value": '保障性住房', "name": '保障性住房'}, {"value": '棚户区改造', "name": '棚户区改造'}, {
                        "value": '农村危房改造',
                        "name": '农村危房改造'
                    }, {"value": '游牧民安居工程', "name": '游牧民安居工程'},
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------医疗卫生
            {
                "code": 9,
                "value": '医疗卫生',
                "name": '医疗卫生',
                "childrens": [
                    {"value": '医院', "name": '医院'}, {"value": '社区卫生机构', "name": '社区卫生机构'}, {
                        "value": '公共卫生机构',
                        "name": '公共卫生机构'
                    }, {"value": '乡镇卫生所', "name": '乡镇卫生所'},
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------养老
            {
                "code": 10,
                "value": '养老',
                "name": '养老',
                "childrens": [
                    {"value": '养老业', "name": '养老业'}, {"value": '老年公寓', "name": '老年公寓'}, {
                        "value": '医养结合',
                        "name": '医养结合'
                    }, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------教育
            {
                "code": 11,
                "value": '教育',
                "name": '教育',
                "childrens": [
                    {"value": '学前教育', "name": '学前教育'}, {"value": '义务教育', "name": '义务教育'}, {
                        "value": '普通高中',
                        "name": '普通高中'
                    },
                    {"value": '普通高校', "name": '普通高校'}, {"value": '职业教育', "name": '职业教育'}, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------文化
            {
                "code": 12,
                "value": '文化',
                "name": '文化',
                "childrens": [
                    {"value": '文化场馆', "name": '文化场馆'}, {"value": '文物保护', "name": '文物保护'}, {
                        "value": '古城保护',
                        "name": '古城保护'
                    }, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------体育
            {
                "code": 13,
                "value": '体育',
                "name": '体育',
                "childrens": [
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------市政工程
            {
                "code": 14,
                "value": '市政工程',
                "name": '市政工程',
                "childrens": [
                    {"value": '公交', "name": '公交'}, {"value": '供水', "name": '供水'}, {"value": '排水', "name": '排水'}, {
                        "value": '供气',
                        "name": '供气'
                    },
                    {"value": '供热', "name": '供热'}, {"value": '供冷', "name": '供冷'}, {"value": '供电', "name": '供电'}, {
                        "value": '公园',
                        "name": '公园'
                    },
                    {"value": '广场', "name": '广场'}, {"value": '停车场', "name": '停车场'}, {
                        "value": '景观绿化',
                        "name": '景观绿化'
                    }, {"value": '管网', "name": '管网'},
                    {"value": '垃圾处理', "name": '垃圾处理'}, {"value": '海绵城市', "name": '海绵城市'}, {
                        "value": '市政道路',
                        "name": '市政道路'
                    }, {"value": '轨道交通', "name": '轨道交通'},
                    {"value": '污水处理', "name": '污水处理'}, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------政府基础设施
            {
                "code": 15,
                "value": '政府基础设施',
                "name": '政府基础设施',
                "childrens": [
                    {"value": '党政办公场所建设', "name": '党政办公场所建设'}, {"value": '公共安全部门场所建设', "name": '公共安全部门场所建设'}, {
                        "value": '培训中心',
                        "name": '培训中心'
                    }, {"value": '其他', "name": '其他'},
                ],
            },
            //-------------------城市综合开发
            {
                "code": 16,
                "value": '城市综合开发',
                "name": '城市综合开发',
                "childrens": [
                    {"value": '园区开发', "name": '园区开发'}, {"value": '城镇化建设', "name": '城镇化建设'}, {
                        "value": '土地储备',
                        "name": '土地储备'
                    }, {"value": '厂房建设', "name": '厂房建设'},
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------旅游
            {
                "code": 17,
                "value": '旅游',
                "name": '旅游',
                "childrens": [
                    {"value": '生态旅游', "name": '生态旅游'}, {"value": '文化旅游', "name": '文化旅游'}, {
                        "value": '农业旅游',
                        "name": '农业旅游'
                    }, {"value": '观光旅游', "name": '观光旅游'},
                    {"value": '旅游配套设施', "name": '旅游配套设施'}, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------社会保障
            {
                "code": 18,
                "value": '社会保障',
                "name": '社会保障',
                "childrens": [
                    {"value": '就业服务机构', "name": '就业服务机构'}, {"value": '社会福利机构', "name": '社会福利机构'}, {
                        "value": '残疾人事业服务机构',
                        "name": '残疾人事业服务机构'
                    }, {"value": '社会救助机构', "name": '社会救助机构'},
                    {"value": '殡葬', "name": '殡葬'}, {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------其他
            {
                "code": 19,
                "value": '其他',
                "name": '其他',
                "childrens": [
                    {"value": '其他', "name": '其他'}
                ],
            },
            //-------------------end--------------------
        ]
        return data;

    },
    getMoneyFrom: function () {
        var data = [{
            value: '财政资金（上级)',
            name: '财政资金（上级)'
        },
            {
                value: '财政资金（本级)',
                name: '财政资金（本级)'
            },
            {
                value: '自筹',
                name: '自筹'
            },];
        return data
    },
    getChangeType: function () {
        var data = [{
            value: '增加',
            name: '增加'
        },
            {
                value: '减少',
                name: '减少'
            }];
        return data
    },
    getProjectType: function () {
        var data = [{
            value: '新建',
            name: '新建'
        },
            {
                value: '存量',
                name: '存量'
            },
            {
                value: '存量+新建',
                name: '存量+新建'
            },];
        return data
    },
    getProjectYears: function () {
        var data = [{
            value: 1,
            name: '1年'
        },
            {
                value: 2,
                name: '2年'
            },
            {
                value: 3,
                name: '3年'
            },];
        return data
    },
    downloadUrl: function (data) {
        var frameObj = document.getElementById("download-file-frame-id");
        var url = `${process.env.BASE_API}/table/downloadFile?filename=${data.name}&oldname=${data.oname}`;
        if (frameObj) {
            frameObj.src = url;
            frameObj.onload = function () {
                frameObj.src = "";
            };
        }
    },
    mergeArr: function (arr) {
        var newArr = [];
        arr.forEach(item => {
            var dataItem = item
            if (newArr.length > 0) {
                var filterValue = newArr.filter(v => {
                    return v.years == dataItem.years
                })
                if (filterValue.length > 0) {
                    newArr.forEach(n => {
                        if (n.years == filterValue[0].years) {
                            n.money = parseInt(filterValue[0].money) + parseInt(dataItem.money)
                        }
                    })
                } else {
                    newArr.push(dataItem)
                }
            } else {
                newArr.push(dataItem)
            }

        })
        return newArr
    },
    //计算年度累计安排
    countTotalPlanMoney: function (arr) {
        var self = this;
        var totalMoney = 0;
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                totalMoney = totalMoney + parseInt(arr[i].money);
            }
            return totalMoney;

        }
    },
        //dowloadUtil(`${process.env.BASE_API}/table/downloadFile?filename=${filename}&oldname=${oldname}`);

    }
