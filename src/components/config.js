/*
 * @Author: your name
 * @Date: 2019-12-25 22:27:12
 * @LastEditTime: 2020-03-05 22:27:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gantt-ying\src\components\config.js
 */
export default {
    theme: 'dark',
    // theme: 'light',
    menu: [{text: '任务名称', prop: 'text'}], // 左侧菜单栏配置
    field: {
        start: 'start', // 开始时间
        stop: 'stop', // 结束时间
        children: 'children' // 存放子集的属性名称
    },
    showChildren: true, // 是否展示子集
    expandAll: false, // 默认是否展开所有
    minRangeNumber: 10,
    width: 200,
    headerHeight: 30,
    height: 21,
    space: 6,
    range: 600000,
    backgroundColor: '#999',
    timeLine: {
        model: null, // 时间轴的显示模式 cumulative 累加模式 默认是正常日期格式
        format: 'YYYY-MM-DD HH:mm:ss'
    },
    scales: {
        unit: 'days',
        step: 1
    },
    timeline: {
        show: false
    },
    taskStyle: {
        cursor: 'default'
    },
    childIsShow: true,
    rangeField: {
        text: 'text'
    },
    detailOption: {
        show: false,
        field: ['id', 'text', 'start', 'stop'],
    }
};
