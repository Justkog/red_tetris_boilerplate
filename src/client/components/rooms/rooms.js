import React from 'react'
import { connect } from 'react-redux'
import './rooms.css'

import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';

const Rooms = ({rooms, roomName}) => {
	
	function handleChange(e) {
		roomName = e.target.value
	}

	function createRoom(name) {
		console.log(name)
	}

	function joinRoom(name) {
		console.log(name)
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
									<Button color="primary" size="lg" onClick={() => { createRoom(roomName) }}>Create</Button>{' '}
								</Col>
							</FormGroup>
						</Form>
					</Row>
				</CardBody>
			</Card>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		rooms: state.rooms,
		roomName: state.roomName,
	}
}

export default withRouter(connect(mapStateToProps, null)(Rooms))