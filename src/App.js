import React, { Component } from 'react'
import './App.css'
import Canvas from './Canvas'
import { PoseGroup } from 'react-pose'
import Timer from './Timer'
import { GAME_STATE } from './constants'
import Result from './Result'

class App extends Component {

  constructor (props) {
    super(props)
    this.state = { state: GAME_STATE.PLAYING }
    this.currentRun = 0
    this.restart = false
    this.animating = false
    this.result = {}
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { state } = this.state
    return !this.animating && state !== nextState.state
  }

  componentWillUpdate (nextProps, nextState, nextContext) {
    const {state} = this.state
    this.restart = nextState.state === GAME_STATE.PLAYING &&
      state === GAME_STATE.ENDED;
    if (this.restart) this.currentRun++
  }

  render () {
    const { state } = this.state
    const { result, currentRun } = this

    return (
      <div className="container">
        <div className="landscape-cover"></div>
        <Timer key={currentRun} endGame={() => this.setState(
          state => ({ ...state, state: GAME_STATE.ENDED }))}
        />
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
          <Result result={result} onRestart={
            () => {
              this.animating = false
              this.result = {}
              this.setState({...this.state, state: GAME_STATE.PLAYING})
            }
          }/>
        }

      </div>
    )
  }
}

export default App
