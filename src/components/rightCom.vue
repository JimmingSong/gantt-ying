<style lang="less" scoped>
    .right {
        position: relative;
        background: #2d2d2d;
        width: 100%;
        height: 100%;
        overflow: auto;
        &-box {
            height: 100%;
            &-date{
                position: relative;
                width: 100%;
                height: 30px;
                &-text {
                    position: absolute;
                    bottom: 10px;
                    font-size: 14px;
                }

                &-ticks {
                    position: absolute;
                    left: 0;
                    bottom: 3px;
                    width: 100%;
                    background-image: linear-gradient(90deg, #b5b5b5 1px, transparent 1px, transparent 100%);
                    background-repeat: repeat-x;
                }

                &-hight {
                    height: 10px;
                    background-size: 200px 100%;
                }

                &-short {
                    height: 5px;
                    background-size: 5px 100%;
                }
            }
        }
    }
</style>

<template>
    <div class="right" ref="rightCon">
        <div class="right-box" :style="{width: boxWidth + 'px'}" ref="content">
            <div class="right-box-date" ref="dateBox">
                <div
                    v-for="(item,dex) in dateList"
                    class="right-box-date-text"
                    :key="dex"
                    :style="{left: dateShowLeft(item.seconds, dex) +'px'}">{{item.txt}}
                </div>
                <div class="right-box-date-ticks right-box-date-hight" :style="{backgroundSize: config.width + 'px 100%;'}"></div>
                <div class="right-box-date-ticks right-box-date-short"></div>
            </div>
            <svg class="gantt-svg-con"
                        ref="svg"
                        width="100%"
                        height="calc(100% - 30px)"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                <defs>
                    <linearGradient id="task_style" x1="0%" y1="0%" x2="0%" y2="50%">
                        <stop offset="0%" style="stop-color: #7777bb;stop-opacity: 1"></stop>
                        <stop offset="100%" style="stop-color: #5555aa;stop-opacity: 1"></stop>
                    </linearGradient>
                </defs>
                <defs>
                    <linearGradient id="task_style_progress" x1="0%" y1="0%" x2="0%" y2="50%">
                        <stop offset="0%" style="stop-color: #4a4abb;stop-opacity: 1"></stop>
                        <stop offset="100%" style="stop-color: #4426aa;stop-opacity: 1"></stop>
                    </linearGradient>
                </defs>
                <g v-for="(item,dex) in data" :key="dex">
                    <g>
                        <rect
                            :key="dex"
                            :width="item.mixin.width"
                            :height="config.height-config.space"
                            :y="calcY(dex)"
                            :x="item.mixin.x"
                            rx="3"
                            ry="3"
                            style="fill: url(#task_style)"
                            opacity="0.6"
                            @click="rectDoubleClick(item)"
                        >
                        </rect>
                        <rect
                            v-if="item.progress && item.progress > 0"
                            style="fill: url(#task_style_progress)"
                            :width="calcRectProgressWidth(item)"
                            :height="config.height-config.space"
                            :y="calcY(dex)"
                            :x="item.mixin.x"
                            rx="3"
                            ry="3"
                            opacity="0.6"
                        ></rect>
                        <line x1="0" :y1="(config.height + 1) * (dex + 1) + dex" :x2="boxWidth" :y2="(config.height + 1) * (dex + 1) + dex" style="stroke:#ccc;stroke-width:1"/>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'rightCom',
    props: ['data', 'calcData', 'config'],
    data () {
        return {
            cells: [], // 时间轴
            boxWidth: 0,
            rangeNum: 0,
            line: {
                x: 100,
                y1: 0,
                y2: 200,
                style: {
                    'stroke-width': 2,
                    'stroke': '#6f6f6f'
                }
            }
        };
    },
    computed: {
        /**
         * 时间轴 数据
         */
        dateList () {
            return this.cells.map(item => {
                return {
                    txt: this.dateFormat(item),
                    seconds: item
                };
            });
        }
    },
    methods: {
        calcY (dex) {
            let top = dex * this.config.height + this.config.space / 2 * dex;
            if (dex === 0) {
                // 每个任务之间都有 边框 top的距离要加上 边框的宽度
                top = this.config.space / 2;
            }
            return top;
        },
        cutLineY (dex) {
            return (this.config.height + 1) * (dex + 1) + dex
        },
        calcCells () {
            let arr = [];
            let {min, max} = this.calcData;
            max = this.rangeNum * this.calcData.range + min;
            for (let i = min; i <= max; i+=this.calcData.range) {
                arr.push(i);
            }
            this.$set(this, 'cells', arr);
            // this.cells = arr; 
        },
        /**
         * 根据配置来格式化 时间轴的显示 模式
         * 默认为 正常时间格式显示
         * @param second 传入时间戳
         * @return String 输出时间
         */
        dateFormat (second) {
            let firstTime = moment(this.calcData.min).format('YYYY-MM-DD');
            let first = moment(firstTime);
            let diff = moment(second).diff(first, 'days');
            let day = diff.toString().padStart(3, '000');
            let time = moment(second).format('HH:mm:ss SSS');
            if (this.config.timeLine.model === 'cumulative') {
                return `${day} ${time}`;
            } else if (this.config.timeLine.model === 'iso') {
                return moment(second).toISOString();
            }
            return moment(second).format(this.config.timeLine.format);
        },
        dateShowLeft (millisecond, dex) {
            return dex * this.config.width;
        },
        /**
         * 计算每个任务的进度条 显示的 x轴的坐标
         * @param time
         */
        calcX (time) {
            let range = this.calcData.range / this.config.width;
            let timeDiff = moment(time).valueOf() - this.cells[0];
            if (timeDiff) {
                // console.log((moment(time).valueOf() - this.cells[0]) / range);
                return (moment(time).valueOf() - this.cells[0]) / range;
            }
            return 0;
        }
    },
    mounted () {
        this.$nextTick().then(() => {
            this.rangeNum = Math.ceil((this.calcData.max-this.calcData.min)/this.calcData.range) + 1;
            this.calcCells();
            this.boxWidth = this.rangeNum * this.config.width;
        });
        let content = this.$refs.content;
        content.addEventListener('scroll', () => {
            let top = content.scrollTop;
            this.$emit('scrollEvent', top);
        });
    }
};
</script>
