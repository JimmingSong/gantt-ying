<!--
 * @Author: your name
 * @Date: 2020-02-20 16:21:22
 * @LastEditTime: 2020-03-05 22:21:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gantt-ying\packages\ganttYing\tree.vue
 -->
<style lang="less">
    .table-box {
        .table-row {
            height: 21px;
            cursor: default;
        }

        .table-row-light {
            border-bottom: 1px solid #ebeef5;
        }

        .table-row-dark {
            border-bottom: 1px solid #4d4d4d;
        }
    }

    .arrow {
        transition: transform 100ms linear;
    }

    .arrow-open {
        transform: rotateZ(90deg);
    }

    .arrow-close {
        transform: rotateZ(0deg);
    }
</style>
<template>
    <div class="table-box">
        <div :class="['table-row',config.theme === 'dark' ? 'table-row-dark' : 'table-row-light']"
            :style="styleField"
            @click="rowClick(data)"
        >
            <i
                :style="{visibility: config.showChildren && data.children && data.children.length > 0 && !index? 'visible': 'hidden'}"
                :class="arrowClass"
                @click.stop="expandClick"
            ></i>
            <span>{{ data[value] }}</span>
        </div>
        <div v-if="config.showChildren && data.expand">
            <leftTable
                    v-for="(doc, dex) in data.children"
                    :key="dex"
                    :index="index"
                    :value="value"
                    :isChild="true"
                    :config="config"
                    :deep="deep + 1"
                    :parent="data.children"
                    @rowClick="rowClick"
                    :data="doc"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "leftTable",
    props: {
        // 配置文件
        config: {},
        // 数据源
        data: {},
        // 父节点的数据
        parent: {},
        // 用来显示的数据的属性
        value: {},
        // 当前数据的下标
        dataDex: {},
        // 当前是第几列 左边表格是可以展示多列的
        index: {},
        // 是否是子节点
        isChild: {},
        selectedBgc: {},
        deep: {
            type: Number,
            default: 0
        }
    },
    // props: ["config", "data", "parent", "value", "dataDex", "index", "isChild", "selectedBgc"],
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
        styleField() {
            let style = {paddingLeft: this.isChild ? this.deep * this.config.indent + "px" : "0"};
            if (this.data.selected) {
                style.backgroundColor = this.selectedBgc ? this.selectedBgc : this.config.theme === 'dark' ? '#656464' : '#eee';
            }
            return style;
        }
    },
    methods: {
        expandClick() {
            this.data.expand = !this.data.expand;
        },
        rowClick(data) {
            this.$emit("rowClick", data);
        }
    }
};
</script>
