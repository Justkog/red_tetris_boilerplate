import React from 'react'

import Board from '../board/board'
import Score from '../score/score'
import { Col } from 'reactstrap'
import Spectre from '../spectre/spectre'
import { VictoryFrame } from '../victory_screen/victory_screen';
import { LossFrame } from '../loss_screen/loss_screen';

export const GameScreen = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 5, justifyContent: 'space-around', height: '100%' }} >
      <Score />
      <Board />
      <VictoryFrame/>
      <LossFrame/>
      <Spectre />
    </ div>
  )
}
