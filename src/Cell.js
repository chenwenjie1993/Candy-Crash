import React from 'react'
import PropTypes from 'prop-types'
import './Cell.css'

import posed from 'react-pose'

export const Box = posed.div({
  visible: {
    y: 0,
    opacity: 1,
    delay: 100,
    transition: {
      y: { type: 'spring', stiffness: 1000, damping: 15 },
      default: { duration: 300 },
    },
  },
  hidden: {
    y: 0,
    opacity: 0.1,
  },
  draggable: true,
  dragEnd: {
    x: 0,
    y: 0,
    transition: { type: 'spring' },
  },
})

export default ({ onDragStart, onDragEnd, ...attr }) => (
  <Box
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    {...attr}
  />
);

Box.propTypes = {
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
}


