import React from 'react'
import { connect } from 'react-redux'
// import './login.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';

const Rooms = ({rooms, roomName}) => {
	
	function handleChange(e) {
		roomName = e.target.value
	}

	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1>Rooms</h1>
			</Row>
			<Row className="justify-content-center" style={{marginBottom: '10%'}}>
				<ListGroup>
					{rooms.map((room) => 
						<ListGroupItem key={room}>{room}</ListGroupItem>
					)}
				</ListGroup>
			</Row>
			<Card><CardBody>
				<Row className="justify-content-center">
					<Form>
						<FormGroup row style={{marginBottom: 0}}>
							<Label for="usernameInput" sm={4} size="lg">Room name</Label>
							<Col sm={5}>
								<Input value={roomName} onChange={handleChange} type="text" name="roomname" id="roomnameInput" placeholder="" bsSize="lg" />
							</Col>
							<Col sm={3}>
								<Button color="primary" size="lg" onClick={() => {}}>Create</Button>{' '}
							</Col>
						</FormGroup>
					</Form>
				</Row>
			</CardBody></Card>
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