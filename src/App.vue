<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 500px;
  width: 1000px;
}
</style>
<template>
  <div id="app">
    <Gantt :data='ganttData' />
  </div>
</template>

<script>
import Gantt from './components/gantt.vue'
// import moduleName from './components/';
export default {
  name: 'app',
  data () {
    return {
      ganttData: [
        {
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          text: '任务二',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          text: '任务三',
          start: '2019/12/19 22:50:00',
          stop: '2019/12/19 23:00:00'
        },
        {
          text: '任务四',
          start: '2019/12/19 22:50:00',
          stop: '2019/12/19 23:00:00'
        },
        // {
        //   text: '任务四',
        //   start: '2019/12/18 22:50:00',
        //   stop: '2019/12/19 23:00:00'
        // },
      ]
    };
  },
  components: {
    Gantt
  }
}
</script>
