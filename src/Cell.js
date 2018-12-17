import React from 'react'
import PropTypes from 'prop-types'
import './Cell.scss'

import posed from 'react-pose'

export const Box = posed.div({
  visible: {
    y: 0,
    opacity: 1,
    delay: 100,
    transition: {
      y: { type: 'spring' },
      default: { duration: 300 },
    },
  },
  hidden: {
    y: 0,
    opacity: 0.1,
  },
  draggable: true,
  dragBounds: { left: -50, right: 50, top: -50, bottom: 50},
  dragEnd: {
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
})

export default ({ onDragStart, onDragEnd, ...attr }) => {
  return (
    <Box
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...attr}
    />
  );
}

Box.propTypes = {
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
}


