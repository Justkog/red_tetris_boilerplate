import React from 'react'
// import './login.css'
import { Container, Form, FormGroup, Label, Col, Input, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { Loader } from '../loader/loader';
import { AlertNotifier } from '../alert/alert';

export const play = (userName, history, onSetLogin) => {
	onSetLogin(userName)
	history.push('rooms')
}

export const handleChange = (e, props) => {
	props.onSetLogin(e.target.value)
}

export const keyPress = (e, props) => {
	console.dir(e)
	console.dir(props.login)
	if (e.which === 13 /* Enter */) {
		e.preventDefault();
		if (props.login != undefined)
			play(props.login, props.history, props.onSetLogin)
	}
}

// export const LoginComponent = ({history, login, onSetLogin, onKeyPress, onHandleChange, onPlay}) => {
export const LoginComponent = (props) => {
	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1>Red Tetris</h1>
			</Row>
			<Row className="justify-content-center">
				<Form onKeyPress={(e) => keyPress(e, props)}>
					<FormGroup row>
						<Label for="usernameInput" sm={4} size="lg">Your name</Label>
						<Col sm={8}>
							<Input value={props.login} onChange={(e) => handleChange(e, props)} type="text" name="username" id="usernameInput" placeholder="player1" bsSize="lg" />
						</Col>
					</FormGroup>
				</Form>
			</Row>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<Button color="primary" size="lg" onClick={() => play(props.login, props.history, props.onSetLogin)}>Play!</Button>{' '}
			</Row>
			<Loader/>
			<AlertNotifier/>
		</Container>
	)
}