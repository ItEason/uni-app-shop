<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio">
      <radio color="#c00000" :checked="ifFullCheck" @click="changeAllState" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">
      结算（{{checkedCount}}）
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {

      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkGoodsAmount']),

      // 判断是否为全部勾选
      ifFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 全选按钮取反
      changeAllState() {
        this.updateAllGoodsState(!this.ifFullCheck);
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 0 0 0 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>