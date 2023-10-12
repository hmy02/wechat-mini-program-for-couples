/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,
        countdayA: 0,
        countdayB: 0,
        clickday: 0,
        days: 0,
        user: '',
        userA: '',
        userB: '',
        date: '',
        sentences: ["写作", "今天不谈学习", "刷题", "单词", "听力", "口语", "阅读"],
        lenOfSentences: 0,
        weather: '',
        max: '',
        min: '',
    },
    goto:function(){
        wx.navigateTo({
          url: '/pages/Weather/index',
        })
      },

    async onShow(){
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
            lenOfSentences: this.data.sentences.length,
            date: getApp().globalData.date,
            isShow: true
        })
        this.getStudyConA()
        this.getStudyConB()
        this.getScreenSize()
        this.getUser()
        this.getDays()
        this.getCreditA()
        this.getCreditB()
        this.getCurrentClick()
        this.getCountA()
        this.getCountB()
    },
     getStudyConA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          var clickdayA = res.result.data[0].Clickday
          if(clickdayA==new Date().getDay()){
              this.setData({studyA:'已打卡'})
          }else{
            this.setData({studyA:'未打卡'})
          }
        })
    },
    getStudyConB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
          var clickdayB = res.result.data[0].Clickday
          if(clickdayB==new Date().getDay()){
              this.setData({studyB:'已打卡'})
          }else{
            this.setData({studyB:'未打卡'})
          }
        })
    },


     getUser(){
         wx.cloud.callFunction({name: 'getOpenId'}).then(res => {
            if(res.result === getApp().globalData._openidA){
                this.setData({
                    user: getApp().globalData.userA,
                })
            }else if(res.result === getApp().globalData._openidB){
                this.setData({
                    user: getApp().globalData.userB,
                })
            }
        })
        this.getCurrentCredit()
      },
    
      //获取当前账号积分数额
     getCurrentCredit(){
         wx.cloud.callFunction({name: 'getOpenId'})
        .then(async openid => {
           wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: openid.result}})
          .then(async res => {
            this.setData({
              credit: res.result.data[0].credit
            }) 
          })
        })
      },

      getCurrentClick(){
         wx.cloud.callFunction({name: 'getOpenId'})
        .then(async openid => {
           wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: openid.result}})
          .then(async res => {
            var clickday = res.result.data[0].Clickday
            this.setData({
              clickday: clickday
            })
          })
        })
      },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
    },
    getCountA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({countdayA: res.result.data[0].count})
        })
    },
    getCountB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
          this.setData({countdayB: res.result.data[0].count})
        })
    },
    getDays(){
      var date1= this.data.date;  //开始时间
      var date2 = new Date();    //结束时间
      var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数      
      //计算出相差天数
      this.setData({
          days: Math.floor(date3/(24*3600*1000))
      })
  },
    //获取页面大小
    getScreenSize(){
        wx.getSystemInfo({
          success: (res) => {
            this.setData({
              screenWidth: res.windowWidth,
              screenHeight: res.windowHeight
            })
          }
        })
      },

      async toAddPage() {
        wx.cloud.callFunction({name: 'getOpenId'})
        .then(async openid => {
           wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: openid.result}})
          .then(async res => {
            var clickday = res.result.data[0].Clickday
            this.setData({
              clickday: clickday
            })
          })
        })
          var clickday = this.data.clickday
          var today = new Date().getDay()
        if(clickday!=today){
        this.setData({isShow: false,})
            wx.showToast({
                title: '获得50积分',
                icon: 'success',
                duration: 1000})
        wx.cloud.callFunction({name: 'getOpenId'})
        .then(async openid => {
            wx.cloud.callFunction({name: 'editClick', data: {_openid: openid.result, value: today, list: getApp().globalData.collectionUserList}})
            wx.cloud.callFunction({name: 'editCredit', data: {_openid: openid.result, value: +50, list: getApp().globalData.collectionUserList}})
            wx.cloud.callFunction({name: 'editCount', data: {_openid: openid.result, value: +1, list: getApp().globalData.collectionUserList}})
        })
            }else{
                wx.showToast({
                    title: '今日已打卡',
                    icon: 'error',
                    duration: 1000})
            }



    
    },
    
    
})

