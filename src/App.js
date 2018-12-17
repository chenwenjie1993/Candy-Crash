import React, { Component } from 'react'
import './App.scss'
import Canvas from './Canvas'
import { PoseGroup } from 'react-pose'
import Timer from './Timer'
import { GAME_STATE } from './constants'
import Result from './Result'
import Start from './Start'
import logo from './images/logo.png'
import flower from './images/flower.png'
import mbs from './images/mbs.png'
import loader from './images/loader.gif'
import shareImage from './images/share.png'
import TC from './TC'
import Prize from './Prize'
import MyPrizes from './MyPrize'
import axios from 'axios'
import { BASE_URL } from './settings'
import { config_jssdk } from './Wechat'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      state: GAME_STATE.NOT_STARTED,
      modalOpen: false,
      autoOpen: false,
      loading: true,
      sharing: false,
      prize: { type: 'D', ref: '' },
    }
    this.currentRun = 0
    this.animating = false
    this.result = {}
    this.remaining_chances = 0
  }

  componentDidMount () {
    this.login()
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return !this.animating && this.state !== nextState
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    if (nextState.state === GAME_STATE.PLAYING) this.currentRun++
  }

  login = () => {
    axios.get(`${BASE_URL}/wechat/?path=${window.location.href}`)
      .then(
        resp => {
          return resp.data
        })
      .then(
        (data) => {
          config_jssdk(data)
        })
      .then(
        () => {
          this.updateMyPrizes()
        },
      )
      .catch(r => console.log(r))
  }

  updateMyPrizes = () => {
    axios.get(`${BASE_URL}/player/my_prizes/`).then(
      resp => {
        this.storePrizesAndChances(resp)
        this.setState({ ...this.state, loading: false })
      },
    )
    // this.prizes = ['A1', 'B1', 'C1', 'E1']
  }

  openModal = (prize) => this.setState(
    state => ({ ...state, modalOpen: true, prize }),
  )

  closeModal = () => this.setState(
    state => ({ ...state, modalOpen: false, autoOpen: false }),
  )

  startGame = () => {
    if (this.remaining_chances <= 0) {
      alert('今天的机会用完了，明天继续！')
    } else {
      this.setState(
        state => ({ ...state, state: GAME_STATE.PLAYING }))
    }
  }

  endGame = () => {
    this.setState(
      state => ({ ...state, loading: true, state: GAME_STATE.ENDED }),
    )
    this.submitResult()
  }

  showTc = () => this.setState(
    state => ({ ...state, state: GAME_STATE.TC }),
  )

  myPrizes = () => this.setState(
    state => ({ ...state, state: GAME_STATE.MY_PRIZES }),
  )

  storePrizesAndChances = (resp) => {
    this.prizes = resp.data.prizes
    this.remaining_chances = resp.data.remaining_chances
  }

  submitResult = () => {
    axios.post(`${BASE_URL}/game/`, { result: JSON.stringify(this.result) })
      .then(resp => {
        this.storePrizesAndChances(resp)
        this.setState(
          state => ({
            ...state,
            loading: false,
            prize: this.prizes[this.prizes.length - 1],
            autoOpen: true,
          }),
        )
      })
  }

  toggleShare = () => this.setState(
    state => ({ ...state, sharing: !state.sharing }),
  )

  render () {
    const { state, modalOpen, autoOpen, loading, sharing, prize } = this.state
    const { result, currentRun } = this

    return (
      <div className="container">
        <div className="landscape-cover"/>
        {
          loading && <div className="loading">
            <img src={loader} alt=''/>
          </div>
        }
        {
          sharing && <div className="sharing" onClick={this.toggleShare}>
            <img src={shareImage} alt='' className='share-image'/>
            <p>点击右上角分享给好友</p>
            <p>或者分享到朋友圈</p>
            <p>获取额外游戏次数</p>
          </div>
        }
        <Prize open={modalOpen}
               onClose={this.closeModal}
               toggleShare={this.toggleShare}
               prize={prize}
        />
        <div className="logo-container">
          <img src={logo} alt="" className="logo"/>
        </div>
        <div className="header">
          <div className="tc-btn" onClick={() => {
            if (state !== GAME_STATE.PLAYING) this.showTc()
          }}>
            <img src={flower} className="tc-img" alt=""/>
            游戏说明
          </div>
          {
            state === GAME_STATE.PLAYING &&
            <Timer key={currentRun} endGame={this.endGame}
            />
          }
          {
            state !== GAME_STATE.PLAYING &&
            <div className="timer">&nbsp;</div>
          }
        </div>
        {
          state === GAME_STATE.NOT_STARTED &&
          <Start startGame={this.startGame} myPrizes={this.myPrizes}/>
        }
        {
          state === GAME_STATE.TC &&
          <TC startGame={this.startGame} myPrizes={this.myPrizes}/>
        }
        {
          state === GAME_STATE.MY_PRIZES &&
          <MyPrizes prizes={this.prizes}
                    startGame={this.startGame}
                    openModal={this.openModal}
          />
        }
        {
          state === GAME_STATE.PLAYING &&
          <PoseGroup>
            <Canvas key={-1}
                    postResult={count => {
                      for (let type in count) {
                        if (result[type])
                          result[type] += count[type]
                        else
                          result[type] = count[type]
                      }
                    }}
                    postAnimationState={animating => {
                      this.animating = animating
                      if (!animating && this.state.state === GAME_STATE.ENDED)
                        this.forceUpdate()
                    }}
            />
          </PoseGroup>
        }
        {
          state === GAME_STATE.ENDED &&
          <Result result={result}
                  prize={prize}
                  openModal={this.openModal}
                  autoOpen={autoOpen}
                  myPrizes={this.myPrizes}
                  onRestart={
                    () => {
                      this.animating = false
                      this.result = {}
                      this.startGame()
                    }
                  }/>
        }
        <div className="mbs-container">
          <img src={mbs} alt="" className="mbs"/>
        </div>
      </div>
    )
  }
}

export default App
