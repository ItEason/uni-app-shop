<template>
  <view class="goods-item">
    <!-- 左侧盒子 -->
    <view class="goods-item-left">
      <radio :checked="item.goods_state" color="#c00000" v-if="showRadio" @click="Change"></radio>
      <img :src="item.goods_small_logo || defaultPic" class="goods-pic">
    </view>
    <!-- 右侧盒子 -->
    <view class="goods-item-right">
      <view class="goods-name">
        {{item.goods_name}}
      </view>
      <view class="goods-info-box">
        <view class="goods-price">
          ￥ {{item.goods_price | tofixed}}
        </view>
        <uni-number-box :min="1" :value="item.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      // 商品
      item: {
        type: Object,
        default: {}
      },
      // 控制单选框
      showRadio: {
        type: Boolean,
        default: false
      },
      // 控制是否显示Number-box
      showNum: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    data() {
      return {
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    methods: {
      Change() {
        this.$emit('radioChange', {
          goods_id: this.item.goods_id,
          goods_state: !this.item.goods_state
        })
      },
      numChangeHandler(val) {
        this.$emit('numChange', {
          goods_id: this.item.goods_id,
          goods_count: +val
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      display: flex;
      margin-right: 5px;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          color: #c00000;
          font-size: 16px;
        }
      }
    }
  }
</style>