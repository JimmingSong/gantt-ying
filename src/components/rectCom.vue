<style scoped lang='less'>
    .row {
        position: relative;
        width: 100%;
        &-box {
            position: relative;
            width: 100%;
            height: auto;
            border-bottom: 1px solid #4d4d4d;
            .row-range {
                position: absolute;
                top: 1.5px;
                background-color: #7777bb;
                border-radius: 3px;
            }
        }
    }
</style>

<template>
    <div class="row">
        <div :style="{height: config.height + 'px'}" class="row-box">
            <div :style="{width: item.mixin.width + 'px', left: item.mixin.x + 'px', height: config.height - 4 + 'px'}" class="row-range"></div>
        </div>
        <div v-show="item.expand">
            <rectCom v-for="(item, dex) in item.children" :key="dex" :item="item" :index="dex" :config="config" :expand-data="expandData"></rectCom>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rectCom',
    props: ['config', 'item', 'index', 'boxWidth', 'expandData'],
    methods: {
        calcY (dex) {
            if (this.expandData.index) {
                dex += this.expandData.length;
            }
            let top = dex * this.config.height + this.config.space * dex;
            if (dex === 0) {
                // 每个任务之间都有 边框 top的距离要加上 边框的宽度
                top = this.config.space / 2;
            } else if (dex > 0) {
                top += dex;
            }
            return top;
        },
        cutLineY (dex) {
            return this.calcY(dex) + this.config.height;
        }
    },
    created () {
        console.log(this.item);
    }
};
</script>
