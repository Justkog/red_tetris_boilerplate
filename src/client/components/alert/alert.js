import React from 'react'
import { connect } from 'react-redux'
import './alert.css'
import { Alert, Container } from 'reactstrap'
import * as R from 'ramda'

export const AlertComponent = ({alerts}) => {

    if (R.length(alerts) === 0)
        return null
	return (
		<Container className='alert-container'>
			{R.addIndex(R.map)((alert, index) => 
				<Alert key={index.toString()} color="danger">
					{ alert.message }
				</Alert>
			)(alerts)}
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		alerts: state.alert,
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

export const AlertNotifier = connect(mapStateToProps, mapDispatchToProps)(AlertComponent)