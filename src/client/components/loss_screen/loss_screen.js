import React from 'react'
import * as R from 'ramda'
import './loss_screen.css'
import { connect } from 'react-redux'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button, ListGroup, ListGroupItem, Card, CardBody } from 'reactstrap'

const LossFrameComponent = ({victorious}) => {
    if (victorious != false)
        return null
    return (
        <Row className={'end-frame-container'} style={{position: 'absolute', padding: '5vh 0', height: '100%'}}>
            <Col style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Row style={{justifyContent: 'center'}}>
                    <span id="loss-title-icon" className={'title-icon'} style={{}}><i className={"fas fa-skull"}/></span>
                </Row>
                <Row style={{}}>
                    <span id="loss-title" className={'title'}>You Lose!</span>
                </Row>
                <Row style={{justifyContent: 'space-evenly', marginTop: '15px'}}>
                    <Button size="lg">
                        Back to Rooms
                    </Button>
                    <Button size="lg">
                        Lobby
                    </Button>
                </Row>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => {
	return {
		victorious: state.game.victorious,
	}
}

export const LossFrame = connect(mapStateToProps, null)(LossFrameComponent)