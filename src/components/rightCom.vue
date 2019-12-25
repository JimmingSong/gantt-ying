<style lang="less" scoped>
    .right {
        position: relative;
        background: #2d2d2d;
        width: 85%;
        height: 100%;
        overflow-x: hidden;
        .right-box-scroll {
            width: 100%;
            overflow: hidden;
        }
        .right-box-date{
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
        &-box {
            width: 100%;
            height: calc(100% - 30px);
            overflow: auto;
        }
    }
</style>

<template>
    <div class="right">
        <div class="right-box-scroll" ref="dateScroll">
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
        <div class="right-box" ref="rightCon">
            <div class="right-box-scroll" :style="{width: calcData.boxWidth + 'px'}">
                <div class="right-box-range" style="height: calc(100% - 30px);" ref="content">
                    <rectCom v-for="(item,dex) in data" :key="dex" :item="item" :config="config" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import rectCom from './rectCom';
export default {
    name: 'rightCom',
    props: ['data', 'calcData', 'config', 'expandData'],
    data () {
        return {
            cells: [], // 时间轴
            boxWidth: 0,
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
        cutLineY (dex) {
            return this.calcY(dex) + this.config.height;
        },
        calcCells () {
            let arr = [];
            let {min, max} = this.calcData;
            max = this.calcData.rangeNum * this.calcData.range + min;
            console.log('更新cells');
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
            this.$refs.dateScroll.scroll(left, 0)
            this.$emit('scrollEvent', top);
        });
    },
    components: {rectCom}
};
</script>
