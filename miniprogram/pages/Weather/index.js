//index.js
//获取应用实例
const app = getApp()

Page({ 
 data: {
   update: '',
   city: '',
   today:{},
   tomorrow:{},
   afterTomor:{},
   todyIcon:'',
   tomorrowIcon:'',
   afterTomorIcon:''
},
 onShow: function () {
this.getLocation();
},
//事件处理函数
 bindViewTap: function() {
   wx.navigateTo({
     url: '../logs/logs'
})
},
 getLocation:function(){
var that = this;
   wx.getLocation({
     type: 'wgs84',
     success: function (res) {
var latitude = res.latitude
var longitude =res.longitude
latitude = latitude.toFixed(2)
longitude = longitude.toFixed(2)
       
       that.getTime(latitude,longitude);
}
})
},
getTime:function(latitude,longitude){
    var that=this;
    var currdate = new Date();
    var nowtime = (currdate.getHours()<10?'0':'') + currdate.getHours() + ':' +
    (currdate.getMinutes()<10?'0':'') + currdate.getMinutes();
    that.getWeatherInfo(nowtime, latitude, longitude);

},

 getWeatherInfo: function (nowtime,latitude, longitude){
var _this = this;
var key = '2b1bf793d0a34811896f16eef88d9bdb';//你自己的key
//需要在微信公众号的设置-开发设置中配置服务器域名
var url1 = 'https://devapi.qweather.com/v7/weather/3d?key='+key+'&location='+ longitude + ',' + latitude;
var url2 = 'https://geoapi.qweather.com/v2/city/lookup?key='+key+'&location='+ longitude + ',' + latitude;
   wx.request({
     url: url1, 
     data: {},
     method: 'GET',
     success(res) {
var daily_forecast_today = res.data.daily[0];//今天预报
var daily_forecast_tomorrow = res.data.daily[1];//明天天预报
var daily_forecast_afterTomor = res.data.daily[2];//后天预报
var update = res.data.updateTime;//更新时间

if(nowtime>daily_forecast_today.sunrise&&nowtime<=daily_forecast_today.sunset){
    _this.setData({
        update:update,
        today: daily_forecast_today,
        tomorrow:daily_forecast_tomorrow,
        afterTomor: daily_forecast_afterTomor,
        todyIcon: 'icons/' + daily_forecast_today.iconDay+'.svg', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
        tomorrowIcon: 'icons/' + daily_forecast_tomorrow.iconDay+'.svg',
        afterTomorIcon: 'icons/' + daily_forecast_afterTomor.iconDay+'.svg'
});
}else{
    _this.setData({
        update:update,
        today: daily_forecast_today,
        tomorrow:daily_forecast_tomorrow,
        afterTomor: daily_forecast_afterTomor,
        todyIcon: 'icons/' + daily_forecast_today.iconNight+'.svg', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
        tomorrowIcon: 'icons/' + daily_forecast_tomorrow.iconNight+'.svg',
        afterTomorIcon: 'icons/' + daily_forecast_afterTomor.iconNight+'.svg'
       
});
}


}
})
wx.request({
    url: url2, 
    data: {},
    method: 'GET',
    success(res){

        var city = res.data.location[0];//今天预报
               _this.setData({
               city: city
        });
        }})
}
})