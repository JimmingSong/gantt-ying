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
    <Gantt ref="gantt" :data='ganttData' :userConfig='config' />
    <button @click="change">click</button>
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
        range: 1000 * 60
      },
      ganttData: [
        {
          id: '0',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00',
          children: [
            {
              id: '1-1',
              text: '任务一',
              start: '2019/12/19 21:00:00',
              stop: '2019/12/19 21:05:00'
            },
            {
              id: '1-2',
              text: '任务一',
              start: '2019/12/19 21:05:00',
              stop: '2019/12/19 21:10:00'
            },
          ]
        },
        {
          id: '1',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00',
        },
        {
          id: '2',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          id: '3',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          id: '4',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          id: '5',
          text: '任务一',
          start: '2019/12/19 21:00:00',
          stop: '2019/12/19 21:10:00'
        },
        {
          id: '6',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          id: '7',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          id: '8',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          id: '9',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          id: '10',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        },
        {
          id: '11',
          text: '任务一',
          start: '2019/12/19 21:50:00',
          stop: '2019/12/19 22:00:00'
        }
      ]
    };
  },
  methods: {
    change () {
      this.config.range = 1000 * 60 * 60;
      this.$refs.gantt.updateRange(this.config.range);
      console.log(this.config.range);
    }
  },
  components: {
    Gantt
  }
}
</script>
