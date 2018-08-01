import React from 'react'
import { connect } from 'react-redux'
import './rooms.css'

import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { setLogin } from '../../actions/user';
import { joinRoom, joinRoomAsync } from '../../actions/room';
import { showRoot } from '../../actions/rooms';
import { restartSocket } from '../../actions/socket';
import { Loader } from '../loader/loader';

const Rooms = ({history, rooms, roomName, userName, onSetLogin, onJoinRoom}) => {
	
	if (!userName)
	{
		console.log('forward to login')
		setTimeout(() => {
			history.push(`/login`)
		}, 0);
		return null
	}

	function handleChange(e) {
		roomName = e.target.value
	}

	function joinRoom(name) {
		console.log(name)
		console.log(`pushing /#${name}[${userName}]`)
		onJoinRoom(name)
		history.push(`/#${name}[${userName}]`)
	}

	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1 style={{ color: 'var(--gray-dark)' }}>Rooms</h1>
			</Row>
			<Row className="justify-content-center" style={{marginBottom: '10%'}}>
				<ListGroup style={{ width: '50%', minWidth: '570px'}}>
					{rooms.map((room) => 
						// <ListGroupItem key={room} onClick={() => { joinRoom(room) }}>{room}</ListGroupItem>
						<Button 
							key={room} 
							className="list-group-item list-group-item-action room-entry" 
							color="primary" 
							size="lg" 
							onClick={() => { joinRoom(room) }}
							// style={{color: 'white', backgroundColor: 'var(--primary)', }}
						>{room}</Button>
					)}
				</ListGroup>
			</Row>
			<Card>
				<CardBody>
					<Row className="justify-content-center">
						<Form>
							<FormGroup row style={{marginBottom: 0}}>
								<Label for="usernameInput" sm={4} size="lg">Room name</Label>
								<Col>
									<Input value={roomName} onChange={handleChange} type="text" name="roomname" id="roomnameInput" placeholder="" bsSize="lg" />
								</Col>
								<Col sm={3}>
									<Button color="primary" size="lg" onClick={() => { joinRoom(roomName) }}>Create</Button>{' '}
								</Col>
							</FormGroup>
						</Form>
					</Row>
				</CardBody>
			</Card>
			<Loader/>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		rooms: state.rooms,
		roomName: state.roomName,
		userName: state.user.login,
	}
}

const mapDispatchToProps = (dispatch, state) => {
	return {
		onSetLogin: login => {
			dispatch(setLogin(login))
        },
        onJoinRoom: name => {
			dispatch(joinRoomAsync(name))
		}
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Rooms))