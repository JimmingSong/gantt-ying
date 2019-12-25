<style scoped>
  @import "ganttCom.css";
  .tool {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      right: 0;
      height: 30px;
      width: 100px;
      z-index: 100;
      background-image: linear-gradient(-90deg, #404040, #404040 70%, rgba(64, 64, 64, 0) 100%);

      & > i {
          margin-right: 5px;
      }
  }
</style>

<template>
    <div class="gantt-container" ref="gantt">
        <leftCom
            ref="leftBox"
            :data="jsonData"
            :config="config"
            class="gantt-left_container"
            :style="rightStyle"
            @rowClick="rangeChartShow"
            @rowDoubleClick="showDialog"
            @updateRightStyle="updateRightStyle"
            @calcContentBoxSize="calcContentBoxSize"
        ></leftCom>
        <rightCom
            ref="rightBox"
            :data="jsonData"
            :config="config"
            :calcData="calcData"
            :expandData="expandData"
            @dataSubmit="handleSubmit"
            @scrollEvent="scrollEvent"
            @updateRange="updateRange" />
        <div class="tool">
            <i class="el-icon-zoom-in" @click="handleRange('up')"></i>
            <i class="el-icon-zoom-out" @click="handleRange('down')"></i>
        </div>
    </div>
</template>

<script>
import leftCom from './leftCom';
import rightCom from './rightCom';
import defaultConfig from './config';
import moment from 'moment';
export default {
    name: 'index',
    props: {
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        userConfig: {}
    },
    data () {
        return {
            baseData: {
                data: []
            },
            leftBaseData: [],
            rightStyle: {
                width: '15%'
            },
            config: defaultConfig,
            calcData: {
                boxWidth: 0,
                range: defaultConfig.range,
                rangeNum: 0,
                max: 0,
                min: 0
            },
            expandData: {
                index: null,
                length: 0
            }
        };
    },
    computed: {
        jsonData () {
            return this.baseData.data;
        }
    },
    methods: {
        handleSubmit (data) {
            this.$emit('handleSubmit', data);
        },
        updateCalcDataMax (data) {
            this.calcData.max = data;
        },
        scrollEvent (top) {
            this.$refs.leftBox.scrollEvent(top);
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
        rangeChartShow (index) {
            let data = this.baseData.data[index];
            console.log(data);
            // this.$refs.rightBox.calcScrollLeftAccordingDate(data);
        },
        /**
         * range 变化 触发事件
         */
        updateRange (newRange) {
            this.calcData.range = newRange;
            this.calcData.rangeNum = Math.ceil((this.calcData.max-this.calcData.min)/this.calcData.range);
            this.calcData.boxWidth = this.calcData.rangeNum * this.config.width;
            this.dealData(this.baseData.data);
            this.$refs.rightBox.calcCells();
        },
        /**
         * 对任务根据时间进行排序
         */
        sortDate (array) {
            return array.sort((a, b) => {
                return new Date(b.start).getTime() - new Date(a.start).getTime();
            });
        },
        /**
         * 处理数据
         */
        dealData (reqData) {
            if (reqData instanceof Array && reqData.length > 0) {
                if (!this.calcData.min) {
                    this.setMinAndMaxTime(reqData);
                }
                return reqData.map((item, index) => {
                    return this.mixinToBaseData(item, index);
                });
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
                let start = deepCopy[0][this.config.field.start];
                let stop = deepCopy[0][this.config.field.stop];
                minDate = moment(start).valueOf();
                maxDate = moment(stop).valueOf();
            } else {
                let result = {
                    minDate: moment().valueOf(),
                    maxDate: 0
                };
                this.getMinAndMaxTime(deepCopy, result);
                minDate = result.minDate - this.calcData.range;
                maxDate = result.maxDate;
            }
            this.calcData.max = maxDate;
            this.calcData.min = minDate;
            this.calcData.rangeNum = Math.ceil((this.calcData.max-this.calcData.min)/this.calcData.range);
            this.calcData.boxWidth = this.calcData.rangeNum * this.config.width;
        },
        mixinToBaseData (reqData, index) {
            if (reqData.children && reqData.children.length > 0) {
                let dateArray = reqData.children.map(item => {
                    this.$set(item, 'duration', this.calcDuration(item.start, item.stop));
                    // item.duration = this.calcDuration(item.start, item.stop);
                    if (!reqData.duration) this.$set(reqData, 'duration', 0);
                    reqData.duration += item.duration;
                    let mixin = {
                        x: this.calculateX(item),
                        width: this.calculateWidth(item),
                        style: this.config.taskStyle
                    };
                    this.$set(item, 'mixin', mixin);
                    return item;
                });
                let date = this.sortDate(dateArray);
                reqData.start = moment(date[date.length-1].start).format('YYYY-MM-DD HH:mm:ss');
            }
            // 默认设置全部不展开
            this.$set(reqData, 'expand', false);
            if (reqData.start && reqData.stop) {
                this.$set(reqData, 'duration', this.calcDuration(reqData.start, reqData.stop));
            }
            // 计算 任务的 left 定位
            // 随着range的变化 计算 width的尺寸
            this.$set(reqData, 'mixin', {
                x: this.calculateX(reqData),
                width: this.calculateWidth(reqData),
                style: this.config.taskStyle
            });
            this.$set(reqData, 'index', index);
            return reqData;
        },
        /** 递归去最小时间与最大时间
         * @param data
         * @param result
         */
        getMinAndMaxTime (data, result) {
            data.forEach(item => {
                let start = moment(item.start).valueOf();
                let end = moment(item.stop).valueOf();
                if (start <= result.minDate) {
                    result.minDate = start
                }
                if (end >= result.maxDate) result.maxDate = end;
                if (item.children && item.children.length > 0) {
                    this.getMinAndMaxTime(item.children, result);
                }
            })
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
            let diff = moment(item.start).valueOf() - this.calcData.min;
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
        expandRow (row) {
            let index = this.baseData.data.findIndex(item => item.id === row.id);
            let length = row.children.length;
            this.expandData.index = index;
            if (row.expand) {
                this.expandData.length += length;
            } else {
                this.expandData.length -= length;
            }
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
            switch (type) {
                case 'up':
                    if (range > 1000 && range < 1000 * 60 * 60) {
                        range *= 60;
                    } else if (range === 1000 * 60 * 60) {
                        range *= 24;
                    }
                    break;
                case 'down':
                    if (range > 1000 && range <= 1000 * 60 * 60) {
                        range /= 60;
                    } else if (range === 1000 * 60 * 60 * 24) {
                        range /= 24;
                    }
                    break;
            }
            this.updateRange(range);
        }
    },
    created () {
        this.mixinConfig();
        let copyData = this.data.slice();
        this.baseData.data = this.dealData(copyData);
        this.leftBaseData = this.baseData.data;
    },
    components: {leftCom, rightCom}
};
</script>
