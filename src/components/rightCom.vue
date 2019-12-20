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
        <div class="gantt-right-date-handle">
            <i class="el-icon-upload2" @click="dataSubmit"></i>
            <i class="el-icon-zoom-in" @click="handleRange('out')"></i>
            <i class="el-icon-zoom-out" @click="handleRange('in')"></i>
        </div>
        <div class="gantt-right-date" style="width: 100%">
            <div class="gantt-right-date-box" ref="dateBox"
                 :style="{left: left.date + 'px',width: width.date + 'px'}">
                <div
                    v-for="(item,dex) in dateList"
                    class="gantt-right-date-text"
                    :key="dex"
                    :style="{left: dateShowLeft(item.seconds, dex) +'px'}">{{item.txt}}
                </div>
                <div class="gantt-right-date-ticks gantt-right-date-hight"
                     :style="{backgroundSize: config.width + 'px 100%;'}"></div>
                <div class="gantt-right-date-ticks gantt-right-date-short"></div>
            </div>
        </div>
        <div class="gantt-right-content" ref="content">
            <div class="content-box">
                <div class="gantt-bgc">
                    <div class="gantt-rows" v-for="(item, dex) in rows" :key="dex"
                         :style="{height: config.height + 'px'}"></div>
                </div>
                <svg class="gantt-svg-con"
                     ref="svg"
                     width="100%"
                     height="100%"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     @mouseup="svgMouseUp"
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

                    <template v-if="config.timeline.show">
                        <line class="time-line" :x1="line.x" :y1="line.y1" :x2="line.x" :y2="line.y2"
                              :style="line.style" @mousedown.self="timeLineMouseDown($event)"></line>
                        <text :x="line.x" y="20" class="time-text" fill="#bdbdbd">{{timelineText}}</text>
                        <polygon :points="polygonTriangle.first"></polygon>
                        <polygon :points="polygonTriangle.last"></polygon>
                    </template>
                </svg>
            </div>
            <!--<div class="gantt-right-content-task" v-for="(item,dex) in data" :style="taskStyle(item,dex)"></div>-->
        </div>
        <div class="gantt-scroll-box">
            <i class="gantt-right-scroll-left el-icon-caret-left" @click="scrollLeftClick"></i>
            <div class="gantt-right-scroll" ref="scroll" @mousedown.self="jumpToHere($event)">
                <div class="gantt-right-scroll-in" :style="{left: left.scroll + 'px', width: scrollWidth + 'px'}"
                     @mousedown.self="scrollHandle($event)"></div>
            </div>
            <i class="gantt-right-scroll-right el-icon-caret-right" @click="scrollRightClick"></i>
        </div>
        <!-- <draggable
            v-show="dialog.visible"
            title="时间设置"
            :x="300"
            :y="200"
            :w="500"
            :h="250"
            headerClass="time-box"
            drag-handle=".time-box"
            @closeEvent="hideDialog"
        >
            <el-form ref="form" :model="dialog.form" label-width="80px">
                <el-form-item label="开始时间">
                    <el-col :span="22">
                        <el-date-picker
                            type="datetimerange"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            v-model="dialog.form.rangeDate"
                            :default-value="dialog.form.defaultRange"
                            style="width: 100%;"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dialogSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </draggable> -->
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
            width: {
                total: 0,
                date: 0,
                scroll: 0
            },
            left: {
                date: 0,
                scroll: 0,
                content: 0
            },
            scroll: {
                scale: 1
            },
            currentShowDate: [],
            content: {
                width: 0,
                height: 0
            },
            line: {
                x: 100,
                y1: 0,
                y2: 200,
                style: {
                    'stroke-width': 2,
                    'stroke': '#6f6f6f'
                }
            },
            dialog: {
                visible: false,
                row: {},
                form: {
                    rangeDate: [],
                    defaultRange: []
                }
            },
            updated: []
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
        },
        // 根据当前时间间隔段 计算一共有多少 段
        timeSegment () {
            return Math.ceil((this.calcData.max - this.calcData.min) / this.calcData.range);
        },
        // 根据容器高度计算行数
        rows () {
            let nums = Math.ceil(this.content.height / this.config.height);
            let arr = [];
            for (let i = 0; i < nums; i++) {
                arr.push(i);
            }
            return arr;
        },
        /**
             * 滚动条的宽度
             */
        scrollWidth () {
            // 最大时间 与 最小时间 中 计算所得的做大的容器的宽度
            let aWidth = this.width.total;
            let scrollWidth = this.content.width - 30;
            let scale = scrollWidth / aWidth;
            let width = scale * scrollWidth;
            if (width < 100 && width > 0) {
                // this.scroll.scale = Math.floor(50 / width);
                width = 50;
            } else if (width > this.content.width) {
                width = scrollWidth;
            }
            return width;
        },
        timelineText () {
            // 每1px 代表多少毫秒
            let pixed = this.calcData.range / this.config.width;
            let seconds = this.line.x * pixed + this.calcData.min;
            return moment(seconds).format('YYYY-MM-DD HH:mm:ss');
        },
        polygonTriangle () {
            return {
                first: `${this.line.x - 10},0,${this.line.x + 10},0,${this.line.x},10`,
                last: `${this.line.x},${this.line.y2 - 10},${this.line.x - 10},${this.line.y2},${this.line.x + 10},${this.line.y2}`
            };
        }
    },
    methods: {
        dataSubmit () {
            let resultList = this.updated.slice();
            let result = resultList.map(item => {
                item.taskStartTime = moment(item.start).toISOString();
                item.taskStopTime = moment(item.stop).toISOString();
                // delete item.mixin;
                // delete item.index;
                // delete item.start;
                // delete item.stop;
                return item;
            });
            if (result.length === 0) {
                this.$message.warning('数据尚未更新');
                return;
            }
            this.$emit('dataSubmit', result);
        },
        /**
         * 计算显示右边 显示盒子的尺寸
         */
        calcContentBoxSize () {
            // 容器的高度 - 时间轴的高度
            let h = this.$refs.content.clientHeight - 60;
            let w = this.$refs.content.clientWidth;
            // 当前屏幕宽度能容下多少个时间段
            let rangNum = Math.ceil(w / this.config.width);
            // 最大时间差与最小时间差能有多少个时间差
            let maxAndMin = Math.ceil((this.calcData.max - this.calcData.min) / this.calcData.range);
            // 如果时间差的时间段 比 屏幕的少 要补齐
            if (maxAndMin < rangNum) {
                let num = rangNum - maxAndMin + 1;
                maxAndMin = (rangNum - maxAndMin + 1) * this.calcData.range;
                this.$emit('updateCalcDataMax', maxAndMin);
                this.width.total = num * this.config.width;
            } else {
                this.width.total = maxAndMin * this.config.width;
            }
            let add = this.config.width - w % this.config.width;
            // 容器的高度 = 数据的数量 * 配置的每项的高度
            this.content.height = this.data.length * this.config.height;
            this.line.y2 = h + 18;
            // 内容区域的宽度
            this.content.width = w;
            // 时间轴容器的宽度
            this.width.date = w + add + this.config.width;
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
        },
        /* ------------------------------------------------时间轴-------------------------------------------------- */
        /**
         * 时间段最左边一个的 位置
         */
        dateShowLeft (millisecond, dex) {
            return dex * this.config.width;
        },
        /**
         * 计算时间轴的显示数据
         * @param first 时间轴的第一条时间
         */
        calcCells (first = this.calcData.min) {
            let arr = [];
            let end = first + this.calcData.range * (this.width.date / this.config.width);
            for (let i = first; i <= end; i += this.calcData.range) {
                arr.push(i);
            }
            this.$set(this, 'cells', arr);
        },
        /**
         * 计算时间轴的 显示
         */
        showDateText (scrollLeft) {
            let scale = (this.content.width - 30 - this.scrollWidth) / this.width.total; // 滚动条的区间与总长的比例
            let currentFirst = moment(scrollLeft / scale * (this.calcData.range / this.config.width) + this.calcData.min).valueOf();
            console.log(this.left.content);
            this.left.date = -scrollLeft / scale % this.width.date % this.config.width;
            this.left.scroll = scrollLeft;
            if (this.left.scroll === 0) {
                this.calcCells();
                return;
            }
            this.calcCells(currentFirst);
        },
        calcScrollLeftAccordingDate (data) {
            let dateTime = moment(data.start).valueOf();
            let scale = (this.content.width - 30 - this.scrollWidth) / this.width.total; // 滚动条的区间与总长的比例
            let scrollLeft = (dateTime - this.calcData.min) / (this.calcData.range / this.config.width) * scale;
            this.showDateText(scrollLeft);
        },
        /* ------------------------------------------------scroll-------------------------------------------------- */
        /**
             * 自定义滚动条的 拖拽事件
             * @param e
             */
        scrollHandle (e) {
            let scrollBox = this.$refs.scroll;
            scrollBox.onmousemove = (event) => {
                event.preventDefault();
                // 获取在容器中的位置 加上左边的箭头
                let left = scrollBox.getBoundingClientRect().left;
                // 滑块的宽度
                let width = event.target.clientWidth;
                // 滑块的左位置 = 当前鼠标在scroll容器中的位置-当前容器在全局中的位置-鼠标落脚点得滑动条中的位置 + 箭头的宽度
                let scrollLeft = event.clientX - left - e.offsetX;
                // 防止 左边 被拖动过头
                if (scrollLeft <= 0) {
                    scrollLeft = 0;
                } else if (width + scrollLeft >= this.content.width - 30) { // 防止右边被拖过头
                    scrollLeft = this.content.width - width - 30;
                }
                this.left.scroll = scrollLeft;
                this.showDateText(scrollLeft);
                scrollBox.onmouseup = () => {
                    scrollBox.onmousemove = null;
                };
            };
        },
        /**
             * 滚动条点击事件 跳转到点击的坐标
             * @param e
             */
        jumpToHere (e) {
            let scrollLeft = e.offsetX;
            if (scrollLeft >= this.content.width - this.scrollWidth) {
                scrollLeft = this.content.width - this.scrollWidth - 30;
            }
            this.left.scroll = scrollLeft;
            this.showDateText(scrollLeft);
        },
        scrollLeftClick () {
            if (this.left.scroll === 0) return;
            this.left.scroll--;
            // console.log(this.left.scroll);
            this.showDateText(this.left.scroll);
        },
        scrollRightClick () {
            this.left.scroll++;
            // console.log(this.left.scroll);
            this.showDateText(this.left.scroll);
        },
        /**
             * 计算已经完成的进度条的 宽度
             */
        calcRectProgressWidth (item) {
            return item.mixin.width * item.progress;
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
            let size = this.calcDuration(item.start, item.stop) * this.calcData.range / this.calcData.range;
            return this.config.width * size;
        },
        /**
             * 改变range的大小 越大时间间隔越大 越小 时间间隔越小 最小到秒 最大到小时
             * @param a 变大还是缩小 in 变大 out 缩小
             */
        handleRange (a) {
            let newRange;
            if (a === 'in') {
                if (this.calcData.range >= 3600000) return;
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
                    '1800000': 3600000
                };
                newRange = rangeObj[this.calcData.range];
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
                    '3600000': 1800000
                };
                newRange = rangeObj[this.calcData.range];
            }
            this.$emit('updateRange', newRange);
            // 当range 变小时 为讲当前显示的局域保持在窗口内 需重设left的值
            let leftNum = -(this.cells[0] - this.calcData.min) / this.calcData.range * this.config.width;
            this.left.date = leftNum % this.width.date % this.config.width; // TODO: left.date
            this.left.content = leftNum;
            this.calcCells(this.cells[0]);
        },
        svgMouseUp () {
            let scrollBox = this.$refs.scroll;
            scrollBox.onmousemove = null;
        },
        calcY (dex) {
            let top = dex * this.config.height + this.config.space / 2;
            if (dex > 0) {
                // 每个任务之间都有 边框 top的距离要加上 边框的宽度
                top += dex;
            }
            return top;
        },
        /**
             * 任务进度条的 样式 尺寸
             * @param data 数据
             * @param dex 坐标
             * @returns {{fill: string}}
             */
        taskStyle () {
            return {
                fill: '#7777bb'
                // 'stroke-width': 1,
                // stroke: 'rgb(0,0,0)',
            };
        },
        // 时间线 移动事件
        timeLineMouseDown (e) {
            e.preventDefault();
            let box = this.$refs.svg;
            box.onmousemove = (event) => {
                event.preventDefault();
                this.line.x = event.offsetX;
            };
            box.onmouseup = () => {
                box.onmousemove = null;
            };
        },
        /* ------------------rect--------------------- */
        rectDoubleClick (row) {
            this.dialog.row = row;
            this.dialog.form.rangeDate = [new Date(row.start), new Date(row.stop)];
            // this.dialog.form.defaultRange = [row.start, row.stop];
            this.hideDialog(true);
        },
        hideDialog (show = false) {
            this.dialog.visible = show;
        },
        dialogSubmit () {
            let [start, end] = this.dialog.form.rangeDate;
            this.dialog.row.start = start;
            this.dialog.row.stop = end;
            if (!this.updated.find(item => item.index === this.dialog.row.index)) {
                this.updated.push(this.dialog.row);
            }
            if (moment(start).valueOf() < this.calcData.min) {
                this.$parent.dealData(this.data);
            }
            this.hideDialog();
        },
        /**
         * 进度条中 鼠标的移出事件
         * @param e
         * @param data
         */
        rectMouseOut (e) {
            e.target.style.cursor = 'default';
        },
        // 任务进度条 鼠标样式
        rectMouseMove (e, data) {
            if (e.offsetX - this.calcX(data.start) <= 5) {
                e.target.style.cursor = 'ew-resize';
            } else if (this.calcX(data.start) + data.mixin.width - e.offsetX <= 5) {
                e.target.style.cursor = 'e-resize';
            } else {
                e.target.style.cursor = 'default';
            }
        },
        // 任务进度条 拖拽事件
        rectMouseDown (data, dex, e) {
            let cursor = e.target.style.cursor;
            let diff = 0;
            let box = this.$refs.svg;
            switch (cursor) {
            // 向左拖拽
            case 'ew-resize':
                box.onmousemove = (event) => {
                    event.preventDefault();
                    if (data.mixin.width <= 5) return;
                    data.mixin.x = event.offsetX;
                    data.start = moment(event.offsetX * (this.calcData.range / this.config.width) + this.cells[0]).toISOString();
                    data.startTime = data.start;
                    console.log(data.start);
                    data.mixin.width = this.calculateWidth(data);
                    // data.mixin.width += dataX - event.offsetX;
                };
                box.onmouseup = () => {
                    // let pixed = this.calcData.range / this.config.width;
                    // 更新开始时间 和 总进度
                    // data.start = moment(data.mixin.x * pixed + this.calcData.min).toISOString();
                    // data.duration = (data.mixin.width / this.config.width).toFixed(1);
                    box.onmousemove = null;
                };
                break;
            case 'e-resize': // 向右拖拽
                box.onmousemove = (event) => {
                    event.preventDefault();
                    let dataX = data.mixin.width;
                    data.mixin.width += event.offsetX - dataX - data.mixin.x;
                };
                box.onmouseup = () => {
                    // 更新开始时间 和 总进度
                    let pixed = this.calcData.range / this.config.width;
                    data.stop = moment(data.mixin.x * pixed + this.calcData.min + data.mixin.width).toISOString();
                    data.duration = (data.mixin.width / this.config.width).toFixed(1);
                    box.onmousemove = null;
                };
                break;
            default:
                // box = this.$refs.svg;
                //  记录点击到任务进度条上的鼠标坐标
                box.onmousemove = (event) => {
                    event.preventDefault();
                    if (!diff) diff = e.offsetX - this.calcX(data.start);
                    // data.mixin.x = event.offsetX - diff;
                    data.start = moment((event.offsetX - diff) * this.calcData.range + this.cells[0]).toISOString();
                    data.startTime = data.start;
                };
                box.onmouseup = (event) => {
                    // let pixed = this.calcData.range / this.config.width;
                    // data.start = moment(data.mixin.x * pixed + this.calcData.min).toISOString();
                    if (!diff) diff = e.offsetX - this.calcX(data.start);
                    data.start = moment((event.offsetX - diff) * this.calcData.range + this.cells[0]).toISOString();
                    data.startTime = data.start;
                    box.onmousemove = null;
                };
            }
        },
        svgMouseMove (e) {
            if (e.offsetX <= 5) {
                e.target.style.cursor = 'col-resize';
            } else {
                e.target.style.cursor = 'default';
            }
        },
        svgMouseDown (e) {
            e.preventDefault();
            if (e.target.style.cursor === 'col-resize') {
                let box = document.querySelector('.gantt-container');
                box.onmousemove = (eve) => {
                    eve.stopPropagation();
                    let offsetX = eve.clientX;
                    this.$emit('updateRightStyle', offsetX);
                };
                box.onmouseup = () => {
                    this.calcContentBoxSize();
                    box.onmousemove = null;
                };
            }
        }
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
