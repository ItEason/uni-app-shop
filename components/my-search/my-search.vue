<template>
  <view class="my-search-container" :style="{'background-color': bgColor}" @click="searchHandler()">
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}">
      <!-- 使用uni-ui提供的图标组件 -->
      <icon type="search" size="17"></icon>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      // 背景颜色
      bgColor: {
        type: String,
        default: '#c00000',
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18, // px
      }
    },
    data() {
      return {
      };
    },
    methods: {
      searchHandler() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // background-color: #c00000;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .my-search-box {
      width: 100%;
      height: 36px;
      background-color: white;
      // border-radius: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;

      .placeholder {
        margin: 0 0 0 5px;
      }
    }
  }
</style>
