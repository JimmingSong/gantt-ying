<style scoped lang="less">
    .row {
        position: relative;
        width: 100%;

        &-box {
            position: relative;
            width: 100%;
            height: auto;
            border-bottom: 1px solid #4d4d4d;

            .row-range {
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
                position: absolute;
                top: 1.5px;
                padding-left: 6px;
                background-color: #7777bb;
                border-radius: 3px;
                text-align: left;
                box-sizing: border-box;
                font-size: 12px;

                .triangle {
                    display: none;
                    position: absolute;
                    border: 6px solid transparent;
                    border-bottom-color: #4d4d4d;

                    .real-time {
                        display: none;
                    }

                    &:hover .real-time {
                        display: inline-block;
                        position: absolute;
                        top: -5px;
                        left: 130%;
                        z-index: 1100;
                        min-width: 120px;
                        font-size: 12px;
                    }
                }

                .triangle-left {
                    left: 0;
                    top: 100%;
                    transform: translate(-50%, -75%);
                }

                .triangle-right {
                    right: 0;
                    top: 100%;
                    transform: translate(50%, -75%);
                }
            }

            .draggable-row {
                &:hover .triangle {
                    display: inline;
                }
            }

            .row-detail-show {
                position: absolute;
                top: 100%;
                left: 5%;
                background: #ccc;
                border-radius: 5px;
                z-index: 1000;
                min-width: 100px;
            }
        }
    }
</style>

<template>
    <div class="row">
        <div :style="rangeBoxStyle" :class="['row-box', 'border-bottom-' + config.theme]">
            <div
                :style="rangeStyle"
                class="row-range"
                :class="draggable && 'draggable-row'"
                @dblclick="rangeClick(item)"
                @mousedown.prevent.self="draggable && rangeMove($event, item)"
                @mouseenter="rangeMouseEnter(item,$event)"
                @mouseleave="rangeMouseOut"
            >
                <i :style="triangleStyle" class="triangle triangle-left"
                    @mousedown.prevent.self="leftTrangleMove($event, item)"><span
                    class="real-time">{{realTimeStart}}</span></i>
                <span>{{ item[config.rangeField.text] }}</span>
                <i :style="triangleStyle" class="triangle triangle-right"
                   @mousedown.prevent.self="rightTrangleMove($event, item)"><span
                        class="real-time">{{realTimeStop}}</span></i>
                <div class="row-detail-show" v-if="config.detailOption.show && detailBox.rangeDetail">
                    <div v-for="(item, dex) in config.detailOption.field" :key="dex">
                        <span>{{item}}</span>
                        <span>{{currentRow[item]}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="item.expand">
            <rectCom
                    v-for="(children, dex) in item[config.field.children]"
                    :key="dex"
                    :item="children"
                    :index="dex"
                    :config="config"
                    :parent="item"
                    :selectedData="selectedData"
                    @rangeClick="rangeClick"
                    @updateSelectedData="updateSelectedData"
            ></rectCom>
        </div>
    </div>
</template>

<script>
    import moment from "moment";

    export default {
        name: "rectCom",
        inject: ["calcData", "getStart", "getEnd", "draggable"],
        props: [
            "config",
            "item",
            "index",
            "boxWidth",
            "parent",
            "selectedData",
            "selectedIndex"
        ],
        data() {
            return {
                currentRow: {},
                realTimeStart: '',
                realTimeStop: '',
                detailBox: {
                    rangeDetail: false,
                    left: 0,
                    top: 0
                }
            }
        },
        computed: {
            rangeBoxStyle() {
                let style = {
                    height: this.config.height + 'px'
                };
                if (this.item.selected) {
                    style.backgroundColor = this.selectedBgc ? this.selectedBgc : this.config.theme === 'dark' ? '#656464' : '#eee';
                }
                return style
            },
            rangeStyle() {
                return {
                    width: this.calculateWidth(this.item) + "px",
                    left: this.calculateX(this.item) + "px",
                    height: this.config.height - 4 + "px"
                };
            },
            triangleStyle() {
                return {
                    borderBottomColor: this.config.theme === 'light' ? '#4d4d4d' : '#999'
                }
            }
        },
        methods: {
            /**
             * 计算duration
             * @param start 开始时间
             * @param stop 结束时间
             */
            calcDuration(start, stop) {
                let duration = (moment(stop).valueOf() - moment(start).valueOf()) / this.calcData.range;
                return Math.floor(duration * 100) / 100;
            },
            /**
             * 计算宽度
             * @param item
             */
            calculateWidth(item) {
                let duration = this.calcDuration(this.getStart(item), this.getEnd(item));
                return this.config.width * duration;
            },
            /**
             * 计算 X 的坐标
             * @param item
             * @returns {number}
             */
            calculateX(item) {
                let diff = moment(this.getStart(item)).valueOf() - this.calcData.min;
                return (diff / this.calcData.range) * 200;
            },
            /** 拖拽区*/
            rangeClick(item) {
                item.expand = !item.expand;
                // this.$emit("rangeClick", item);
            },
            /**
             * @description: 拖拽交换任务的上下位置功能时 更新 需要的数据
             * @param item {Object}
             * @param index {Number}
             * @return:
             */
            updateSelectedData(item, index) {
                this.$emit("updateSelectedData", {item, index});
            },
            /**移动区 */
            /**
             * @description: 计算1px等于多少秒
             * @return: 1px等于多少毫秒
             */
            secondsPx() {
                return this.config.range / this.config.width;
            },
            /**
             * @description: 拖动进度块
             * @param e
             * @param data
             * @return:
             */
            rangeMove(e, data) {
                // 整个任务显示容器
                let scrollDom = document.querySelector('.right-box-range');
                // 获取 任务显示容器 在当前显示器显示区域的坐标
                let box = document.querySelector('.right-box-scroll');
                let boxOffset = box.getBoundingClientRect().left;
                let stop = this.config.field.stop;
                let start = this.config.field.start;
                scrollDom.onmousemove = (event) => {
                    // 获取鼠标在当前显示器显示区域的坐标
                    let mousePos = event.clientX;
                    // 进度条拖拽后的位置 = 鼠标位置 - 容器位置 - 鼠标在当前任务中的位置
                    let offsetX = mousePos - boxOffset - e.offsetX;
                    // 距离左边的坐标轴距离转换为时间戳
                    let seconds = this.secondsPx() * offsetX;
                    // 鼠标的坐标轴时间戳 + 最小时间戳 = 当前的任务的开始时间
                    let _start = seconds + this.calcData.min;
                    let rangWidth = e.target.clientWidth;
                    // 开始时间戳 + 任务条的宽度计算得来的时间戳 = 结束时间的时间戳
                    let _end = _start + rangWidth * this.secondsPx();
                    data[start] = moment(_start).format('YYYY/MM/DD HH:mm:ss');
                    data[stop] = moment(_end).format('YYYY/MM/DD HH:mm:ss');
                    e.target.style.left = offsetX + 'px';
                };
                scrollDom.onmouseup = () => {
                    // TODO: 需要更新 当前任务的 开始时间 + 结束时间
                    scrollDom.onmousemove = null;
                }
            },
            /**
             * @description: 调整进度快的 开始时间
             * @param e {type}
             * @param data {type}
             * @return:
             */
            leftTrangleMove(e, data) {
                /**
                 * @description: 如果存在子集且子集的开始时间小于修改后的父集的开始时间 则以父集的开始时间作为开始时间
                 * @param {Object} data 当前任务数据
                 * @param {Object} star 移动后得到的开始时间
                 * @return:
                 */
                let handleChildrenStart = (data, star) => {
                    // 如果存在子集且子集的开始时间小于修改后的父集的开始时间 则以父集的开始时间作为开始时间
                    let children = this.config.field.children;
                    data[children] && data[children].forEach(item => {
                        if (moment(item[start]).valueOf() < star) {
                            item[start] = moment(star).format('YYYY/MM/DD HH:mm:ss');
                        }
                        if (item[children] && item[children].length > 0) {
                            handleChildrenStart(item[children]);
                        }
                    });
                };
                // 整个任务显示容器
                let scrollDom = document.querySelector('.right-box-range');
                // 获取 任务显示容器 在当前显示器显示区域的坐标
                let box = document.querySelector('.right-box-scroll');
                let box_left = box.getBoundingClientRect().left;
                let parent = e.target.parentNode;
                let parent_left = parent.getBoundingClientRect().left;
                // 记录 当前任务模块的 终点位置 当left位置变化时 补上 宽度
                let endPos = parent_left + parent.clientWidth - box_left;
                let stop = this.config.field.stop;
                let start = this.config.field.start;
                scrollDom.onmousemove = (event) => {
                    let mousePos = event.clientX;
                    if (parent_left + parent.clientWidth - mousePos <= 5) return;
                    let boxOffset = box.getBoundingClientRect().left;// 获取容器在全视图中的定位
                    let res_left = mousePos - boxOffset; // 鼠标的坐标减去容器的x坐标 获得鼠标在容器中的x坐标
                    let diffResult = endPos - res_left; // 计算移动的差值
                    // 通过差值计算开始时间  结束时间没变 用结束时间减去开始时间
                    let seconds = this.secondsPx() * diffResult;
                    let star = moment(data[stop]).valueOf() - seconds;
                    this.realTimeStart = moment(star).format('YYYY/MM/DD HH:mm:ss');
                    // 如果拖拽子集后 子集的开始时间在所有子集中是最大的则父集的开始时间取子集的最大时间
                    if (this.parent[this.config.field.children]) {
                        let parentChildrenList = this.parent[this.config.field.children].slice();
                        let _parent = parentChildrenList.sort((a, b) => moment(a.start).valueOf() - moment(b.start).valueOf());
                        let minStart = _parent[0];
                        if (star <= moment(minStart.start).valueOf()) {
                            this.parent[start] = this.realTimeStart;
                        }
                    }
                    handleChildrenStart(data, star);
                    data[start] = moment(star).format('YYYY/MM/DD HH:mm:ss');
                    parent.style.left = res_left + 'px';
                    parent.style.width = endPos - res_left + 'px';
                };
                scrollDom.onmouseup = () => {
                    // // 需要更新 当前任务的 开始时间
                    // let mousePos = event.clientX;
                    // let boxOffset = box.getBoundingClientRect().left;
                    // let res_left = mousePos - boxOffset;
                    // let diffResult = endPos - res_left;
                    // let seconds = this.secondsPx() * diffResult;
                    // let star = moment(data[stop]).valueOf() - seconds;
                    // handleChildrenStart(data, star);
                    // data[start] = moment(star).format('YYYY/MM/DD HH:mm:ss');
                    scrollDom.onmousemove = null;
                    scrollDom.onmouseup = null;
                }
            },
            /**
             * @description: 调整进度快的结束时间
             * @param e {type}
             * @param data {Object}
             * @return:
             */
            rightTrangleMove(e, data) {
                let scrollDom = document.querySelector('.right-box-range');
                let parent = e.target.parentNode;
                let start = this.config.field.start;
                let stop = this.config.field.stop;
                scrollDom.onmousemove = (event) => {
                    let mousePos = event.clientX;
                    let box = document.querySelector('.right-box-scroll');
                    let boxOffset = box.getBoundingClientRect().left;
                    let width = mousePos - boxOffset - parent.style.left.replace('px', '');
                    let seconds = this.secondsPx() * parent.style.width.replace('px', '');
                    let end = moment(data[start]).valueOf() + seconds;
                    this.realTimeStop = moment(end).format('YYYY/MM/DD HH:mm:ss');
                    // 如果拖拽子集后 子集的开始时间在所有子集中是最大的则父集的开始时间取子集的最大时间
                    if (this.parent[this.config.field.children]) {
                        let parentChildrenList = this.parent[this.config.field.children].slice();
                        let _parent = parentChildrenList.sort((a, b) => moment(b.stop).valueOf() - moment(a.stop).valueOf());
                        let minStart = _parent[0];
                        if (end > moment(minStart.stop).valueOf()) {
                            this.parent[stop] = this.realTimeStop;
                        }
                    }
                    data[stop] = moment(end).format('YYYY/MM/DD HH:mm:ss');
                    parent.style.width = width + 'px';
                };
                scrollDom.onmouseup = () => {
                    scrollDom.onmousemove = null;
                    scrollDom.onmouseup = null;
                }
            },
            /**
             * @description: 鼠标移入事件 显示当前任务的详情面板 TODO:尚未完善
             * @param e {Object}
             * @param data {Object}
             * @return:
             */
            rangeMouseEnter(data, e) {
                this.currentRow = data;
                this.detailBox.rangeDetail = true;
                this.detailBox.left = e.offsetX;
                this.detailBox.top = e.offsetY;
                this.realTimeStart = data[this.config.field.start];
                this.realTimeStop = data[this.config.field.stop];
            },
            /**
             * @description: 鼠标移出事件  隐藏当前任务的详情面板
             * @param {type}
             * @return:
             */
            rangeMouseOut() {
                this.detailBox.rangeDetail = false;
            }
        }
    };
</script>
