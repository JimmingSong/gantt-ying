<style scoped lang="less">
    .left-container {
        min-width: 150px;
        /*padding-bottom: 10px;*/
    }
    .gantt-left-table {
        height: 100%;
        background-color: transparent;
    }
    /deep/.row {
        cursor: pointer;
        background: transparent;
    }
    .gantt-table-cell {
        border-bottom-color: #4d4d4d;
        padding: 3px 0;
        /deep/ & >.cell {
            line-height: 21px !important;
        }
    }
    /deep/.row-expand-cover .el-table__expand-icon{
        display: none;
    }
    /deep/.gantt-left-table .el-table__body-wrapper{
        overflow-y: auto !important;
        overflow-x: scroll;
    }
    /deep/.gantt-left-table .el-table__empty-block {
        background: transparent;
    }
</style>

<template>
    <div class="left-container">
        <el-table
            ref="leftTable"
            class="gantt-left-table"
            :data="data"
            height="100%"
            border
            :indent="8"
            row-key="id"
            :header-row-style="{height: headerHeight}"
            :row-style="rowHeight"
            @expand-change="expandRow"
            :row-class-name="rowClassname"
            :cell-style="{padding: '0'}"
            cell-class-name="gantt-table-cell"
            :header-cell-style="{padding: '3px 0'}"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            style="width: 100%">
            <el-table-column
                v-for="(item, dex) in config.menu"
                :key="dex"
                header-align="center"
                :prop="item.prop"
                :label="item.text">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'leftCom',
    props: ['data', 'config'],
    data () {
        return {
            leftBaseData: this.data
        };
    },
    computed: {
        headerHeight () {
            return this.config.headerHeight + 'px';
        },
        rowClassname () {
            if (this.config.childIsShow) {
                return 'row';
            }
            return 'row-expand-cover';
        }
    },
    methods: {
        scrollEvent (top) {
            let table = this.$refs.leftTable;
            table.$el.querySelector('.el-table__body-wrapper').scroll(0, top);
        },
        rowClick (row) {
            this.$emit('rowClick', row);
        },
        rowDbClick (row) {
            this.$emit('rowDbClick', row.index);
        },
        rowHeight () {
            return `height: ${this.config.height}px`;
        },
        expandRow (row, expanded) {
            row.expand = expanded;
            this.$emit('expandRow', row);
        }
    },
    mounted () {
        this.$nextTick().then(() => {
            let table = this.$refs.leftTable.$el.querySelector('.el-table__body-wrapper');
            table.addEventListener('scroll', () => {
                let scrollTop = table.scrollTop;
                this.$emit('leftScrollEvent', scrollTop);
            });
        });
    }
};
</script>
