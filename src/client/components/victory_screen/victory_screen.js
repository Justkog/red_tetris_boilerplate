import React from 'react'
import * as R from 'ramda'
import './victory_screen.css'
import { connect } from 'react-redux'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import { withRouter } from 'react-router-dom';
import { stopGame } from '../../actions/game';
import { leaveRoomAsync } from '../../actions/room';

const VictoryFrameComponent = ({history, victorious, onGameStop, onLeaveRoom}) => {
    if (victorious != true)
        return null

    const backToRooms = () => {
        console.log('backToRooms')
        history.push('rooms')
        onGameStop()
        onLeaveRoom()
    }

    const backToLobby = () => {
        console.log('backToLobby')
        onGameStop()
    }

    return (
        <Row className={'end-frame-container'} style={{position: 'fixed', padding: '5vh 0', height: '100%', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <Col style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Row style={{justifyContent: 'center'}}>
                    <span id="victory-title-icon" className={'title-icon'} style={{}}><i className={"fas fa-crown"}/></span>
                </Row>
                <Row style={{justifyContent: 'center', textAlign: 'center'}}>
                    <span id="victory-title" className={'title'}>You Win!</span>
                </Row>
                <Row style={{justifyContent: 'space-evenly', marginTop: '15px'}}>
                    <Button size="lg" onClick={backToRooms}>
                        Back to Rooms
                    </Button>
                    <Button size="lg" onClick={backToLobby}>
                        Lobby
                    </Button>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
	return {
		victorious: state.game.victorious,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onGameStop: () => {
			dispatch(stopGame())
        },
        onLeaveRoom: () => {
			dispatch(leaveRoomAsync())
		}
	}
}

export const VictoryFrame = withRouter(connect(mapStateToProps, mapDispatchToProps)(VictoryFrameComponent))