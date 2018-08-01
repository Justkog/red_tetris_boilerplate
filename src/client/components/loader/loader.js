import React from 'react'
import { connect } from 'react-redux'
import './loader.css'
import { Container, Col, Row } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { joinSoloRoomAsync } from '../../actions/room';

const LoaderComponent = ({history, onJoinSolo, socketStatus}) => {
	
	const canPlay = socketStatus === 'connected'

    if (canPlay)
        return null
	return (
		<Container className='loader-container'>
            <Row style={{ height: '160px', marginTop: '100px' }}>
                <Col style={{textAlign: 'center'}}>
                    <div className='tetris' style={{transform: 'scale(5)'}}>
                        <div className='block1'></div>
                        <div className='block2'></div>
                        <div className='block3'></div>
                        <div className='block4'></div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className='loader-text' style={{textAlign: 'center'}}>
                    { socketStatus === 'disconnected' ? 'Attempting to reconnect..' : 'Connecting..'}
                </Col>
            </Row>
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

export const Loader = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoaderComponent))