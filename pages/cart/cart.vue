<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>

    <!-- 商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 右侧文本 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 循环渲染购物车商品信息 -->
    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :item="goods" :showRadio="true" :showNum="true" @radioChange="radioChangeHandler"
            @numChange="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 结算组件 -->
    <my-settle></my-settle>
  </view>

  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <img src="/static/cart_empty@2x.png" class="empty-img">
    <text class="tip-title">空空如也</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'

  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 单选框改变方法
      radioChangeHandler(e) {
        this.updateGoodsState(e);
      },
      // 商品数修改方法
      numberChangeHandler(e) {
        this.updateGoodsCount(e);
      },
      // 滑动删除点击事件
      swipeItemClickHandler(goods) {
        this.removeGoodsById(goods.goods_id);
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding: 0 0 50px 0;

    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 0 0 5px;
      border-bottom: 1px solid #efefef;

      .cart-title-text {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 150px 0 0 0;
    .empty-img {
      width: 90px;
      height: 90px;
      
    }

    .tip-title {
      font-size: 12px;
      color: gray;
      margin: 15px 0 0 0;
    }
    
  }
</style>