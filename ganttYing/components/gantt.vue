<style scoped lang='less'>
  @import "./ganttCom";
  @borderColor: #EBEEF5;
  @textColor: #666;
  .gantt-bgc-light {
      background: #fff;
  }
  .gantt-bgc-dark {
      background-color: #222;
  }
  .text-color-light {
      color: #666666;
  }
  .text-color-dark {
      color: #eeeeee;
  }
  .gantt-container {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      .gantt-right {
          flex-grow: 1;
          width: 80%;
      }
  }
  .tool {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      right: 0;
      height: 30px;
      width: 100px;
      z-index: 10;
      background-image: linear-gradient(-90deg, #404040, #404040 70%, rgba(64, 64, 64, 0) 100%);

      &>i {
          margin-right: 5px;
      }
  }
</style>

<template>
        <div :class="['gantt-container', 'text-color-'+ config.theme, 'gantt-bgc-' + config.theme]" ref="gantt">
        <leftCom
            ref="leftBox"
            :menu="menu"
            :data="jsonData"
            :config="config"
            class="gantt-left_container"
            :style="leftStyle"
            :expand-row-keys="expandData.rowKeys"
            @updateExpandRowKeys='updateExpandRowKeys'
            @rowClick="rangeChartShow"
            @rowDoubleClick="showDialog"
            @updateRightStyle="updateRightStyle"
            @leftScrollEvent="leftScrollEvent"
        ></leftCom>
        <rightCom
            ref="rightBox"
            :data="jsonData"
            :config="config"
            :calcData="calcData"
            :current-time="currentTime"
            @dataSubmit="handleSubmit"
            @scrollEvent="scrollEvent"
            :showProgress="showProgress"
            @rangeClick="rangeClick"
            @updateRange="updateRange" />
        <div class="tool">
            <i class="el-icon-zoom-in" @click="handleRange('down')"></i>
            <i class="el-icon-zoom-out" @click="handleRange('up')"></i>
            <slot name="tool"></slot>
        </div>
    </div>
</template>

<script>
import leftCom from './leftCom';
import rightCom from './rightCom';
import defaultConfig from './config';
import moment from 'moment';
export default {
    name: 'GanttYing',
    provide () {
        return {
            calcData: this.calcData,
            getStart: this.getStart,
            getEnd: this.getEnd,
            draggable: this.draggable
        };
    },
    props: {
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        userConfig: {
            type: Object,
            default () {
                return {};
            }
        },
        menu: {
            type: Array,
            default () {
                return [{text: '任务名称', prop: 'text'}];
            }
        },
        currentTime: {
            type: String,
            default: '2019-12-19 21:20:00'
        },
        showProgress: {
            type: Boolean,
            default: false
        },
        customLeftStyle: {
            type: Object
        },
        selectedBgc: {
            type: String
        },
        draggable: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            baseData: {
                data: []
            },
            defaultLeftStyle: {
                width: '15%'
            },
            config: defaultConfig,
            calcData: {
                boxWidth: defaultConfig.minRangeNumber * defaultConfig.width,
                range: defaultConfig.range,
                rangeNum: defaultConfig.minRangeNumber,
                max: 0,
                min: 0
            },
            expandData: {
                rowKeys: [],
                index: null,
                length: 0
            }
        };
    },
    computed: {
        jsonData () {
            return this.baseData.data;
        },
        leftStyle () {
            return {
                ...this.defaultLeftStyle,
                ...this.customLeftStyle
            };
        }
    },
    methods: {
        handleSubmit (data) {
            this.$emit('handleSubmit', data);
        },
        getStart (data) {
            return data[this.config.field.start];
        },
        getEnd (data) {
            return data[this.config.field.stop];
        },
        getChildren (data) {
            return data[this.config.field.children];
        },
        updateCalcDataMax (data) {
            this.calcData.max = data;
        },
        scrollEvent (top) {
            this.$refs.leftBox.scrollEvent(top);
        },
        leftScrollEvent (top) {
            this.$refs.rightBox.scrollEvent(top);
        },
        /** 更新列表
         * @description:
         * @param key {type}
         * @return:
         */
        updateExpandRowKeys (key) {
            this.expandData.rowKeys.includes(key) ? this.expandData.rowKeys.splice(this.expandData.rowKeys.indexOf(key), 1) : this.expandData.rowKeys.push(key);
        },
        /**
         * tree 的双击事件
         */
        showDialog (index) {
            let data = this.baseData.data[index];
            this.$refs.rightBox.rectDoubleClick(data);
        },
        /**
         * tree的单击事件
         */
        rangeChartShow (row) {
            let start = moment(this.getStart(row)).valueOf();
            this.$emit('rangeClick', row);
            this.$refs.rightBox.scrollLeftRight(this.dateShowLeft(start));
        },
        dateShowLeft (millisecond) {
            let dex = (millisecond - this.calcData.min) / this.calcData.range;
            return dex * this.config.width;
        },
        /**
         * range 变化 触发事件
         */
        updateRange (newRange) {
            this.calcData.range = newRange;
            // this.calcData.rangeNum = Math.ceil((this.calcData.max - this.calcData.min) / this.calcData.range);
            // this.calcData.boxWidth = this.calcData.rangeNum * this.config.width;
            // this.calcMaxTime(this.calcData.max);
            // this.dealData(this.baseData.data);
            // 调用计算最大时间与最小时间计算方法 不能全部处理 否则会自动折叠 导致与左边表格的折叠不一致
            this.setMinAndMaxTime(this.baseData.data);
            this.$refs.rightBox.calcCells();
        },
        /**
         * 对任务根据时间进行排序
         */
        sortDate (array) {
            return array.sort((a, b) => {
                return new Date(this.getStart(b)).getTime() - new Date(this.getStart(a)).getTime();
            });
        },
        /**
         * 处理数据
         */
        dealData (reqData) {
            if (reqData instanceof Array && reqData.length > 0) {
                this.setMinAndMaxTime(reqData);
                return this.mixinToBaseData(reqData);
            }
            return [];
        },
        /**
         * 设置最大时间 与最小时间
         */
        setMinAndMaxTime (reqData) {
            let deepCopy = reqData.slice();
            let minDate;
            let maxDate;
            // 如果只有一条数据 取开始时间或者结束时间
            if (deepCopy.length === 1) {
                let start = this.getStart(deepCopy[0]);
                let stop = this.getEnd(deepCopy[0]);
                minDate = moment(start).valueOf();
                maxDate = moment(stop).valueOf();
            } else {
                let result = {
                    minDate: moment().valueOf(),
                    maxDate: 0
                };
                this.getMinAndMaxTime(deepCopy, result);
                minDate = result.minDate;
                maxDate = result.maxDate;
            }
            this.calcData.min = minDate - this.calcData.range;
            this.calcMaxTime(maxDate);
            // 时间刻度的数量
            this.calcData.rangeNum = Math.ceil((this.calcData.max - this.calcData.min) / this.calcData.range);
            this.calcData.boxWidth = this.calcData.rangeNum * this.config.width;
        },
        mixinToBaseData (reqData) {
            return reqData.map((item) => {
                // 默认设置全部不展开
                this.$set(item, 'expand', this.config.expandAll);
                this.$set(item, 'selected', false);
                // 如果没有 唯一id 可以通过index设置id
                let children = this.config.field.children;
                if (item[children] && item[children].length > 0) {
                    this.mixinToBaseData(item[children]);
                }
                return item;
            });
        },
        /** 递归取最小时间与最大时间
         * @param data
         * @param result
         */
        getMinAndMaxTime (data, result) {
            data.forEach(item => {
                let start = moment(this.getStart(item)).valueOf();
                let end = moment(this.getEnd(item)).valueOf();
                if (start <= result.minDate) {
                    result.minDate = start;
                }
                let children = this.config.field.children;
                if (end >= result.maxDate) result.maxDate = end;
                if (item[children] && item[children].length > 0) {
                    this.getMinAndMaxTime(item[children], result);
                }
            });
        },
        /**
         * 计算duration
         * @param start 开始时间
         * @param stop 结束时间
         */
        calcDuration (start, stop) {
            let duration = (moment(stop).valueOf() - moment(start).valueOf()) / this.calcData.range;
            return Math.floor(duration * 100) / 100;
        },
        /**
         * 计算宽度
         * @param item
         */
        calculateWidth (item) {
            let size = item.duration;
            return this.config.width * size;
        },
        /**
         * 计算 X 的坐标
         * @param item
         * @returns {number}
         */
        calculateX (item) {
            let diff = moment(this.getStart(item)).valueOf() - this.calcData.min;
            return diff / this.calcData.range * 200;
        },
        /**
         * 更新 右边组件显示的 范围 [宽度]
         * @param data
         */
        updateRightStyle (data) {
            this.rightStyle.width = data + 'px';
        },
        /**
         * 计算内容区域的尺寸
         */
        calcContentBoxSize () {
            this.$refs.rightBox.calcContentBoxSize();
        },
        /**
         * 融合自定义的配置
         */
        mixinConfig () {
            this.config = {...this.config, ...this.userConfig};
            this.calcData.range = this.config.range;
        },
        handleRange (type) {
            let range = this.calcData.range;
            if (type === 'up') {
                if (this.calcData.range >= 7200000) return;
                let rangeObj = {
                    '1000': 2000,
                    '2000': 5000,
                    '5000': 10000,
                    '10000': 20000,
                    '20000': 30000,
                    '30000': 60000,
                    '60000': 120000,
                    '120000': 180000,
                    '180000': 300000,
                    '300000': 600000,
                    '600000': 1200000,
                    '1200000': 1800000,
                    '1800000': 3600000,
                    '3600000': 7200000
                };
                range = rangeObj[range];
            } else {
                if (this.calcData.range <= 1000) return;
                let rangeObj = {
                    '2000': 1000,
                    '5000': 2000,
                    '10000': 5000,
                    '20000': 10000,
                    '30000': 20000,
                    '60000': 30000,
                    '120000': 60000,
                    '180000': 120000,
                    '300000': 180000,
                    '600000': 300000,
                    '1200000': 600000,
                    '1800000': 1200000,
                    '3600000': 1800000,
                    '7200000': 3600000
                };
                range = rangeObj[range];
            }
            this.updateRange(range);
        },
        calcMaxTime (maxDate) {
            let rightBox = this.$refs.rightBox;
            let maxTime = this.calcData.range * this.config.minRangeNumber + this.calcData.min;
            if (rightBox) {
                let rightWidth = this.$refs.rightBox.$el.clientWidth;
                let maxFromBox = Math.ceil(rightWidth / this.config.width) * this.calcData.range + this.calcData.min;
                let max = [maxDate, maxTime, maxFromBox].sort((a, b) => b - a);
                this.calcData.max = max[0];
            } else {
                let max = [maxDate, maxTime].sort((a, b) => b - a);
                this.calcData.max = max[0];
            }
        },
        rangeClick (item) {
            this.updateExpandRowKeys(item.id);
            this.$emit('rangeClick', item);
        }
    },
    created () {
        this.mixinConfig();
        let copyData = this.data.slice();
        this.baseData.data = this.dealData(copyData);
    },
    watch: {
        data (n) {
            let copyData = n.slice();
            this.baseData.data = this.dealData(copyData);
            this.$refs.rightBox.calcCells();
        }
    },
    components: {leftCom, rightCom}
};
</script>
