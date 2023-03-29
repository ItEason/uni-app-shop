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
    <view class="btn-settle" @click="settlement">
      结算（{{checkedCount}}）
    </view>
  </view>

</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkGoodsAmount']),
      ...mapGetters('m_user', ['wholeAddress']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 判断是否为全部勾选
      ifFullCheck() {
        return this.total === this.checkedCount
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      // 把 m_user 模块中的 updateRedirectInfo 方法映射到当前页面中使用
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // 全选按钮取反
      changeAllState() {
        this.updateAllGoodsState(!this.ifFullCheck);
      },
      // 结算判断方法
      settlement() {
        if (!this.checkedCount) return uni.$showMessage("请选择要结算的商品!");
        console.log(this.wholeAddress);
        if (!this.wholeAddress) return uni.$showMessage("请选择收获地址!");

        if (!this.token) return this.delayNavigate();

        // 4. 实现微信支付功能
        this.payOrder()
      },
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.wholeAddress,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMessage('创建订单失败！')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number

        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        
        console.log(res2);
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showMessage('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
      },

      // 延迟导航到 my 页面
      delayNavigate() {
        this.showTips(this.seconds)

        // 1. 将定时器的 Id 存储到 timer 中
        this.timer = setInterval(() => {
          this.seconds--

          // 2. 判断秒数是否 <= 0
          if (this.seconds <= 0) {
            // 2.1 清除定时器
            clearInterval(this.timer)

            // 2.2 跳转到 my 页面
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })

            // 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }

          this.showTips(this.seconds)
        }, 1000)
      },

      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          mask: true,
          duration: 1500
        })
      },
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