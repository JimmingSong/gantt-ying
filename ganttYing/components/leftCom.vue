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
    overflow-y: hidden;
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
      v-for="(item, index) in config.menu"
      :key="index"
      :style="{ width: 100 / config.menu.length + '%' }"
    >
      <div :class="['left-heade', 'border-bottom-' + config.theme]">
        <span>{{ item.text }}</span>
      </div>
      <div class="left-content" ref="content">
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

    <!-- <el-table
                ref="leftTable"
                class="gantt-left-table"
                :data="data"
                height="100%"
                border
                :indent="8"
                row-key="id"
                :expand-row-keys='expandRowKeys'
                :default-expand-all='config.expandAll'
                :header-row-style="{height: headerHeight}"
                :row-style="rowHeight"
                @expand-change="expandRow"
                :row-class-name="rowClassname"
                :cell-style="{padding: '0'}"
                cell-class-name="gantt-table-cell"
                :header-cell-style="{padding: '3px 0'}"
                @row-click="rowClick"
                :tree-props="{children: config.field.children, hasChildren: config.expand}"
                @row-dblclick="rowDbClick"
                style="width: 100%">
                <el-table-column
                    v-for="(item, dex) in config.menu"
                    :key="dex"
                    header-align="center"
                    show-overflow-tooltip
                    :prop="item.prop"
                    :label="item.text">
                </el-table-column>
            </el-table> -->
  </div>
</template>

<script>
import leftTable from "./leftTable";

export default {
  name: "leftCom",
  props: ["data", "config", "expandRowKeys", "selectedBgc"],
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
  components: { leftTable }
};
</script>
