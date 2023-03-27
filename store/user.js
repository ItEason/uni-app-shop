export default {
  // 开启命名空间
  namespaced: true,

  // 数据
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),

  // 方法
  mutations: {
    // 更新用户收获地址方法
    updateAddress(state, address) {
      state.address = address;

      this.commit('m_user/saveAddressToStorage');
    },
    // 将收获地址持久化的方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address));
    }
  },

  // 辅助方法
  getters: {
    wholeAddress(state) {
      if (state.address !== null) {
        return '' + state.address.provinceName + state.address.cityName + state.address.countyName + state.address
          .detailInfo
      }
      return '';
    }
  }
}