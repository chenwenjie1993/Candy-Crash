import React from 'react'
import PropTypes from 'prop-types'
import './Start.scss'
import { GAME_TIME } from './settings'

function TC ({ startGame, myPrizes }) {
  return (
    <div className='content-container'>
      <div className='intro-container'>
        <div className='intro'>
          <p style={{ fontSize: 17 }}>新春红包消消乐</p>
          <br/>
          <p>游戏规则：</p>
          <p>在{GAME_TIME}秒内进行消消乐</p>
          <p>消除最多的种类即可得到该种类下的相应奖励</p>
          <p>每人每天有三次机会</p>
          <p>分享可获得多一次机会</p>
          <p>更多滨海湾金沙新春活动请
            <a
              href='http://www.zh.marinabaysands.com/lunarnewyear.html?utm_medium=social&utm_source=wechat&utm_campaign=wechatcnygamepage'>
              点击
            </a>
          </p>
          <br/>
          <br/>
        </div>
        <div className='start-btn-container'>
          <div className='canvas-btn' onClick={startGame}>开始游戏</div>
          <div className='canvas-btn'
               onClick={myPrizes}>我的奖品
          </div>
        </div>
      </div>
    </div>
  )
}

TC.propTypes = {
  startGame: PropTypes.func.isRequired,
  myPrizes: PropTypes.func.isRequired,
}

export default TC