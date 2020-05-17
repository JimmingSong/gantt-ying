<style lang="less">
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
        height: 300px;
        width: 800px;
    }
</style>
<template>
    <div id="app" style="display: flex">
        <!-- <div style="width: 300px; height: 300px">zhesh</div> -->
        <!--<Gantt ref="gantt" :data="ganttData" :userConfig="config" />-->
        <GanttYing :data="ganttData" :user-config="config"/>
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                config: {
                    range: 1000 * 60 * 10
                },
                ganttData: [
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
                                            },
                                            {
                                                "id": "3-2",
                                                "text": "任务3-2",
                                                "start": "2019/12/19 21:05:00",
                                                "stop": "2019/12/19 21:10:00"
                                            },
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
                        "stop": "2019/12/19 21:20:00",
                        "children": [
                            {
                                "id": "1-1",
                                "text": "任务1-1",
                                "start": "2019/12/19 21:00:00",
                                "stop": "2019/12/19 21:05:00"
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
                        "id": "2",
                        "text": "任务3",
                        "start": "2019/12/19 21:20:00",
                        "stop": "2019/12/19 21:30:00"
                    },
                    {
                        "id": "3",
                        "text": "任务4",
                        "start": "2019/12/19 21:30:00",
                        "stop": "2019/12/19 21:40:00"
                    },
                    {
                        "id": "4",
                        "text": "任务5",
                        "start": "2019/12/19 21:40:00",
                        "stop": "2019/12/19 21:50:00"
                    },
                    {
                        "id": "5",
                        "text": "任务6",
                        "start": "2019/12/19 21:50:00",
                        "stop": "2019/12/19 22:00:00"
                    },
                    {
                        "id": "6",
                        "text": "任务7",
                        "start": "2019/12/19 22:10:00",
                        "stop": "2019/12/19 22:20:00"
                    },
                    {
                        "id": "7",
                        "text": "任务8",
                        "start": "2019/12/19 22:20:00",
                        "stop": "2019/12/19 22:30:00"
                    },
                    {
                        "id": "8",
                        "text": "任务9",
                        "start": "2019/12/19 22:30:00",
                        "stop": "2019/12/19 22:40:00"
                    },
                    {
                        "id": "9",
                        "text": "任务10",
                        "start": "2019/12/19 22:40:00",
                        "stop": "2019/12/19 22:50:00"
                    },
                    {
                        "id": "10",
                        "text": "任务11",
                        "start": "2019/12/19 22:50:00",
                        "stop": "2019/12/19 23:00:00"
                    },
                    {
                        "id": "11",
                        "text": "任务12",
                        "start": "2019/12/19 23:00:00",
                        "stop": "2019/12/19 23:10:00"
                    }
                ]
            };
        },
    }
</script>
