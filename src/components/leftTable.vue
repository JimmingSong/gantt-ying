<!--
 * @Author: your name
 * @Date: 2020-02-20 16:21:22
 * @LastEditTime: 2020-02-23 21:08:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \gantt-ying\src\components\tree.vue
 -->
 <style lang="less">
    .table-box {
        .table-row {
            height: 21px;
            border-bottom: 1px solid #EBEEF5;
            cursor: default;
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
        <div class="table-row"
        :style="styleField"
        @click="rowClick(data)"
        >
            <i
            :style="{visibility: data.children && data.children.length > 0 && index === 0 ? 'visible' : 'hidden'}"
            :class="arrowClass"
            @click.stop="expandClick"></i>
            <span>{{data[value]}}</span>
        </div>
        <div v-if="config.showChildren && data.expand">
            <leftTable
            v-for="(doc, dex) in data.children"
            :key="dex"
            :index='index'
            :value='value'
            :isChild='true'
            :config='config'
            :parent='data.children'
            @rowClick='rowClick'
            :data='doc' />
        </div>
     </div>
 </template>

<script>
export default {
    name: 'leftTable',
    props: ['config', 'data', 'parent', 'value', 'dataDex', 'index', 'isChild'],
    computed: {
        arrowClass () {
            return this.data.expand ? 'el-icon-arrow-right arrow arrow-open' : 'el-icon-arrow-right arrow arrow-close'
        },
        styleField () {
            let style = {paddingLeft: this.isChild ? '10px' : '0'};
            if (this.data.selected) {
                style.backgroundColor = '#eee';
            }
            return style;
        },
    },
    methods: {
        expandClick () {
            this.data.expand = !this.data.expand;
        },
        rowClick (data) {
            data.selected = true;
            let updateSelected = (parent) => {
                parent.forEach((item, dex) => {
                    if (dex !== this.dataDex) {
                        item.selected = false;
                    }
                    if (item.children && item.children.length > 0) {
                        updateSelected(item.children);
                    }
                });
            };
            // this.parent.forEach((item, dex) => {
            //     if (dex !== this.dataDex) {
            //         item.selected = false;
            //     }
            // });
            updateSelected(this.parent);
            this.$emit('rowClick', data)
        }
    }
}
</script>
