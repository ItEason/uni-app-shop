<template>
  <view>
    <view class="search-box">
      <my-search @click="toSearch()"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <img :src="item.image_src" alt="blank">
        </navigator>
      </swiper-item>
    </swiper>
    <!--  -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i">
        <img :src="item.image_src" alt="blank" class="nav-img">
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <img :src="item.floor_title.image_src" alt="blank" class="floor-title">
        <!-- 楼层的图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <img :src="item.product_list[0].image_src" alt="blank"
              :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix">
          </navigator>
          <!-- 右侧4个小图片盒子 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2"
              v-if="i2 !== 0">
              <img :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" alt="blank" mode="widthFix">
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: [],
      };
    },
    onLoad() {
      this.getSwiperList();
      this.getNavList();
      this.getFloorList();
    },
    methods: {
      // 获取首页轮播图数据方法
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata');
        if (res.meta.status !== 200) return uni.$showMessage();
        this.swiperList = res.message;
      },
      // 获取导航栏数据
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems');
        if (res.meta.status !== 200) return uni.$showMessage();
        this.navList = res.message;
      },
      // 获取楼层数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMessage();

        // 对数据进行处理
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
          })
        })
        this.floorList = res.message;
      },
      toSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }

  swiper {
    height: 300rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-item {
    .floor-title {
      width: 100%;
      height: 60rpx;
    }

    .floor-img-box {
      display: flex;
      padding: 0 0 0 10rpx;
      justify-content: space-around;

      .right-img-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    }
  }
</style>