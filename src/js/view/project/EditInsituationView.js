/**
 * 这个文件主要是新建二级单位
 *  created by LilyLee on 2019/9/19.
 **/
import Utils from "../../lib/utils/Utils";
import Filters from "../common/Filters";

export default {
    name: "EditInsituationView",
    data() {
        return {
            table: false,
            dialog: false,
            loading: false,
            newInstitution: "",
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            institution: {
                institutionList: [],
                formData: {
                    institutionName: ""
                },
                count: 0,
                currentPage: 1
            },
            user: {},
            formLabelWidth: '80px'
        };
    },
    activated: function() {
        var self = this;
        self.queryInstitution();
        self.queryInstitutionCount();
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(window.sessionStorage.getItem('user'));
        // self.queryInstitution();
        // self.queryInstitutionCount();
    },
    methods: {
        /*新建单位*/
        createInstitution: function () {
            let self = this;
            var dataParam = {};
            dataParam.name = self.newInstitution;
            dataParam.userName = self.user.role;
            dataParam.grade = self.user.grade;
            dataParam.time = Utils.formatDate(new Date()) + ".000";
            self.$http.post('/api/institution/createInstitution', dataParam).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
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

        }
        ,
        /**
         * @version 2.0
         * @author wenxy
         * @method 取消快捷查询选中状态
         */
        changeQuickQuery: function (data) {
            var self = this;
            // if (self.allHistory.cloneFormData[data] && self.allHistory.cloneFormData[data] != self.allHistory.formData[data]) {
            //     self.quickQueryData.curTagName = "";
            // }
        },
        //查询单位
        queryInstitution: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.institution.formData);
            data.page = flag ? 1 : self.institution.currentPage;
            data.name = data.institutionName;
            if (self.user.grade == 1) {//只有1要查自己建的
                data.userName = self.user.role;
            }
            self.$http.post('/api/institution/queryInstitution', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.institution.institutionList = res.data.recordset;
                        self.institution.currentPage = data.page;
                        if (flag) {
                            self.queryInstitutionCount(data);
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


        }
        ,
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.institution.formData.institutionName = "";
            if (flag) {
                self.queryInstitution(true);
            }
        },
        stopPropagationPreventDef: function () {

        }
        ,
        handleSelectionChange: function () {

        }
        ,
        queryInstitutionCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.institution.currentPage;
            data.name = data.institutionName;
            if (self.user.grade == 1) {//只有1要查自己建的
                data.userName = self.user.role;
            }
            self.$http.post('/api/institution/queryInstitutionCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.institution.count = res.data.recordset[0].num;
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

        }
    },
    filters: {
        renderTime: Filters.renderTime,
    }
}
