<style lang="less" scoped>
    .gantt-right-container {
        position: relative;
        background: #2d2d2d;

        .gantt-right-date {
            width: auto;
            white-space: nowrap;
            position: relative;
            height: 30px;
            border-bottom: 1px solid #cccccc;
            overflow: hidden;

            &-box {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
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

            &-text {
                position: absolute;
                bottom: 10px;
                font-size: 14px;
            }
        }
    }

    .gantt-right-date-handle {
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
    .gantt-scroll-box {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        width: 100%;
        height: 10px;
        & > i {
            display: inline-block;
            width: 15px;
            font-size: 12px;
            background: #6d6d6d;
            color: #000;
        }
    }
    .gantt-right-scroll {
        position: relative;
        width: calc(100% - 30px);
        height: 10px;
        background: #404040;
        &-in {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100px;
            background: #555;
        }
    }

    .gantt-right-content {
        position: relative;
        height: calc(100% - 35px);
        overflow-x: hidden;
        overflow-y: auto;
        .content-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
    }

    .gantt-svg-con {
        position: absolute;
        top: 0;
        left: 0;
    }

    .gantt-bgc {
        width: 100%;
        height: 100%;
    }

    .gantt-rows {
        width: 100%;
        border-bottom: 1px solid #4d4d4d;
    }

    .time-line:hover {
        cursor: col-resize;
    }
</style>

<template>
    <div class="gantt-right-container" ref="rightCon">
        <!--操作区-->
        <div class="gantt-right-date-handle">
            <i class="el-icon-upload2"></i>
            <i class="el-icon-zoom-in"></i>
            <i class="el-icon-zoom-out"></i>
        </div>
        <!--时间刻度区-->
        <div class="gantt-right-date" style="width: 100%">
            <!--时间刻度用来移动的容器-->
            <div class="gantt-right-date-box" ref="dateBox"
                 :style="{left: timeScale.left + 'px',width: timeScale.width + 'px'}">
                <!--时间刻度文字-->
                <div
                    v-for="(item,dex) in timeList"
                    class="gantt-right-date-text"
                    :key="dex"
                    :style="{left: timeTextLeft(item.seconds, dex) +'px'}">{{item.txt}}
                </div>
                <!--背景刻度尺-->
                <div class="gantt-right-date-ticks gantt-right-date-hight"
                     :style="{backgroundSize: config.width + 'px 100%;'}"></div>
                <div class="gantt-right-date-ticks gantt-right-date-short"></div>
            </div>
        </div>
        <div class="gantt-right-content" ref="content">
            <div class="content-box">
                <div class="gantt-bgc">
                    <div class="gantt-rows" v-for="(item, dex) in gridRows" :key="dex"
                         :style="{height: config.height + 'px'}"></div>
                </div>
                <!--<svg class="gantt-svg-con"
                     ref="svg"
                     width="100%"
                     height="100%"
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
                        <g
                            :key="index"
                            v-for="(doc,index) in item.children">
                            <rect
                                :key="index"
                                :width="doc.mixin.width"
                                :height="config.height-config.space"
                                :y="calcY(dex)"
                                :x="doc.mixin.x"
                                rx="3"
                                ry="3"
                                style="fill: url(#task_style)"
                                opacity="0.6"
                                @mousemove.self="rectMouseMove($event, doc)"
                                @mouseout.self="rectMouseOut($event, doc)"
                                @mousedown.self="rectMouseDown(doc, index, $event)">
                            </rect>
                            <rect
                                v-if="doc.progress && doc.progress > 0"
                                style="fill: url(#task_style_progress)"
                                :width="calcRectProgressWidth(doc)"
                                :height="config.height-config.space"
                                :y="calcY(dex)"
                                :x="doc.mixin.x"
                                rx="3"
                                ry="3"
                                opacity="0.6"
                                @mousemove.self="rectMouseMove($event, doc)"
                                @mouseout.self="rectMouseOut($event, doc)"
                                @mousedown.self="rectMouseDown(doc,index,$event)"
                            ></rect>
                        </g>
                        <g v-if="!item.children">
                            <rect
                                :key="dex"
                                :width="item.mixin.width"
                                :height="config.height-config.space"
                                :y="calcY(dex)"
                                :x="calcX(item.start)"
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
                        </g>
                    </g>

                    &lt;!&ndash;<template v-if="config.timeline.show">
                        <line class="time-line" :x1="line.x" :y1="line.y1" :x2="line.x" :y2="line.y2"
                              :style="line.style" @mousedown.self="timeLineMouseDown($event)"></line>
                        <text :x="line.x" y="20" class="time-text" fill="#bdbdbd">{{timelineText}}</text>
                        <polygon :points="polygonTriangle.first"></polygon>
                        <polygon :points="polygonTriangle.last"></polygon>
                    </template>&ndash;&gt;
                </svg>-->
            </div>
            <!--<div class="gantt-right-content-task" v-for="(item,dex) in data" :style="taskStyle(item,dex)"></div>-->
        </div>
        <div class="gantt-scroll-box">
            <i class="gantt-right-scroll-left el-icon-caret-left"></i>
            <div class="gantt-right-scroll" ref="scroll">
                <div class="gantt-right-scroll-in"
                     :style="{left: scroll.left + 'px', width: scrollWidth + 'px'}"
                     @mousedown.self="scrollMove($event)"
                ></div>
            </div>
            <i class="gantt-right-scroll-right el-icon-caret-right"></i>
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
            // 内容区域
            content: {
                width: 0,
                height: 0
            },
            // 全局变量
            global: {
                width: 0,
                firstTime: 0
            },
            // 时间刻度
            timeScale: {
                list: [],
                left: 0,
                width: 0
            },
            scroll: {
                width: 0,
                left: 0
            }
        };
    },
    computed: {
        /**
         * 滚动条的宽度
         */
        scrollWidth () {
            let width = this.calcRealScrollWidth();
            if (width < 100 && width > 0) {
                // this.scroll.scale = Math.floor(50 / width);
                width = 50;
            } else if (width >= this.content.width) {
                width = this.scroll.width - 30;
            }
            return width;
        },
        // 格式化时间列表 分出显示字段和
        timeList () {
            return this.timeScale.list.map(item => {
                return {
                    txt: this.dateFormat(item),
                    seconds: item
                };
            });
        },
        // 根据容器高度计算行数
        gridRows () {
            let nums = Math.ceil(this.content.height / this.config.height);
            let arr = [];
            for (let i = 0; i < nums; i++) {
                arr.push(i);
            }
            return arr;
        },
    },
    methods: {
        /**
         * 自定义滚动条的 拖拽事件
         * @param e
         */
        scrollMove (e) {
            let scrollBox = this.$refs.scroll;
            scrollBox.onmousemove = (event) => {
                event.preventDefault();
                // 获取在容器中的位置 加上左边的箭头
                let left = scrollBox.getBoundingClientRect().left;
                // 滑块的宽度
                let width = event.target.clientWidth;
                // 滑块的左位置 = 当前鼠标在scroll容器中的位置-当前容器在全局中的位置-鼠标落脚点得滑动条中的位置
                let scrollLeft = event.clientX - left - e.offsetX;
                // let rightWidth = this.width.scroll - scrollLeft - event.target.clientWidth;
                // 防止 左边 被拖动过头
                if (scrollLeft <= 0) {
                    scrollLeft = 0;
                } else if (width + scrollLeft >= this.scroll.width) { // 防止右边被拖过头
                    scrollLeft = this.scroll.width - width;
                }
                this.scroll.left = scrollLeft;
                this.showDateText(scrollLeft);
                scrollBox.onmouseup = () => {
                    scrollBox.onmousemove = null;
                };
            };
        },
        /**
         * 计算时间轴的 显示
         */
        showDateText (scrollLeft) {
            let scale = this.content.width / this.global.width; // 滚动条的区间与总长的比例
            // 根据滚动条的位置 计算最小时间
            let currentFirst = moment(scrollLeft / scale * (this.calcData.range / this.config.width) + this.calcData.min).valueOf();
            this.timeScale.left = -(scrollLeft / scale);
            if (this.timeScale.left < -this.config.width) {
                this.timeScale.left = this.timeScale.left + this.config.width;
            }
            console.log(this.timeScale.left, scrollLeft / scale, scale, this.content.width, this.global.width);
            if (this.scroll.left === 0) {
                this.calcCells();
                return;
            }
            // 判定是否重新机选日期
            this.global.firstTime = currentFirst;
            this.calcCells(currentFirst);
        },
        /**
         * 计算滚动条 的真是宽度
         * 为什么直接用 是因为 如果时间跨度特别大的时候 滚动条会特别窄 所以需要在时间跨度特别大的时候 设置最小值 暂定 50 px
         */
        calcRealScrollWidth () {
            // 最大时间 与 最小时间 中 计算所得的做大的容器的宽度
            let aWidth = this.global.width;
            let contentWidth = this.content.width;
            let scrollWidth = this.content.width - 30;
            let scale = contentWidth / aWidth;
            return scale * scrollWidth;
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
        /**
         * 计算时间轴的显示数据
         * @param first 时间轴的第一条时间
         */
        calcCells (first = this.calcData.min) {
            let arr = [];
            let end = first + this.calcData.range * (this.timeScale.width / this.config.width);
            for (let i = first; i <= end; i += this.calcData.range) {
                arr.push(i);
            }
            this.global.firstTime = arr[0];
            this.timeScale.list = arr;
            // this.$set(this, 'cells', arr);
        },
        /**
         * 时间段最左边一个的 位置
         */
        timeTextLeft (millisecond, dex) {
            return dex * this.config.width;
        },
        /**
         * 计算显示右边 显示盒子的尺寸
         */
        calcContentBoxSize () {
            // 容器的高度 - 时间轴的高度
            // let h = this.$refs.content.clientHeight - 60;
            let w = this.$refs.content.clientWidth;
            // 当前屏幕宽度能容下多少个时间段
            let rangNum = Math.ceil(w / this.config.width);
            // 最大时间差与最小时间差能有多少个时间差
            let maxAndMin = Math.ceil((this.calcData.max - this.calcData.min) / this.calcData.range);
            // 如果时间差的时间段 比 屏幕的少 要补齐
            if (maxAndMin <= rangNum) {
                let num = rangNum + 1;
                maxAndMin = num * this.calcData.range;
                this.$emit('updateCalcDataMax', maxAndMin);
                this.global.width = num * this.config.width;
            } else {
                this.global.total = (maxAndMin + 1) * this.config.width;
                this.global.width = maxAndMin * this.config.width;
            }
            let add = this.config.width - w % this.config.width;
            // 容器的高度 = 数据的数量 * 配置的每项的高度
            this.content.height = this.data.length * this.config.height;
            // this.line.y2 = h + 18;
            // 内容区域的宽度
            this.content.width = w;
            this.scroll.width = w - 30;
            // 时间轴容器的宽度
            this.timeScale.width = w + add + this.config.width;
        },
    },
    mounted () {
        this.$nextTick().then(() => {
            this.calcContentBoxSize();
            this.calcCells();
        });
        let content = this.$refs.content;
        content.addEventListener('scroll', () => {
            let top = content.scrollTop;
            this.$emit('scrollEvent', top);
        });
    }
};
</script>
