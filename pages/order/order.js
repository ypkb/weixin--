//order.js
//获取应用实例
const app = getApp()

Page({
  data: {
    orderlist: null
  },
  onLoad: function () {
    
  },
  onShow: function(){
    let orderlist = wx.getStorageSync('orderlist')
    this.setData({
      orderlist: orderlist
    })
  }
})
