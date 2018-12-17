import React from 'react'
import PropTypes from 'prop-types'
import './Start.scss'

function Start ({ startGame, myPrizes }) {
  return (
    <div className='content-container'>
      <div className='intro-container'>
        <div className='intro'>
          <p style={{ fontSize: 17 }}>玩红包消消乐，获取以下海量福利：</p>
          <br/>
          <p>狂撒上万红包，最高金额¥2019</p>
          <p>海量餐饮及购物代金券价值¥500</p>
          <p>海量购物优惠券</p>
          <br/>
          <p><b>开始寻宝</b>，看看2019年你是哪种人格？</p>
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

Start.propTypes = {
  startGame: PropTypes.func.isRequired,
  myPrizes: PropTypes.func.isRequired,
}

export default Start