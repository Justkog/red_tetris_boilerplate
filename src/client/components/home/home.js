import React from 'react'
import { connect } from 'react-redux'
import './home.css'
import { Container, Col, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { joinSoloRoomAsync } from '../../actions/room';
import { Loader } from '../loader/loader';

export const HomeComponent = ({history, onJoinSolo, socketStatus}) => {
	const solo = () => {
		onJoinSolo()
    }
    
    const multiplayer = () => {
		history.push('login')
	}
	
	const canPlay = socketStatus === 'connected'

	return (
		<Container>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
				<h1>Red Tetris</h1>
			</Row>
			<Row className="justify-content-center" style={{marginTop: '10%', marginBottom: '10%'}}>
                <Col xs={{ size: 3, offset: 3 }} style={{textAlign: 'center'}}>
    				<Button color="primary" size="lg" onClick={() => solo()} disabled={!canPlay}>Play solo!</Button>{' '}
                </Col>
                <Col xs={{ size: 3 }} style={{textAlign: 'center'}}>
    				<Button color="primary" size="lg" onClick={() => multiplayer()} disabled={!canPlay}>Multiplayer!</Button>{' '}
                </Col>
                <Col xs={{ size: 3 }}>
                </Col>
			</Row>
			<Loader/>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		socketStatus: state.connection.status
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onJoinSolo: () => dispatch(joinSoloRoomAsync())
	}
}

export const Home = withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeComponent))