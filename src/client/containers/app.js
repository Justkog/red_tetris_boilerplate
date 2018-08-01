import React from 'react'
import { connect } from 'react-redux'

import  { Route, Switch, BrowserRouter, HashRouter, withRouter } from 'react-router-dom'
import { Router } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import Rooms from '../components/rooms/rooms';
import InternalRouter from './internalRouter';
import { Login } from './login';

export const history = createBrowserHistory()

const App = ({message}) => {
	return (
			/* <Route
				path='/about'
				render={(props) => <About {...props} extra={someVariable} />}
			/> */
		<Router history={history}>
			<Switch>
				<Route exact path='/' render={InternalRouter} />
				<Route exact path='/rooms' render={Rooms} />
				<Route exact path='/login' render={Login} />
			</Switch>
		</Router>
	)
}

const mapStateToProps = (state) => {
	return {
		message: state.alert.message
	}
}
export default connect(mapStateToProps, null)(App)


