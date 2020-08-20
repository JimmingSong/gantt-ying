<style scoped lang="less">
.left-container {
  min-width: 150px;
  display: flex;
  .left-heade {
    text-align: center;
    height: 29px;
    line-height: 30px;
  }
  .left-heade-dark {
    border-bottom: 1px solid #4d4d4d;
  }

  .left-content {
    height: calc(100% - 30px);
    overflow-y: auto;
    overflow-x: scroll;
  }
}

// .gantt-left-table {
//     height: 100%;
//     background-color: transparent;
// }
// /deep/.row {
//     cursor: pointer;
//     background: transparent;
// }
// .gantt-table-cell {
//     border-bottom-color: #4d4d4d;
//     padding: 3px 0;
//     /deep/ & >.cell {
//         line-height: 21px !important;
//     }
// }
// /deep/.row-expand-cover .el-table__expand-icon{
//     display: none;
// }
// /deep/.gantt-left-table .el-table__empty-block {
//     background: transparent;
// }
</style>

<template>
  <div :class="['left-container', 'border-right-' + config.theme]">
    <div
      class="left-body"
      v-for="(item, index) in menu"
      :key="index"
      :style="{ width: 100 / config.menu.length + '%' }"
    >
      <div :class="['left-heade', 'border-bottom-' + config.theme]">
        <span>{{ item.text }}</span>
      </div>
      <div class="left-content left-content-gantt-ying" ref="content">
        <leftTable
          v-for="(doc, dex) in data"
          :key="dex"
          :data="doc"
          :dataDex="dex"
          :index="index"
          :config="config"
          :value="item.prop"
          :parent="data"
          :selectedBgc='selectedBgc'
          @rowClick="rowClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import leftTable from "./leftTable";

export default {
  name: "leftCom",
  props: ["data", "config", "expandRowKeys", "selectedBgc", "menu"],
  data() {
    return {
      preData: {},
      curData: {}
    };
  },
  computed: {
    arrowClass() {
      return this.data.expand
        ? "el-icon-arrow-right arrow arrow-open"
        : "el-icon-arrow-right arrow arrow-close";
    },
    headerHeight() {
      return this.config.headerHeight + "px";
    },
    rowClassname() {
      if (this.config.showChildren) {
        return "row";
      }
      return "row-expand-cover";
    }
  },
  methods: {
    expandClick(data) {
      data.expand = !data.expand;
    },

    scrollEvent(top) {
      let table = this.$refs.content;
      table[0].scroll(0, top);
    },
    rowClick(row) {
      if (Object.keys(this.curData).length > 0) {
        this.curData.selected = false;
        this.preData = this.curData;
      }
      this.curData = row;
      row.selected = true;
      this.$emit("rowClick", row);
    },
    rowDbClick(row) {
      this.$emit("rowDbClick", row.index);
    },
    rowHeight() {
      return `height: ${this.config.height}px`;
    },
    expandRow(row, expanded) {
      row.expand = expanded;
      if (row.expand) {
        this.$emit("updateExpandRowKeys", row.id);
      }
      this.$emit("expandRow", row);
    }
  },
  mounted () {
      this.$nextTick().then(() => {
        let table = document.querySelector('.left-content-gantt-ying');
          table.addEventListener('scroll', () => {
            let scrollTop = table.scrollTop;
            this.$emit('leftScrollEvent', scrollTop);
          });
      });
  },
  components: { leftTable }
};
</script>
