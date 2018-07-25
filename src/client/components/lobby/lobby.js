import React from 'react'
import { connect } from 'react-redux'
// import './rooms.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody, CardHeader } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';

const Lobby = ({history, roomName, users, admin}) => {
	
	function startGame() {
		console.log('starting')
	}

	function backToRooms() {
		history.push('rooms')
	}

	users = ['Jblondea', 'Flevesq']

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
						<h4>Opponents</h4>
					</Row>
					<Row className="justify-content-center" style={{}}>
						<ListGroup style={{ width: '50%', minWidth: '570px'}}>
							{users.map((user) => 
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
		roomName: state.roomName,
		users: state.users,
		admin: state.admin,
	}
}

export default withRouter(connect(mapStateToProps, null)(Lobby))