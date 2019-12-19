export default {
    menu: [{text: '任务名称', prop: 'text'}],
    field: {
        start: 'start',
        stop: 'stop'
    },
    width: 200,
    height: 30,
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
    childIsShow: false
};
