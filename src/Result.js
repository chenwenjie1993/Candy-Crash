import React, { Component } from 'react'
import { TYPES } from './constants'
import PropTypes from 'prop-types'
import './Result.scss'

class Result extends Component {
  componentDidUpdate () {
    const { openModal, prize, autoOpen } = this.props
    if (autoOpen)
      this.timer = setTimeout(() => openModal(prize), 3000)
    else if (this.timer)
      clearTimeout(this.timer)
  }

  componentWillUnmount () {
    if (this.timer)
      clearTimeout(this.timer)
  }

  render () {
    const { result, openModal, onRestart, myPrizes, prize } = this.props
    let cancelledItems = TYPES.map(type => result[type] ?
      { type, count: result[type] } : { type, count: 0 })
    return (
      <div className='content-container'>
        <div className='result-items-container'>
          <div>
            {cancelledItems.map((item, index) =>
              <div className='result-row' key={index}>
                <div className={`item ${item.type}`}/>
                X {item.count}
              </div>,
            )}
            <div className='result-btn-container'
                 style={{ justifyContent: 'center' }}>
              <div className='canvas-btn' style={{ fontSize: '18px' }}
                   onClick={() => openModal(prize)}>领取奖品
              </div>
            </div>
          </div>
          <div className='result-btn-container'>
            <div className='canvas-btn' onClick={onRestart}>再玩一次</div>
            <div className='canvas-btn' onClick={myPrizes}>我的奖品</div>
          </div>
        </div>
      </div>
    )
  }
}

Result.propTypes = {
  result: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  myPrizes: PropTypes.func.isRequired,
  autoOpen: PropTypes.bool,
}

export default Result