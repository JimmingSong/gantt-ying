<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 500px;
  width: 800px;
}
</style>
<template>
  <div id="app">
    <Gantt :data='ganttData' :userConfig='config' />
  </div>
</template>

<script>
import Gantt from './components/gantt.vue'
// import moduleName from './components/';
export default {
  name: 'app',
  data () {
    return {
      config: {
        range: 1000 * 60 * 10
      },
      ganttData: [
        {
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
      ]
    };
  },
  components: {
    Gantt
  }
}
</script>
