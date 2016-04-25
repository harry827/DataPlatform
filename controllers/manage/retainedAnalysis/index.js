/**
 * @author yanglei
 * @date 20160414
 * @fileoverview 留存分析
 */
var api = require("../../../base/api"),
    filter = require("../../../filters/retainedAnalysis");

module.exports = (Router) => {

    Router = new api(Router,{
        router : "/retainedAnalysis/retainedOne",
        modelName : ["UserKeep"],
        filter(data, filter_key, dates) {
            return filter.retainedOne(data, dates);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ 'date', 'new_user', 't1', 't7', 't14', 't30']
        ],
        cols: [
            [
                {
                    caption : '时间',
                    type : 'string',
                    width : 20
                }, {
                    caption: '新增用户',
                    type: 'number'
                }, {
                    caption: '次日留存率',
                    type: 'string'
                }, {
                    caption: '7日后留存率',
                    type: 'string'
                }, {
                    caption: '14日后留存率',
                    type: 'string'
                }, {
                    caption: '30日后留存率',
                    type: 'string'
                }
            ]
        ]
    });

    return Router;
};