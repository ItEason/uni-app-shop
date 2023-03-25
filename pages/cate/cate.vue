<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <my-search @click="toSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', active === i ? 'active' : '' ]" @click="changeIndex(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <!-- 二级分类结构 -->
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">
            / {{item2.cat_name}} /
          </view>
          <!-- 动态渲染三级分类的列表是数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的item项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="linkTo(item3.cat_id)">
              <!-- 三级分类的图片 -->
              <img :src="item3.cat_icon.replace('dev', 'web')">
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    onLoad() {
      // 获取设备屏幕可用区域
      const screen = uni.getSystemInfoSync();
      // 对数据进行赋值
      this.wh = screen.windowHeight - 50;
      // 调用方法获取数据
      this.getCateList();
    },
    data() {
      return {
        // 当前设备可用的高度
        wh: 0,
        // cate数据数组
        cateList: [],
        // 控制左侧scroll当前激活的状态变量
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        // 控制level3自动返回顶部
        scrollTop: 0
      };
    },
    methods: {
      // 获取cate页面的全部数据
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories');
        if (res.meta.status !== 200) return uni.$showMessage();
        this.cateList = res.message;
        // 给cateLevel2进行初始化赋值
        this.cateLevel2 = res.message[0].children;
      },
      // 动态修改左侧索引值
      changeIndex(i) {
        this.active = i;
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children;
        
        this.scrollTop = this.scrollTop === 0 ? 1 : 0;
      },
      // 动态前往goods_list页面
      linkTo(cid) {
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + cid
        })
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
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          position: relative;
          background-color: #ffffff;

          &::before {
            position: absolute;
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background-color: #c00;
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: blod;
      text-align: center;
      padding: 15px 0;
    }
    
    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;
      
      .cate-lv3-item {
        display: flex;
        width: 33.33%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0 10px 0;
        
        img {
          width: 60px;
          height: 60px;
        }
        
        text {
          font-size: 12px;
        }
      }
    }
  }
</style>
