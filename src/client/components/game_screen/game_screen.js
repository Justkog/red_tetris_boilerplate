import React from 'react'

import Board from '../board/board'
import Score from '../score/score'
import { Col } from 'reactstrap'
import { GameEndModal } from '../game_end_modal/game_end_modal';
import Spectre from '../spectre/spectre'

export const GameScreen = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 5, justifyContent: 'space-around', height: '100%', width: '90%' }} >
      <Score />
      <Board />
      <GameEndModal/>
      <Spectre />
    </ div>
  )
}
