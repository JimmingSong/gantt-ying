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
            border:6px solid transparent;
            border-bottom-color: #4d4d4d
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
    <div :style="{ height: config.height + 'px' }" class="row-box">
      <div
        :style="rangeStyle"
        class="row-range"
        @click="rangeClick(item)"
        draggable
        @dragstart="rangeDragStart(item, index, $event)"
        @dragover.prevent="rangeDragOver"
        @drop="rangeDrop(item, index)"
        @mousedown.prevent.self="rangeMove"
        @mouseenter="rangeMouseEnter(item,$event)"
        @mouseleave="rangeMouseOut"
      >
        <i class="triangle triangle-left" @mousedown.prevent="leftTrangleMove"></i>
        <span>{{ item[config.rangeField.text] }}</span>
        <i class="triangle triangle-right" @mousedown.prevent="rightTrangleMove"></i>
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
        :parent="children"
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
  inject: ["calcData", "getStart", "getEnd"],
  props: [
    "config",
    "item",
    "index",
    "boxWidth",
    "parent",
    "selectedData",
    "selectedIndex"
  ],
  data () {
      return {
          currentRow: {},
          detailBox: {
              rangeDetail: false,
              left: 0,
              top: 0
          }
      }
  },
  computed: {
    rangeStyle() {
      return {
        width: this.calculateWidth(this.item) + "px",
        left: this.calculateX(this.item) + "px",
        height: this.config.height - 4 + "px"
      };
    }
  },
  methods: {
    /**
     * 计算duration
     * @param start 开始时间
     * @param stop 结束时间
     */
    calcDuration(start, stop) {
      let duration =
        (moment(stop).valueOf() - moment(start).valueOf()) /
        this.calcData.range;
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
      this.$emit("rangeClick", item);
    },
    updateSelectedData(item, index) {
      this.$emit("updateSelectedData", { item, index });
    },
    rangeDragStart(item, index) {
      this.updateSelectedData(item, index);
    },
    rangeDragOver() {},
    rangeDrop(item, index) {
      if (this.selectedIndex < 0) return;
      this.parent.splice(index, 1, this.selectedData);
      this.parent.splice(this.selectedIndex, 1, item);
    },
    /**移动区 */
    /**
     * @description: 拖动进度块
     * @param {type} 
     * @return: 
     */
    rangeMove (e) {
        // 整个任务显示容器
        let scrollDom = document.querySelector('.right-box-range');
        scrollDom.onmousemove = (event) => {
            // 获取鼠标在当前显示器显示区域的坐标
            let mousePos = event.clientX;
            // 获取 任务显示容器 在当前显示器显示区域的坐标
            let box = document.querySelector('.right-box-scroll');
            let boxOffset = box.getBoundingClientRect().left;
            // 进度条拖拽后的位置 = 鼠标位置 - 容器位置 - 鼠标在当前任务中的位置
            e.target.style.left = mousePos -  boxOffset - e.offsetX + 'px';
        }
        scrollDom.onmouseup = () => {
            // TODO: 需要更新 当前任务的 开始时间 + 结束时间
            scrollDom.onmousemove = null;
        }
    },
    /**
     * @description: 调整进度快的 开始时间
     * @param {type} 
     * @return: 
     */
    leftTrangleMove (e) {
        // 整个任务显示容器
        let scrollDom = document.querySelector('.right-box-range');
        // 获取 任务显示容器 在当前显示器显示区域的坐标
        let box = document.querySelector('.right-box-scroll');
        let box_left = box.getBoundingClientRect().left;
        let parent = e.target.parentNode;
        // 记录 当前任务模块的 终点位置 当left位置变化时 补上 宽度
        let endPos = parent.getBoundingClientRect().left + parent.clientWidth - box_left;
        scrollDom.onmousemove = (event) => {
            let mousePos = event.clientX;
            let boxOffset = box.getBoundingClientRect().left;
            let res_left = mousePos - boxOffset;
            parent.style.left = res_left + 'px';
            parent.style.width = endPos - res_left + 'px';
        }
        scrollDom.onmouseup = () => {
            // TODO: 需要更新 当前任务的 开始时间
            scrollDom.onmousemove = null;
        }
    },
    /**
     * @description: 调整进度快的结束时间
     * @param {type} 
     * @return: 
     */
    rightTrangleMove (e) {
        let scrollDom = document.querySelector('.right-box-range');
        let parent = e.target.parentNode;
        scrollDom.onmousemove = (event) => {
            let mousePos = event.clientX;
            let box = document.querySelector('.right-box-scroll');
            let boxOffset = box.getBoundingClientRect().left;
            parent.style.width = mousePos - boxOffset - parent.style.left.replace('px', '') + 'px';
        }
        scrollDom.onmouseup = () => {
            // TODO: 需要更新 当前任务的 结束时间
            scrollDom.onmousemove = null;
        }
    },
    /**
     * @description: 鼠标移入事件 显示当前任务的详情面板 TODO:尚未完善
     * @param data {Object}
     * @return: 
     */
    rangeMouseEnter (data, e) {
        this.currentRow = data;
        this.detailBox.rangeDetail = true;
        this.detailBox.left = e.offsetX;
        this.detailBox.top = e.offsetY;
    },
    /**
     * @description: 鼠标移出事件  隐藏当前任务的详情面板
     * @param {type} 
     * @return: 
     */
    rangeMouseOut () {
        this.detailBox.rangeDetail = false;
    }
  }
};
</script>
