# gantt-ying

## 说明
gantt-ying是款基于vue框架的甘特图组件
其亮点在于 支持最小显示时间单位可以到秒级别(功能尚未完全开发完)，目前建议只是做展示用，不要使用交互功能，虽然还没给交互功能家开关，我会尽快加上，用来显示的属性支持自定义
* 更新
```
 1. 拖拽修改时间 完善
```
## 使用说明
* 安装
```
npm install gantt-ying -S
```
* 引入
```$xslt
    // 在main.js中
   import ganttYing from 'gantt-ying';
   // 引入样式文件
   import 'gantt-ying/lib/GanttYing.css;
   // 注册为全局组件
   Vue.use(ganttYing);
```
 属性说明
* draggable

```js
draggable: true || false, 是否允许拖拽修改时间
menu: [{}]
```
* 默认配置说明[config]

```js
{
    theme: 'light' // 主题 light || dark 默认为light
    
}
```

* 默认数据格式
```
[
    {
        "id": "0",
        "text": "任务一",
        "start": "2019/12/19 21:00:00",
        "stop": "2019/12/19 21:10:00",
        "children": [
            {
                "id": "1-1",
                "text": "任务1-1",
                "start": "2019/12/19 21:00:00",
                "stop": "2019/12/19 21:05:00",
                "children": [
                    {
                        "id": "2-1",
                        "text": "任务2-1",
                        "start": "2019/12/19 21:00:00",
                        "stop": "2019/12/19 21:05:00",
                    },
                    {
                        "id": "2-2",
                        "text": "任务2-2",
                        "start": "2019/12/19 21:05:00",
                        "stop": "2019/12/19 21:10:00",
                        "children": [
                            {
                                "id": "3-1",
                                "text": "任务3-1",
                                "start": "2019/12/19 21:00:00",
                                "stop": "2019/12/19 21:05:00"
                            }
                        ]
                    },
                ]
            },
            {
                "id": "1-2",
                "text": "任务1-2",
                "start": "2019/12/19 21:05:00",
                "stop": "2019/12/19 21:10:00"
            },
        ]
    },
    {
        "id": "1",
        "text": "任务2",
        "start": "2019/12/19 21:10:00",
        "stop": "2019/12/19 21:20:00"
    }
]
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
