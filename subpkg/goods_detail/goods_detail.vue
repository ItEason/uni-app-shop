<template>
  <view class="goods-detail-container" v-if="goods_info.goods_name">
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <img :src="item.pics_big_url" @click="preview(i)">
      </swiper-item>
    </swiper>

    <!-- 商品信息区域-->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">
        ￥{{goods_info.goods_price}}
      </view>
      <!-- 商品信息主体 -->
      <view class="goods-info-body">
        <!-- 商品名字 -->
        <view class="goods-name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏区域 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="transport_price">
        快递：免运费
      </view>
    </view>

    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件区域 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  export default {
    onLoad(options) {
      // 获取goods_id
      const goods_id = options.goods_id;
      // 调用获取数据的方法
      this.getGoodsDetail(goods_id);
    },
    data() {
      return {
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 2
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    methods: {
      // 请求goods_detail数据方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        });

        if (res.meta.status !== 200) return uni.$showMessage();

        // 使用字符串的 replace() 方法，将 webp 的后缀名替换为 jpg 的后缀名
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
          .replace(/webp/g, 'jpg')

        this.goods_info = res.message;
      },
      // 图片预览方法
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(item => item.pics_big_url)
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px 0 10px 10px;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        margin: 0 10px 0 0;
      }

      .favi {
        display: flex;
        width: 120px;
        font-size: 12px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .transport_price {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }

  .goods-detail-container {
    padding-bottom: 50px;
  }

  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>