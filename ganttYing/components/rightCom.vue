<style lang="less" scoped>
    .gantt-right {
        position: relative;
        background: transparent;
        width: 85%;
        height: 100%;
        overflow-x: hidden;
        .right-box-date-scroll {
            width: 100%;
            overflow: hidden;
        }
        .right-box-date{
            position: relative;
            width: 100%;
            height: 29px;
            &-text {
                position: absolute;
                bottom: 10px;
                font-size: 12px;
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
        &-box {
            position: relative;
            width: 100%;
            height: calc(100% - 30px);
            overflow: auto;
            transform: scaleX(1);
            transition: scroll 500ms linear;
            .right-box-scroll {
                height: 100%;
                .right-box-range {
                    height: 100%;
                }
            }
        }
        .right-box-mask {
            position: absolute;
            top: 0;
            left: 0;
            height: calc(100% - 15px);
            background: rgba(36, 36, 36, 0.63);
            border-right: 1px solid #c30000;
            .mask-time {
                position: absolute;
                top: 50%;
                right: 4px;
                font-size: 14px;
                color: #ccc;
            }
        }
    }
</style>

<template>
    <div class="gantt-right">
        <div :class="['right-box-date-scroll', 'border-bottom-'+config.theme]" ref="dateScroll">
            <div class="right-box-date" ref="dateBox" :style="{width: calcData.boxWidth + 'px'}">
                <div
                    v-for="(item,dex) in dateList"
                    class="right-box-date-text"
                    :key="dex"
                    :style="{left: dateShowLeft(item.seconds, dex) +'px'}">{{item.txt}}
                </div>
                <div class="right-box-date-ticks right-box-date-hight" :style="{backgroundSize: config.width + 'px 100%;'}"></div>
                <div class="right-box-date-ticks right-box-date-short"></div>
            </div>
        </div>
        <div class="gantt-right-box" ref="rightCon">
            <div class="right-box-scroll" :style="{width: calcData.boxWidth + 'px'}">
                <div class="right-box-range" ref="content">
                    <rectCom
                        v-for="(item,dex) in data"
                        :key="dex"
                        :item="item"
                        :index="dex"
                        :config="config"
                        :parent="data"
                        :selectedIndex='selectedIndex'
                        :selectedData='selectedData'
                        @rangeClick="rangeClick"
                        @updateSelectedData='updateSelectedData' />
                </div>
            </div>
        </div>
        <div v-if="showProgress" class="right-box-mask" :style="{width: progressWidth + 'px', left: progressLeft + 'px'}">
            <span v-if="progressWidth > 0" class="mask-time">{{currentTime}}</span>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import rectCom from './rectCom';
export default {
    name: 'rightCom',
    props: ['data', 'calcData', 'config', 'expandData', 'currentTime', 'showProgress'],
    data () {
        return {
            cells: [], // 时间轴
            nowPos: 0,
            progressWidth: 0,
            progressLeft: 0,
            selectedIndex: -1,
            selectedData: {}
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
            if (this.expandData.index) {
                dex += this.expandData.length;
            }
            let top = dex * this.config.height + this.config.space * dex;
            if (dex === 0) {
                // 每个任务之间都有 边框 top的距离要加上 边框的宽度
                top = this.config.space / 2;
            } else if (dex > 0) {
                top += dex;
            }
            return top;
        },
        calcCells (first = 0) {
            let arr = [];
            let {min} = this.calcData;
            for (let i = first; i <= this.config.minRangeNumber + first; i++) {
                let date = min + this.calcData.range * i;
                arr.push(date);
            }
            this.$set(this, 'cells', arr);
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
        dateShowLeft (millisecond) {
            let dex = (millisecond - this.calcData.min) / this.calcData.range;
            return dex * this.config.width;
        },
        /**
         * 上下滚动
         * @param top
         */
        scrollEvent (top) {
            let left = this.$refs.rightCon.scrollLeft;
            this.$refs.rightCon.scroll(left, top);
        },
        scrollLeftRight (left) {
            // 这个判断是防止 点击左边任务时 右边内容区域 与时间不同步问题 任务的时间得到的scrollLeft要超过 scrollLeft所能达到的最大值 内容区域就不会移动 会导致与时间不同步
            if (left > this.calcData.boxWidth -  this.$refs.rightCon.clientWidth && this.$refs.rightCon.scrollLeft + this.$refs.rightCon.clientWidth >= this.calcData.boxWidth) return;
            let leftNum = Math.ceil(left / this.config.width);
            this.calcCells(Math.ceil(Math.abs(leftNum) - 1));
            let top = this.$refs.rightCon.scrollTop;
            this.$refs.dateScroll.scroll(left, 0);
            this.$refs.rightCon.scroll(left, top);

        },
        rangeClick (item) {
            this.$emit('rangeClick', item);
        },
        updateSelectedData (data) {
            this.selectedIndex = data.index;
            this.selectedData = data.item;
        }
    },
    created () {
        let current = this.currentTime.replace(/[年月日]/g, '/');
        this.progressWidth = this.dateShowLeft(moment(current).valueOf());
    },
    mounted () {
        this.$nextTick().then(() => {
            this.calcCells();
        });
        let content = this.$refs.rightCon;
        content.addEventListener('scroll', () => {
            let top = content.scrollTop;
            let left = content.scrollLeft;
            let leftNum = Math.ceil(left / this.config.width);
            if (this.nowPos !== leftNum) {
                this.nowPos = leftNum;
                this.calcCells(Math.ceil(Math.abs(leftNum) - 1));
            }
            this.$refs.dateScroll.scroll(left, 0);
            this.progressLeft = -left;// 任务进度遮罩层的左边距 为了防止移动滚动条时 固定不动
            this.$emit('scrollEvent', top);
        });
    },
    watch: {
        currentTime (val) {
            if (!this.showProgress) return;
            val = val.replace(/[年月日]/g, '/');
            this.progressWidth = this.dateShowLeft(moment(val).valueOf());
        }
    },
    components: {rectCom}
};
</script>
