<style scoped>
  @import "ganttCom.css";
</style>

<template>
    <div class="gantt-container" ref="gantt">
        <leftCom
            ref="leftBox"
            :data="leftBaseData"
            :config="config"
            class="gantt-left_container"
            :style="rightStyle"
            @rowClick="rangeChartShow"
            @rowDoubleClick="showDialog"
            @updateRightStyle="updateRightStyle"
            @calcContentBoxSize="calcContentBoxSize"
            @expandRow="expandRow"
        ></leftCom>
        <rightCom
            ref="rightBox"
            :data="jsonData"
            :config="config"
            :calcData="calcData"
            @dataSubmit="handleSubmit"
            @scrollEvent="scrollEvent"
            @updateRange="updateRange" />
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
                range: defaultConfig.range,
                max: 0,
                min: 0
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
            this.$refs.rightBox.calcScrollLeftAccordingDate(data);
        },
        /**
         * range 变化 触发事件
         */
        updateRange (newRange) {
            this.calcData.range = newRange;
            this.dealData(this.baseData.data);
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
                        let sortResult = deepCopy.sort((a, b) => {
                            return new Date(b.start).getTime() - new Date(a.start).getTime();
                        });
                        minDate = moment(sortResult.slice(-1)[0].start).valueOf();
                        maxDate = moment(sortResult[0].stop).valueOf();
                    }

                    this.calcData.max = maxDate;
                    this.calcData.min = minDate;
                }
                return reqData.map((item, index) => {
                    return this.mixinToBaseData(item, index);
                });
            }
            return [];
        },
        mixinToBaseData (reqData, index) {
            // if (typeof reqData.duration !== 'number' || isNaN(reqData.duration)) return new Error('duration is should be number');
            if (reqData.children && reqData.children.length > 0) {
                let dateArray = reqData.children.map(item => {
                    this.$set(item, 'duration', this.calcDuration(item.start, item.stop));
                    // item.duration = this.calcDuration(item.start, item.stop);
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
                reqData.start = moment(date[0]).format('YYYY-MM-DD HH:mm:ss');
            }
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
            let size = item.duration * this.calcData.range / this.calcData.range;
            return this.config.width * size;
        },
        /**
         * 计算 X 的坐标
         * @param item
         * @returns {number}
         */
        calculateX (item) {
            let diff = moment(item.start).valueOf() - this.calcData.min;
            return diff / this.calcData.range * 200 + diff % this.calcData.range / this.calcData.range * 200;
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
        expandRow ({row, expanded}) {
            let index = this.baseData.data.findIndex(item => item.id === row.id) + 1;
            if (expanded) {
                row.children.forEach((item, dex) => {
                    item.id = item.id + '_' + dex;
                    let mixinResult = this.dealData(item, dex);
                    this.baseData.data.splice(index + dex, 0, mixinResult);
                });
            } else {
                this.baseData.data.splice(index, row.children.length);
            }
        },
        /**
         * 融合自定义的配置
         */
        mixinConfig () {
            this.config = {...this.config, ...this.userConfig};
            this.calcData.range = this.config.range;
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
