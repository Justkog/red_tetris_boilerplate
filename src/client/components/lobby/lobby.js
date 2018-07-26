import React from 'react'
import { connect } from 'react-redux'
// import './rooms.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody, CardHeader } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { requestGameStartAsync } from '../../actions/game';

const Lobby = ({history, roomName, users, login, onStartGame}) => {

	const admin = R.prop('is_master', R.head(R.filter((user) => user.name == login, users)))
	
	function startGame() {
		console.log('starting')
		onStartGame(roomName)
	}

	function backToRooms() {
		history.push('rooms')
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
							{users.map((user) => 
								<Button 
									key={user.name} 
									className="list-group-item list-group-item-action room-entry" 
									color="primary" 
									size="lg" 
									onClick={() => {  }}
									// style={{color: 'white', backgroundColor: 'var(--primary)', }}
								>{user.name}</Button>
							)}
						</ListGroup>
					</Row>
					<hr/>
					<Row className="justify-content-center">
						<Col sm={3}>
							<Button disabled={!admin} color="primary" size="lg" onClick={() => { startGame() }} block>Start</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
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
		}
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby))