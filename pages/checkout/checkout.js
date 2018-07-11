// pages/checkout/checkout.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartinfo: null,
    extra_costs: {
      box_cost: 2,
      delivery_cost: 5
    },
    submitable: true
  },

  submitOrder: function (e) {
    if (!this.data.submitable) return
    let orderlist = wx.getStorageSync('orderlist') || [];
    let order = {}
    let baseket = []
    for (let k in this.data.cartinfo.products) {
      if (this.data.cartinfo.products[k].num) {
        baseket.push(this.data.cartinfo.products[k])
      }
    }
    // return;
    order.basket = baseket
    order.extra_costs = this.data.extra_costs
    order.totalPrice = this.data.cartinfo.totalPrice + order.extra_costs.box_cost + order.extra_costs.delivery_cost
    order.createTime = util.formatTime(new Date())
    orderlist.push(order)
    wx.setStorageSync('orderlist', orderlist)
    wx.removeStorageSync('cartinfo')
    this.setData({
      submitable: false
    })
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000,
      success: function () {
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/order/order',
          })
        }, 2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cartinfo = wx.getStorageSync('cartinfo')
    this.setData({
      cartinfo: cartinfo
    })
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