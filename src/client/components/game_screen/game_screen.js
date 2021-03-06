import React from 'react'

import Board from '../board/board'
import Score from '../score/score'
import { Col } from 'reactstrap'
import Spectre from '../spectre/spectre'
import { VictoryFrame } from '../victory_screen/victory_screen';
import { LossFrame } from '../loss_screen/loss_screen';
import { SoloEndFrame } from '../solo_end/solo_end';
import { Loader } from '../loader/loader';

export const GameScreen = () => {

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '100%' }} >
      <Score />
      <Board />
      <VictoryFrame/>
      <LossFrame/>
      <SoloEndFrame/>
      <Spectre />
      <Loader/>
    </ div>
  )
}
