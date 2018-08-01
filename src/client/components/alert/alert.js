import React from 'react'
import { connect } from 'react-redux'
import './alert.css'
import { Alert, Container, Form, FormGroup, Label, Col, Input, Jumbotron, Row, Button } from 'reactstrap'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom';
import { setLogin } from '../../actions/user';
import { Loader } from '../loader/loader';

const AlertComponent = ({alert}) => {

    if (!alert.message)
        return null
	return (
		<Container className='alert-container'>
			<Alert color="danger">
                { alert.message }
            </Alert>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		alert: state.alert,
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

export const AlertNotifier = withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertComponent))