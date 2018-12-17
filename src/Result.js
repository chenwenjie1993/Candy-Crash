import React from 'react'
import { TYPES } from './constants'
import PropTypes from 'prop-types'
import './Result.css'

function Result ({ result, onRestart }) {
  let cancelledItems = TYPES.map(type => result[type] ?
    { type, count: result[type] } : { type, count: 0 })
  return (
    <div className='result-container'>
      <div className='result-items-container'>
        <div>
          {cancelledItems.map((item, index) =>
            <div className='result-row' key={index}>
              <div className={`item ${item.type}`}></div>
              X {item.count}
            </div>,
          )}
        </div>
        <div className='restart-btn' onClick={onRestart}>RESTART</div>
      </div>
    </div>
  )
}

Result.propTypes = {
  result: PropTypes.object.isRequired,
  onRestart: PropTypes.func.isRequired,
}

export default Result