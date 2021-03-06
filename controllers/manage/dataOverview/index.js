/**
 * @author yanglei
 * @date 20160329
 * @fileoverview 数据概览
 */

var api = require("../../../base/api"),
    util = require("../../../utils"),
    orm = require("orm"),
    help = require("../../../base/help"),
    config = require("../../../utils/config.json"),
    dataOverview = require("../../../filters/dataOverview");

module.exports = (Router) => {
    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllOne",
        modelName: ['OverviewPlatf', "KpiValue"],
        date_picker : false,
        platform : false,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/dataOverviewApp/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                region : "ALL",
                day_type : 1,
                type : "app"
            }
        },
        orderParams() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000)),
                qdate = util.getDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(qdate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                day_type : 1
            }
        },
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllOne(data, "H5");
        },
        rows : [
            ['name', 'open_total', 'open_user_total', 'open_user_avg', 'new_user',
                'new_user_rate', 'new_account', 'register_rate', 'stay_time_avg', 'using_time_avg',
                "pv2", "create"]
        ],
        cols : [
            [{
                caption: ' ',
                type: 'string'
            }, {
                caption: '启动次数',
                type: 'number'
            },  {
                caption: '启动用户',
                type: 'number'
            },  {
                caption: '人均启动次数',
                type: 'string'
            }, {
                caption: '新用户',
                type: 'number'
            }, {
                caption: '新用户占比',
                type: 'string'
            }, {
                caption: '新增账户',
                type: 'number'
            }, {
                caption: '注册转化率',
                type: 'string'
            }, {
                caption: '每人使用时长(s)',
                type: 'string'
            }, {
                caption: '每次使用时长(s)',
                type: 'string'
            }, {
                caption: '累计启动用户数',
                type: 'string'
            }, {
                caption: '累计注册用户数',
                type: 'string'
            }]
        ]
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllTwo",
        modelName: ["OverviewPlatf"],
        platform : false,
        fixedParams : {
            region : "ALL",
            type : "app"
        },
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'open_user_total',
                value: '启动用户'
            }, {
                key: 'open_total',
                value: '启动次数'
            }, {
                key: 'new_user',
                value: '新用户'
            }, {
                key: 'new_account',
                value: '新增账户'
            }, {
                key: 'register_rate',
                value: '注册转化率'
            }, {
                key: 'using_time_avg',
                value: '每次使用时长'
            }]
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllTwo(
                data,
                filter_key,
                {
                    open_user_total : "启动用户",
                    open_total : "启动次数",
                    new_user : "新用户",
                    new_account : "新增账户",
                    register_rate : "注册转化率(%)",
                    using_time_avg : "每次使用时长(s)"
                },
                dates
            );
        }
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllThree",
        modelName: ["OverviewPlatf"],
        paging : true,
        order : [ "-open_total" ],
        sum : ["open_total"],
        platform : false,
        date_picker : false,
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : "app",
                region : orm.not_in(["ALL"]),
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/terminal/provinces">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllThree(data);
        },
        cols : [
            [ {
                caption : "序号",
                type : "number"
            },{
                caption : "地区",
                type : "number"
            },{
                caption : "启动用户数",
                type : "number"
            },{
                caption : "启动次数",
                type : "number"
            },{
                caption : "启动次数占比",
                type : "number"
            }]
        ],
        rows : [
            [ "id", "region", "open_user_total", "open_total", "open_total_rate" ]
        ]
    });

    Router = new api(Router, {
        router: "/dataOverview/dataOverviewAllFour",
        modelName: ["OverviewPage"],
        platform : false,
        date_picker : false,
        paging : true,
        order : ["-pv"],
        sum : ["pv"],
        params() {
            var now = new Date(),
                ydate = util.getDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
            return {
                date : orm.between(new Date(ydate + " 00:00:00"), new Date(ydate + " 23:59:59")),
                type : orm.not_in(["H5"]),
                day_type : 1
            }
        },
        flexible_btn: [{
            content: '<a href="#!/useAnalysis/accessPage" target="_blank">查看全部</a>',
            preMethods: [],
            customMethods: ''
        }],
        filter(data, filter_key, dates) {
            return dataOverview.dataOverviewAllFour(data);
        },
        cols : [
            [ {
                caption : "序号",
                type : "number"
            },{
                caption : "访问页面",
                type : "number"
            },{
                caption : "访问页面备注名称",
                type : "number"
            },{
                caption : "访问次数",
                type : "number"
            },{
                caption : "访问次数占比",
                type : "number"
            } ]
        ],
        rows : [
            [ "id", "page_url", "page_describe", "pv", "pv_rate" ]
        ]
    });

    Router = new help(Router, {
        router : "/dataOverviewApp/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "启动次数",
                help : "开启app的次数"
            },
            {
                name : "启动用户",
                help : "开启app的人数"
            },
            {
                name : "人均启动次数",
                help : "启动次数/启动人数"
            },
            {
                name : "新用户",
                help : "新增激活用户"
            },
            {
                name : "新用户占比",
                help : "新用户/启动用户"
            },
            {
                name : "新增账户",
                help : "新注册用户数"
            },
            {
                name : "注册转化率",
                help : "新增账户/新用户"
            },
            {
                name : "每人使用时长",
                help : "总时长/启动用户数"
            },
            {
                name : "每次使用时长",
                help : "总时长/启动次数"
            },
            {
                name : "访问次数占比",
                help : "页面访问次数/总访问次数"
            }
        ]
    });

    return Router;
};