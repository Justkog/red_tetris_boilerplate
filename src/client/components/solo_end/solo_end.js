import React from 'react'
import * as R from 'ramda'
import './solo_end.css'
import { connect } from 'react-redux'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import { stopGame, requestGameStartAsync } from '../../actions/game';
import { leaveRoomAsync } from '../../actions/room';

const SoloEndFrameComponent = ({history, victorious, solo, onGameStop, onLeaveRoom, onStartGame}) => {
    if (victorious != false || !solo)
        return null

    const restart = () => {
        console.log('backToRooms')
        onGameStop()
        onStartGame()
    }

    const goMultiplayer = () => {
        onGameStop()
        onLeaveRoom()
        history.push('rooms')
    }

    return (
        <Row className={'end-frame-container'} style={{position: 'fixed', padding: '5vh 0', height: '100%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <Col style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Row style={{justifyContent: 'center'}}>
                    <span id="solo-title-icon" className={'title-icon'} style={{}}><i className={"fab fa-fort-awesome"}/></span>
                </Row>
                <Row style={{justifyContent: 'center', textAlign: 'center'}}>
                    <span id="solo-title" className={'title'}>Game over</span>
                </Row>
                <Row style={{justifyContent: 'space-evenly', marginTop: '15px'}}>
                    <Button size="lg" onClick={restart}>
                        Retry!
                    </Button>
                    <Button size="lg" onClick={goMultiplayer}>
                        Multiplayer!
                    </Button>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
	return {
        victorious: state.game.victorious,
		solo: state.room.solo,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onGameStop: () => {
			dispatch(stopGame())
        },
        onLeaveRoom: () => {
			dispatch(leaveRoomAsync())
        },
        onStartGame: () => {
			dispatch(requestGameStartAsync())
		},
	}
}

export const SoloEndFrame = withRouter(connect(mapStateToProps, mapDispatchToProps)(SoloEndFrameComponent))