<style lang="less" scoped>
    
</style>

<template>
    <div class="gantt-right">
        <div class="right-box-date-scroll" ref="dateScroll">
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
                <div class="right-box-range" style="height: calc(100% - 30px);" ref="content">
                    <rectCom v-for="(item,dex) in data" :key="dex" :item="item" :config="config" />
                </div>
            </div>
        </div>
        <div v-if="showProgress" class="right-box-mask" :style="{width: 0 + 'px'}"></div>
    </div>
</template>

<script>
import moment from 'moment';
import rectCom from './rectCom';
export default {
    name: 'rightCom',
    props: ['theme', 'data', 'calcData', 'config', 'showProgress'],
    data () {
        return {
            cells: [], // 时间轴
            boxWidth: 0,
            nowPos: 0,
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
        scrollEvent (top) {
            this.$refs.rightCon.scroll(0, top);
        }
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
            console.log(leftNum);
            if (this.nowPos !== leftNum) {
                this.nowPos = leftNum;
                this.calcCells(Math.ceil(Math.abs(leftNum) - 1));
            }
            this.$refs.dateScroll.scroll(left, 0);
            this.$emit('scrollEvent', top);
        });
    },
    components: {rectCom}
};
</script>
