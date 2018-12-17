import React from 'react'
import './Timer.css'
import PropTypes from 'prop-types'
import { GAME_TIME } from './constants'

function formatTime (time) {
  let min = Math.floor(time / 60).toString()
  if (min.length < 2) min = '0' + min
  const sec = ('0' + time % 60).slice(-2)
  return `${min}:${sec}`
}

class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { timer: GAME_TIME }
  }

  componentDidMount () {
    const interval = setInterval(() => this.setState(
      ({ timer }) => {
        if (timer > 0)
          return { timer: timer - 1 }
        else {
          clearInterval(interval)
          this.props.endGame()
        }
      }), 1000)
  }

  render () {
    const { timer } = this.state
    return (
      <div className='timer'>{timer > 0 ? formatTime(timer) : 'Game Over'}</div>
    )
  }
}

Timer.propTypes = {
  endGame: PropTypes.func.isRequired,
}

export default Timer