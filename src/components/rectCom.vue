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
                .ellipsis;
                position: absolute;
                top: 1.5px;
                padding-left: 3px;
                background-color: #7777bb;
                border-radius: 3px;
                text-align: left;
                box-sizing: border-box;
                font-size: 12px;
            }
        }
    }
</style>

<template>
    <div class="row">
        <div :style="{height: config.height + 'px'}" class="row-box">
            <div :style="rangeStyle" class="row-range">
                <span>{{item.name}}</span>
            </div>
        </div>
        <div v-show="item.expand">
            <rectCom v-for="(item, dex) in item.children" :key="dex" :item="item" :index="dex" :config="config" :expand-data="expandData"></rectCom>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: 'rectCom',
    inject: ['calcData'],
    props: ['config', 'item', 'index', 'boxWidth', 'expandData'],
    computed: {
        rangeStyle () {
            return {
                width: this.calculateWidth(this.item) + 'px',
                left: this.calculateX(this.item) + 'px',
                height: this.config.height - 4 + 'px'
            };
        }
    },
    methods: {
        /**
         * 计算duration
         * @param start 开始时间
         * @param stop 结束时间
         */
        calcDuration (start, stop) {
            let duration = (moment(stop).valueOf() - moment(start).valueOf()) / this.calcData.range;
            return Math.floor(duration * 100) / 100;
        },
        /**
         * 计算宽度
         * @param item
         */
        calculateWidth (item) {
            let duration = this.calcDuration(item.start, item.stop);
            // let size = item.duration;
            return this.config.width * duration;
        },
        /**
         * 计算 X 的坐标
         * @param item
         * @returns {number}
         */
        calculateX (item) {
            let diff = moment(item.start).valueOf() - this.calcData.min;
            return diff / this.calcData.range * 200;
        }
    }
};
</script>
