import React from 'react'
import { connect } from 'react-redux'
import Board from '../components/board/board'
import  { Route, Switch, BrowserRouter, HashRouter, withRouter } from 'react-router-dom'
import { Login } from '../components/login/login';
import Rooms from '../components/rooms/rooms';
import Lobby from '../components/lobby/lobby';
import InternalRouter from './internalRouter';

const App = ({message}) => {
	return (
			/* <Route
				path='/about'
				render={(props) => <About {...props} extra={someVariable} />}
			/> */
		<BrowserRouter>
			<Switch>
				<Route exact path='/' render={InternalRouter} />
				<Route exact path='/rooms' render={Rooms} />
				<Route exact path='/login' render={Login} />
			</Switch>
		</BrowserRouter>
	)
}

const mapStateToProps = (state) => {
	return {
		message: state.alert.message
	}
}
export default connect(mapStateToProps, null)(App)


