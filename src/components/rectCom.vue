<style scoped lang='less'>

</style>

<template>
    <div class="row">
        <div :style="{height: config.height + 'px'}" class="row-box">
            <div
                :style="rangeStyle(item)"
                class="row-range">
                <span>{{item.text}}</span>
            </div>
        </div>
        <div v-show="item.expand">
            <rectCom
                v-for="(item, dex) in item.children"
                :key="dex"
                :item="item"
                :index="dex"
                :config="config"
                :rangeColor="rangeColor"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'rectCom',
    props: ['config', 'item', 'index', 'boxWidth', 'rangeColor'],
    methods: {
        rangeStyle (item) {
            return {
                width: item.mixin.width + 'px',
                left: item.mixin.x + 'px',
                height: this.config.height - 4 + 'px',
                backgroundColor: this.rangeColor,
                textAlign: 'left'
            }
        }
    }
};
</script>
