<style scoped lang="less">
    .left-container {
        min-width: 200px;
    }
    .left-table {
        height: 100%;
    }
    /deep/.left-table td,/deep/.left-table th {
        padding: 0;
    }
    /deep/.row {
        cursor: pointer;
    }
    /deep/.row-expand-cover .el-table__expand-icon{
        display: none;
    }
</style>

<template>
    <div class="left-container" @mouseout.self="leftBoxOut($event)" @mousemove.self="svgMouseMove($event)" @mousedown.self="svgMouseDown($event)">
        <el-table
            class="left-table"
            :data="leftBaseData"
            height="100%"
            border
            :indent="8"
            row-key="id"
            :header-row-style="{height: headerHeight}"
            :row-style="rowHeight"
            @expand-change="expandRow"
            :row-class-name="rowClassname"
            :cell-style="{padding: '3px 0 4px 0'}"
            :header-cell-style="{padding: '3px 0'}"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            style="width: 99%">
            <el-table-column
                v-for="(item, dex) in config.menu"
                :key="dex"
                :fixed="dex === 0"
                :min-width="startTimeColumnWidth(item)"
                :prop="item.prop"
                align="center"
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
            return this.config.height + 'px';
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
            document.querySelector('.el-table__fixed-body-wrapper').scroll(0, top);
        },
        rowClick (row) {
            this.$emit('rowClick', row.index);
        },
        rowDbClick (row) {
            this.$emit('rowDbClick', row.index);
        },
        startTimeColumnWidth (item) {
            return item.prop === 'start_date' ? '200' : '100';
        },
        rowHeight () {
            return `height: ${this.config.height + 1}px`;
            // console.log(row, rowIndex);
        },
        leftBoxOut (e) {
            e.target.style.cursor = 'default';
        },
        svgMouseMove (e) {
            e.preventDefault();
            if (e.target.clientWidth - e.offsetX <= 2) {
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
                    eve.preventDefault();
                    let boxX = box.getBoundingClientRect().left;
                    let offsetX = eve.clientX - boxX;
                    this.$emit('updateRightStyle', offsetX);
                };
                box.onmouseup = () => {
                    this.$emit('calcContentBoxSize');
                    box.onmousemove = null;
                };
            }
        },
        expandRow (row, expanded) {
            row.expand = expanded;
            this.$emit('expandRow', row);
        }
    },
    mounted () {
        this.$nextTick().then(() => {
            let box = document.querySelector('.el-table__fixed-body-wrapper');
            console.log(box);
            box.addEventListener('scroll', () => {
                let scrollTop = box.scrollTop;
                this.$emit('leftScrollEvent', scrollTop);
            })
        })
        
    }
};
</script>
