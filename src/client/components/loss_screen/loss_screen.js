import React from 'react'
import * as R from 'ramda'
import './loss_screen.css'
import { connect } from 'react-redux'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import { stopGame, waitGameEndAsync } from '../../actions/game';
import { leaveRoomAsync } from '../../actions/room';

const LossFrameComponent = ({history, victorious, waitingEnd, onGameStop, onLeaveRoom, onWaitGameEnd}) => {
    if (victorious != false)
        return null

    const backToRooms = () => {
        console.log('backToRooms')
        history.push('rooms')
        onGameStop()
        onLeaveRoom()
    }

    const waitRoomReopen = () => {
        console.log('waitRoomReopen')
        onWaitGameEnd()        
    }

    return (
        <Row className={'end-frame-container'} style={{position: 'fixed', padding: '5vh 0', height: '100%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <Col style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Row style={{justifyContent: 'center'}}>
                    <span id="loss-title-icon" className={'title-icon'} style={{}}><i className={"fas fa-skull"}/></span>
                </Row>
                <Row style={{justifyContent: 'center'}}>
                    <span id="loss-title" className={'title'}>You Lose!</span>
                </Row>
                <Row style={{justifyContent: 'space-evenly', marginTop: '15px'}}>
                    <Button size="lg" onClick={backToRooms}>
                        Back to Rooms
                    </Button>
                    <Button size="lg" onClick={waitRoomReopen} disabled={waitingEnd} className={ waitingEnd ? 'waiting' : ''}>
                        { waitingEnd ? 'Please wait..' : 'Wait for Revenge!'}
                    </Button>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
	return {
		victorious: state.game.victorious,
		waitingEnd: state.game.waitingEnd,
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
        onWaitGameEnd: () => {
			dispatch(waitGameEndAsync())
		}
	}
}

export const LossFrame = withRouter(connect(mapStateToProps, mapDispatchToProps)(LossFrameComponent))