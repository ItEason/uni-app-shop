<template>
  <view>
    <view class="goods-list">
      <!-- 点击商品跳转到goods_detail页面 -->
      <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
        <my-goods :item="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键字
          query: '',
          // 商品分类id
          cid: '',
          // 页码值,
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品数据
        goodsList: [],
        // 总数据数
        total: 0,
        // 是否正在请求数据
        isloading: false
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || '';
      this.queryObj.cid = options.cid || '';
      this.getGoodsList();
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        // ** 打开节流阀
        this.isloading = true
        // 请求数据
        const {
          data: res
        } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)

        // ** 关闭节流阀
        this.isloading = false
        // 先作判断是否存在cb函数
        if (cb) {
          cb();
        }

        if (res.meta.status !== 200) return uni.$showMessage();

        this.goodsList = [...this.goodsList, ...res.message.goods];
        this.total = res.message.total
      },
      // 跳转到goods_details页面
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    // 上滑加载更多
    onReachBottom() {
      // 判断是否还有下一页数据
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMessage('数据加载完毕！')

      // 判断是否正在请求其它数据，如果是，则不发起额外的请求
      if (this.isloading) return
      // 让页码加一
      this.queryObj.pagenum += 1;
      // 重新获取列表
      this.getGoodsList();
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 初始化对应的参数
      this.queryObj.pagenum = 1;
      this.total = 0
      this.isloading = false
      this.goodsList = []

      // 重新获取数据
      this.getGoodsList(() => uni.stopPullDownRefresh());
    }
  }
</script>

<style lang="scss">

</style>