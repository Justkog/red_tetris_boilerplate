import React from 'react'
import { connect } from 'react-redux'
// import './login.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { setLogin } from '../../actions/user';
import { Loader } from '../loader/loader';
import { AlertNotifier } from '../alert/alert';

const LoginComponent = ({history, login, onSetLogin}) => {
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

const mapStateToProps = (state) => {
	return {
		login: undefined
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSetLogin: login => {
			dispatch(setLogin(login))
		}
	}
}

export const Login = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginComponent))