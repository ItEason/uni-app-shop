<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @confirm="search" :focus="true" @input="input" radius="100" cancel-button="none">
      </uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchList.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchList" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="forward" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="16" @click="clearHistory()"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag class="tap" :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodslList(item)">
        </uni-tag>
      </view>
    </view>
  </view>


</template>

<script>
  export default {
    onLoad() {
      // 获取本地的搜索历史
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
    },
    data() {
      return {
        // 延时器的 timerID
        timer: null,
        // 搜索关键词
        searchValue: '',
        // 搜索结果
        searchList: [],
        // 搜索历史
        historyList: []
      };
    },
    computed: {
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        return [...this.historyList].reverse()
      }
    },
    methods: {
      // 搜索框input输入事件
      input(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.searchValue = e;
          this.getSearchList();
        }, 500)
      },
      gotoDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
        })
      },
      // 点击跳转到商品列表页面
      gotoGoodslList(item) {
        uni.navigateTo({
          url: "/subpkg/goods_list/goods_list?query=" + item
        })
      },
      search() {

      },
      // 保存搜索历史内容方法
      saveSearchHistory() {
        // 1. 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        // 2. 调用 Set 对象的 delete 方法，移除对应的元素
        set.delete(this.searchValue)
        // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
        set.add(this.searchValue)
        // 4. 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        // 将搜索内容持久化到本地
        uni.setStorageSync('searchValue', JSON.stringify(this.historyList));
      },
      // 清除历史搜索内容方法
      clearHistory() {
        this.historyList = [];
        uni.removeStorageSync("searchValue");
      },
      // 获取搜索信息方法
      async getSearchList() {
        // 判读搜索关键词是否为空
        if (this.searchValue === '') {
          this.searchList = [];
          return;
        }
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.searchValue
        })
        if (res.meta.status !== 200) return uni.$showMessage();
        this.searchList = res.message;

        this.saveSearchHistory();
      },
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      justify-content: space-between;

      .goods-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 3px 0 0;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .tap {
        margin: 5px 5px 0 0;
      }
    }
  }
</style>