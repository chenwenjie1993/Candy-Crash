import React from 'react'
import PropTypes from 'prop-types'
import './Result.scss'
import { prizeConfig } from './prizeConfig'

function MyPrizes ({ prizes, startGame, openModal }) {
  let prizeDetails = prizes.map(p => ({...p, ...prizeConfig[p.type]}))
  return (
    <div className='content-container'>
      <div className='result-items-container'>
        <div>
          {prizeDetails.map((item, index) =>
            <div className='result-row' key={index}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div className={`item ${item.group}`}/>
                <div>&nbsp;{item.name}</div>
              </div>
              <div style={{marginRight: '5px'}} onClick={() => openModal(item)}>查看</div>
            </div>,
          )}
        </div>
        <div className='my-prizes-btn-container'>
          <div className='canvas-btn' onClick={startGame}>开始游戏</div>
          {/*<div className='canvas-btn' onClick={() => alert('Work in progress')}>我的奖品</div>*/}
        </div>
      </div>
    </div>
  )
}

MyPrizes.propTypes = {
  prizes: PropTypes.array.isRequired,
  startGame: PropTypes.func.isRequired,
}

export default MyPrizes