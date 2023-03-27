import store from "./store";

export default {
  namespaced: true,

  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  // 模块的 mutations 方法
  mutations: {
    // 添加商品方法
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const result = state.cart.find((item) => item.goods_id === goods.goods_id);

      if (!result) {
        // 如果购物车中没有这件商品，则直接 push
        state.cart.push(goods);
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        result.goods_count++;
      }

      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage');
    },
    // 购物车持久化方法
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart));
    },

    // 更新购物车中的商品状态
    updateGoodsState(state, goods) {
      const result = state.cart.find(item => item.goods_id === goods.goods_id);

      if (result) {
        result.goods_state = goods.goods_state;

        this.commit('m_cart/saveToStorage');
      }
    },

    // 更新商品的数量
    updateGoodsCount(state, goods) {
      const result = state.cart.find(item => item.goods_id === goods.goods_id);

      if (result) {
        result.goods_count = goods.goods_count;

        // 数据重新持久化存储
        this.commit('m_cart/saveToStorage');
      }
    },

    // 删除商品的方法
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id);

      // 数据重新持久化存储
      this.commit('m_cart/saveToStorage');
    }
  },

  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      let c = 0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    }
  }
}