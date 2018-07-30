import React from 'react'
import { connect } from 'react-redux'
// import './login.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { joinSoloRoomAsync } from '../../actions/room';

const HomeComponent = ({history, onJoinSolo}) => {
	const solo = () => {
		onJoinSolo()
    }
    
    const multiplayer = () => {
		history.push('login')
    }

	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1>Red Tetris</h1>
			</Row>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
                <Col xs={{ size: 3, offset: 3 }} style={{textAlign: 'center'}}>
    				<Button color="primary" size="lg" onClick={() => solo()}>Play solo!</Button>{' '}
                </Col>
                <Col xs={{ size: 3 }} style={{textAlign: 'center'}}>
    				<Button color="primary" size="lg" onClick={() => multiplayer()}>Multiplayer!</Button>{' '}
                </Col>
                <Col xs={{ size: 3 }}>
                </Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {

	}
}

const mapDispatchToProps = dispatch => {
	return {
		onJoinSolo: () => dispatch(joinSoloRoomAsync())
	}
}

export const Home = withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeComponent))