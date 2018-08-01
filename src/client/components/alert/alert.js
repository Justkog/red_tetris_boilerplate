import React from 'react'
import { connect } from 'react-redux'
import './alert.css'
import { Alert, Container } from 'reactstrap'
import * as R from 'ramda'

export const AlertComponent = ({alert}) => {

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

export const AlertNotifier = connect(mapStateToProps, mapDispatchToProps)(AlertComponent)