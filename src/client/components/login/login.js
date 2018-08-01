import React from 'react'
// import './login.css'
import { Container, Form, FormGroup, Label, Col, Input, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { Loader } from '../loader/loader';
import { AlertNotifier } from '../alert/alert';

export const LoginComponent = ({history, login, onSetLogin}) => {
	function play(userName) {
		onSetLogin(userName)
		history.push('rooms')
	}

	function handleChange(e) {
		// onSetLogin(e.target.value)
		login = e.target.value
	}

	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1>Red Tetris</h1>
			</Row>
			<Row className="justify-content-center">
				<Form>
					<FormGroup row>
						<Label for="usernameInput" sm={4} size="lg">Your name</Label>
						<Col sm={8}>
							<Input value={login} onChange={handleChange} type="text" name="username" id="usernameInput" placeholder="player1" bsSize="lg" />
						</Col>
					</FormGroup>
				</Form>
			</Row>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<Button color="primary" size="lg" onClick={() => play(login)}>Play!</Button>{' '}
			</Row>
			<Loader/>
			<AlertNotifier/>
		</Container>
	)
}