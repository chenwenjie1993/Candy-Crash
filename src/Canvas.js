import React from 'react'
import PropTypes from 'prop-types'
import { HEIGHT, CANVAS_STATE, TYPES, WIDTH, DIRECTION } from './constants'
import Cell from './Cell'
import './Canvas.css'

function generateCanvas () {
  const canvas = []
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const type = TYPES[Math.floor(Math.random() * TYPES.length)]
      canvas.push(
        {
          row: i,
          col: j,
          key: getPos(i, j),
          cancellable: false,
          toFill: false,
          type,
        })
    }
  }
  return canvas
}

function getPos (row, col) {
  return row * WIDTH + col
}

function markCancellable (oldCanvas) {
  const canvas = [...oldCanvas]
  let leftCount = Array(WIDTH * HEIGHT).fill(0)
  let upCount = Array(WIDTH * HEIGHT).fill(0)
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      let current = getPos(i, j)
      let left = getPos(i, j - 1)
      let up = getPos(i - 1, j)
      if (j > 0 && canvas[current].type === canvas[left].type) {
        leftCount[current] = leftCount[left] + 1
        if (leftCount[current] === 2) {
          let left2 = getPos(i, j - 2)
          canvas[current] = { ...canvas[current], cancellable: true }
          canvas[left] = { ...canvas[left], cancellable: true }
          canvas[left2] = { ...canvas[left2], cancellable: true }
        } else if (leftCount[current] > 2) {
          canvas[current] = { ...canvas[current], cancellable: true }
        }
      }
      if (i > 0 && canvas[current].type === canvas[up].type) {
        upCount[current] = upCount[up] + 1
        if (upCount[current] === 2) {
          let up2 = getPos(i - 2, j)
          canvas[current] = { ...canvas[current], cancellable: true }
          canvas[up] = { ...canvas[up], cancellable: true }
          canvas[up2] = { ...canvas[up2], cancellable: true }
        } else if (upCount[current] > 2) {
          canvas[current] = { ...canvas[current], cancellable: true }
        }
      }
    }
  }
  return canvas
}

function countCancellable (canvas) {
  let count = {}
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const current = getPos(i, j)
      if (canvas[current].cancellable) {
        const type = canvas[current].type
        if (count[type]) {
          count[type]++
        } else {
          count[type] = 1
        }
      }
    }
  }
  return count
}

function removeCancellable (oldCanvas) {
  const canvas = [...oldCanvas]
  let leftCount = Array(WIDTH * HEIGHT).fill(0)
  let upCount = Array(WIDTH * HEIGHT).fill(0)
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      let current = getPos(i, j)
      let left = getPos(i, j - 1)
      let up = getPos(i - 1, j)
      if (j > 0 && canvas[current].type === canvas[left].type) {
        leftCount[current] = leftCount[left] + 1
        if (leftCount[current] === 2) {
          let type = TYPES[Math.floor(Math.random() * TYPES.length)]
          while (type === canvas[current].type ||
          (i > 0 && type === canvas[up].type)) {
            type = TYPES[Math.floor(Math.random() * TYPES.length)]

          }
          canvas[current].type = type
          leftCount[current] = 0
        }
      }
      if (i > 0 && canvas[current].type === canvas[up].type) {
        upCount[current] = upCount[up] + 1
        if (upCount[current] === 2) {
          let type = TYPES[Math.floor(Math.random() * TYPES.length)]
          while (type === canvas[current].type ||
          (j > 0 && type === canvas[left].type)) {
            type = TYPES[Math.floor(Math.random() * TYPES.length)]
          }
          canvas[current].type = type
          upCount[current] = 0
        }
      }
    }
  }
  return canvas
}

function moveCellsDown (oldCanvas) {
  const canvas = [...oldCanvas]
  for (let j = 0; j < WIDTH; j++) {
    let moveStep = 0
    for (let i = HEIGHT - 1; i >= 0; i--) {
      const current = getPos(i, j)
      if (canvas[current].cancellable) {
        canvas[current] = { ...canvas[current], toFill: true }
        moveStep += 1
        continue
      }
      if (moveStep > 0) {
        const updatePos = getPos(i + moveStep, j)
        canvas[updatePos] = {
          row: i + moveStep,
          col: j,
          key: updatePos,
          cancellable: false,
          toFill: false,
          type: canvas[current].type,
        }
        canvas[current] = {
          ...canvas[current],
          toFill: true,
          cancellable: true,
        }
      }
    }
  }
  return canvas
}

function fillCells (oldCanvas) {
  const canvas = [...oldCanvas]
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const current = getPos(i, j)
      if (!canvas[current].toFill) {
        continue
      }
      let type = TYPES[Math.floor(Math.random() * TYPES.length)]
      const up = getPos(i - 1, j)
      const left = getPos(i, j - 1)
      while ((i > 0 && type === canvas[up].type) ||
      (j > 0 && type === canvas[left].type)) {
        type = TYPES[Math.floor(Math.random() * TYPES.length)]

      }
      canvas[current] = {
        ...canvas[current],
        cancellable: false,
        toFill: false,
        type,
      }
    }
  }
  return canvas
}

function move (canvas, row, col, row2, col2) {
  const newCanvas = [...canvas]
  const cell1 = getPos(row, col)
  const cell2 = getPos(row2, col2)

  newCanvas[cell1] = { ...canvas[cell1], type: canvas[cell2].type }
  newCanvas[cell2] = { ...canvas[cell2], type: canvas[cell1].type }
  return newCanvas
}

function attemptMove (canvas, row, col, direction) {
  let row2 = row, col2 = col
  if (direction === DIRECTION.UP) {
    row2 -= 1
  }
  if (direction === DIRECTION.DOWN) {
    row2 += 1
  }
  if (direction === DIRECTION.LEFT) {
    col2 -= 1
  }
  if (direction === DIRECTION.RIGHT) {
    col2 += 1
  }
  if (row2 < 0 || row2 > HEIGHT - 1 || col2 < 0 || col2 > WIDTH -
    1) return null

  let newCanvas = move(canvas, row, col, row2, col2)
  newCanvas = markCancellable(newCanvas)
  if (newCanvas.some(cell => cell.cancellable)) {
    return newCanvas
  } else {
    return null
  }
}

export default class Canvas extends React.Component {
  constructor (props) {
    super(props)
    let canvas = generateCanvas()
    canvas = removeCancellable(canvas)
    this.state = { canvas, state: CANVAS_STATE.NORMAL }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const { canvas, state } = this.state
    let update = nextProps !== this.props ||
      nextState.canvas !== canvas ||
      (nextState.state !== state && nextState.state !== CANVAS_STATE.NORMAL)
    return update
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { state } = this.state
    if (state === CANVAS_STATE.CHECK) {
      setTimeout(() =>
          this.setState(({ canvas }) => {
            const newCanvas = markCancellable(canvas)
            if (newCanvas.some(cell => cell.cancellable)) {
              this.props.postAnimationState(true)
              this.props.postResult(countCancellable(newCanvas))
              return {
                canvas: markCancellable(canvas), state: CANVAS_STATE.CANCELLED,
              }
            } else {
              setTimeout(() =>
                this.props.postAnimationState(false), 1000)
              return {
                canvas, state: CANVAS_STATE.NORMAL,
              }
            }
          }),
        100)
    }
    if (state === CANVAS_STATE.CANCELLED) {
      setTimeout(() =>
          this.setState(
            ({ canvas }) =>
              ({
                canvas: moveCellsDown(canvas),
                state: CANVAS_STATE.DOWN,
              })),
        500)
    }
    if (state === CANVAS_STATE.DOWN) {
      setTimeout(() =>
          this.setState(
            ({ canvas }) =>
              ({
                canvas: fillCells(canvas),
                state: CANVAS_STATE.FILLED,
              })),
        0)
    }
    if (state === CANVAS_STATE.FILLED) {
      setTimeout(() =>
          this.setState(
            ({ canvas }) =>
              ({
                canvas: fillCells(canvas),
                state: CANVAS_STATE.CHECK,
              })),
        100)
    }
  }

  render () {
    const { canvas } = this.state
    return (
      <div className="canvas-container">
        {canvas.map(cell => (
          <Cell {...cell} className={`item ${cell.type}`}
                pose={cell.cancellable ? 'hidden' : 'visible'}
                onDragStart={e => {
                  if (!e.touches) return
                  let xPos = e.touches[0].clientX
                  let yPos = e.touches[0].clientY
                  canvas[cell.key] = { ...cell, xPos, yPos }
                }}
                onDragEnd={e => {
                  if (!e.changedTouches) return
                  let x = e.changedTouches[0].clientX
                  let y = e.changedTouches[0].clientY
                  const distX = x - canvas[cell.key].xPos,
                    distY = y - canvas[cell.key].yPos
                  const absX = Math.abs(distX), absY = Math.abs(distY)
                  if (absX < 30 && absY < 30) return
                  let direction
                  if (absY > absX) {
                    if (distY > 0) direction = DIRECTION.DOWN
                    else direction = DIRECTION.UP
                  } else {
                    if (distX > 0) direction = DIRECTION.RIGHT
                    else direction = DIRECTION.LEFT
                  }
                  let newCanvas = attemptMove(this.state.canvas,
                    cell.row, cell.col, direction)
                  if (newCanvas) {
                    this.setState(
                      { canvas: newCanvas, state: CANVAS_STATE.CHECK })
                  }
                }}
          />
        ))}
      </div>
    )
  }
}

Canvas.propTypes = {
  postResult: PropTypes.func.isRequired,
  postAnimationState: PropTypes.func.isRequired,
}
