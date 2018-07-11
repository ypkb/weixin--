//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    greeting: '欢迎光临【果果本色】,我们将用心保证每一盘果切的新鲜与美味。',
    userInfo: {},
    hasUserInfo: false,
    selectedIndex: 1,
    myswiper: {
      imgUrls: [
        '../../assets/swiper/guoqie01.jpg',
        '../../assets/swiper/guoqie02.jpg',
        '../../assets/swiper/guoqie03.jpg'
      ],
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000
    },
    productinfo: [],
    totalPrice: 0,
    cartinfo: {
      products: {},
      totalPrice: 0
    },
    showCartDetail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
          let productinfo = self.data.productinfo
          let cartinfo = self.data.cartinfo
          for (let i = 0; i < productinfo.length; i++) {
            productinfo[i].num = 0
          }
          for (let k in cartinfo.products) {
            cartinfo.products[k].num = 0
          }
          self.setData({
            productinfo: productinfo,
            cartinfo: cartinfo
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
    // console.log(this.data.cartinfo)
  },
  selectDir: function (event) {
    this.setData({
      selectedIndex: event.currentTarget.dataset.selectedIndex
    })
  },
  showDetail: function (event) {
    var self = this
    setTimeout(() => {
      wx.setStorageSync('cartinfo', self.data.cartinfo)
      wx.navigateTo({
        url: '../product_detail/product_detail?id=' + event.currentTarget.dataset.productId,
      })
    }, 20)
  },
  noBubbleTapped: function (event) { },
  bindPlus: function (event) {
    let self = this
    let productid = event.currentTarget.dataset.id
    let productinfo = this.data.productinfo
    let cartinfo = this.data.cartinfo
    for (let i = 0; i < productinfo.length; i++) {
      if (productinfo[i].id == productid) {
        if (isNaN(productinfo[i].num)) {
          productinfo[i].num = 1
          cartinfo.products[productid] = {
            id: productid,
            name: productinfo[i].name,
            price: productinfo[i].price,
            num: 1
          }
        }
        else {
          productinfo[i].num++
          if (!cartinfo.products[productid]) {
            cartinfo.products[productid] = {
              id: productid,
              name: productinfo[i].name,
              price: productinfo[i].price,
              num: 1
            }
          } else {
            cartinfo.products[productid].num = productinfo[i].num
          }
        }
      }
    }
    this.setData({
      productinfo: productinfo,
      cartinfo: cartinfo
    })
    this.computePrice()
    wx.setStorageSync('cartinfo', self.data.cartinfo)
  },
  bindMinus: function (event) {
    let self = this
    let productid = event.currentTarget.dataset.id
    let productinfo = this.data.productinfo
    let cartinfo = this.data.cartinfo
    for (let i = 0; i < productinfo.length; i++) {
      if (productinfo[i].id == productid) {
        if (!isNaN(productinfo[i].num) && productinfo[i].num !== 0) {
          productinfo[i].num--
          cartinfo.products[productid].num = productinfo[i].num
        }
      }
    }
    this.setData({
      productinfo: productinfo,
      cartinfo: cartinfo
    })
    this.computePrice()
    wx.setStorageSync('cartinfo', self.data.cartinfo)
  },
  checkCartInfo: function () {
    let cartinfo = wx.getStorageSync('cartinfo')
    let productinfo = this.data.productinfo
    if (productinfo.length && cartinfo) {
      for (let i = 0; i < productinfo.length; i++) {
        let id = productinfo[i].id
        if (cartinfo.products[id]) {
          productinfo[i].num = cartinfo.products[id].num
        } else {
          productinfo[i].num = 0
        }
      }
      this.setData({
        productinfo: productinfo,
        cartinfo: cartinfo
      })
    } else {
      for (let i = 0; i < productinfo.length; i++) {
        productinfo[i].num = 0
      }
      this.setData({
        productinfo: productinfo,
        cartinfo: {
          products: {},
          totalPrice: 0
        }
      })
    }
  },
  checkout: function (e) {
    let disabled = e.currentTarget.dataset.disabled
    if (!disabled) {
      wx.navigateTo({
        url: '../checkout/checkout',
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.request({
      url: 'https://www.lylyn.cn/api/productinfo',
      success: res => {
        this.setData({
          productinfo: res.data.data
        })
        this.checkCartInfo()
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 2000)
  },
  onShow: function () {
    this.checkCartInfo()
    console.log('SHOW')
  },
  onHide: function () {
    console.log('HIDE')
  }
})
