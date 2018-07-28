import React from 'react'

import Board from '../board/board'
import { Score } from '../score/score'
import { Col } from 'reactstrap'

export const GameScreen = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 3, justifyContent: 'center', height: '100%' }} >
      <Score />
      <Board />
      <Score />
    </ div>
  )
}
