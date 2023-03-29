<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <text class="tip-text">登陆后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo']),
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取用户的基本信息
      // 获取微信用户的基本信息
      getUserInfo(e) {
        // 判断是否获取用户信息成功
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        // console.log(e.detail.userInfo)

        // 3. 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo);

        // 获取登录成功后的 Token 字符串
        this.getToken(e.detail)
      },

      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err);

        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        console.log(res);

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query);

        // 直接把token保存到vuex中
        const token =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
        this.updateToken(token);

        // 判断 vuex 中的 redirectInfo 是否为 null
        if (this.redirectInfo !== null) this.navigateBack()
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面

      },
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    },

  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c55555;
    }

    .tip-text {}
  }
</style>