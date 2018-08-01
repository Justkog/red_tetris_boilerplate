import React from 'react'
import { connect } from 'react-redux'
// import './rooms.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody, CardHeader } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { requestGameStartAsync } from '../../actions/game';
import { restartSocket } from '../../actions/socket';
import { leaveRoomAsync } from '../../actions/room';
import { Loader } from '../loader/loader';
import { AlertNotifier } from '../alert/alert';
import Chat from '../../components/chat/chat';

const Lobby = ({history, roomName, users, login, onStartGame, onLeaveRoom}) => {

	const admin = R.prop('is_master', users[R.head(R.filter((user) => user == login, R.keys(users)))])
	const ready = R.all(R.__, R.keys(users)) ((user) => R.prop('ready', users[user]))
	
	function startGame() {
		console.log('starting')
		onStartGame(roomName)
	}

	function backToRooms() {
		history.push('rooms')
		// onSocketRestart()
		onLeaveRoom()
	}

	// users = ['Jblondea', 'Flevesq']
	console.log('Lobby')

	return (
		<Container>
			<Button color="primary" size="lg" onClick={() => { backToRooms() }}>{'< Back to Rooms'}</Button>
			<Card style={{marginTop: '10%', marginBottom: '10%'}}>
				<CardHeader>
					<Row className="justify-content-center">
						<h1 style={{ color: 'var(--gray-dark)' }}>{roomName || 'Room'}</h1>
					</Row>
				</CardHeader>
				<CardBody>
					<Row className="justify-content-center">
						<h4>Players</h4>
					</Row>
					<Row className="justify-content-center" style={{}}>
						<ListGroup style={{ width: '50%', minWidth: '570px'}}>
							{R.keys(users).map((user) => 
								<Button 
									key={user} 
									className="list-group-item list-group-item-action room-entry" 
									color="primary" 
									size="lg" 
									onClick={() => {  }}
									// style={{color: 'white', backgroundColor: 'var(--primary)', }}
								>{user}</Button>
							)}
						</ListGroup>
					</Row>
					<hr/>
					<Row className="justify-content-center">
						<Col sm={3}>
							<Button disabled={!admin || !ready} color="primary" size="lg" onClick={() => { startGame() }} block>Start</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
      <Chat />
			<Loader/>
			<AlertNotifier/>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		roomName: state.room.name,
		users: state.room.users || [],
		login: state.user.login,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onStartGame: (roomName) => {
			dispatch(requestGameStartAsync(roomName))
		},
		onLeaveRoom: () => {
			dispatch(leaveRoomAsync())
		}
		// onSocketRestart: () => {
		// 	dispatch(restartSocket())
		// }
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby))