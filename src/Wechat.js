import axios from 'axios'
import { BASE_URL } from './settings'

export const config_jssdk = ({ timestamp, noncestr, signature }) => {
  window.wx.config({
    debug: false,
    appId: 'wx6e9936552839a24a',
    timestamp: timestamp,
    nonceStr: noncestr,
    signature: signature,
    jsApiList: [
      'checkJsApi',
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'showMenuItems',
      'addCard',
    ],
  })
}

export const share_config = {
  title: '滨海湾金沙 新春红包消消乐 上万大红包等你来领',
  desc: '测测你2019运势，还可以得到￥2019 红包',
  link: 'https://mbs-game.misc.fomopowered.cn',
  imgUrl: 'https://mbs-game.misc.fomopowered.cn/static/share.png',
  success: function () {
    axios.post(`${BASE_URL}/player/share/`)
      .then(() => window.location.reload())
  },
}

window.wx.ready(function () {
  window.wx.onMenuShareAppMessage(share_config)
  window.wx.onMenuShareTimeline(share_config)
})

