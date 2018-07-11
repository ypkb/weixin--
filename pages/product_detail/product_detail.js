// pages/product_detail/product_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: null,
    showCartDetail: false,
    cartinfo: null

  },
  checkout: function (e) {
    let disabled = e.currentTarget.dataset.disabled
    if (!disabled) {
      wx.navigateTo({
        url: '../checkout/checkout',
      })
    }
  },
  toggleCartDetail: function (e) {
    let target = e.currentTarget;
    if (!this.data.cartinfo.totalPrice) return false
    if (!target.dataset.expandCartDetail) {
      this.setData({
        showCartDetail: true
      })
    }
    else {
      this.setData({
        showCartDetail: false
      })
    }
  },
  removeAll: function () {
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定删除所有果切？',
      success: function (res) {
        if (res.confirm) {
          let cartinfo = self.data.cartinfo
          let product = self.data.product
          for (let k in cartinfo.products) {
            cartinfo.products[k].num = 0
          }
          product.num = 0
          self.setData({
            cartinfo: cartinfo,
            product: product
          })
          self.computePrice()
          wx.setStorageSync('cartinfo', self.data.cartinfo)
        }
      }
    })
  },
  computePrice: function () {
    let cartinfo = this.data.cartinfo
    let tempProducts = cartinfo.products, sum = 0.0
    for (let k in tempProducts) {
      if (tempProducts[k].num) {
        sum += tempProducts[k].price * tempProducts[k].num
      }
    }
    if (!sum)
      this.setData({
        showCartDetail: false
      })
    cartinfo.totalPrice = sum
    this.setData({
      cartinfo: cartinfo
    })
  },
  bindPlus: function (event) {
    var self = this
    let productid = event.currentTarget.dataset.id
    let cartinfo = this.data.cartinfo
    let product = this.data.product
    if (!cartinfo.products[productid]) {
      cartinfo.products[productid] = {
        id: product.id,
        name: product.name,
        price: product.price,
        num: 0
      }
    }
    ++cartinfo.products[productid].num
    if (productid == product.id) {
      product.num++
    }
    this.setData({
      product: product,
      cartinfo: cartinfo
    })
    this.computePrice()
    wx.setStorageSync('cartinfo', self.data.cartinfo)
  },
  bindMinus: function (event) {
    let self = this
    let productid = event.currentTarget.dataset.id
    let cartinfo = this.data.cartinfo
    let product = this.data.product
    --cartinfo.products[productid].num
    if (productid == product.id) {
      product.num--
    }
    this.setData({
      product: product,
      cartinfo: cartinfo
    })
    this.computePrice()
    wx.setStorageSync('cartinfo', self.data.cartinfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (Object.keys(options)) {
      wx.request({
        url: 'https://www.lylyn.cn/api/productinfo/' + options.id,
        success: res => {
          let productData = res.data.data
          let cartinfo = wx.getStorageSync('cartinfo')
          if (cartinfo.products[productData.id]) {
            productData.num = cartinfo.products[productData.id].num
          } else {
            productData.num = 0
          }
          self.setData({
            product: productData,
            cartinfo: cartinfo
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})