import React from 'react'
import { connect } from 'react-redux'
import Board from '../components/board/board'
import  { Route, Switch, BrowserRouter, HashRouter, withRouter } from 'react-router-dom'
import { Login } from '../components/login/login';
import Rooms from '../components/rooms/rooms';
import Lobby from '../components/lobby/lobby';

const App = ({message}) => {
	return (
			/* <Route
				path='/about'
				render={(props) => <About {...props} extra={someVariable} />}
			/> */
		<HashRouter>
			<Switch>
				<Route exact path='/' render={Login} />
				<Route exact path='/rooms' render={Rooms} />
				<Route exact path='/lobby' render={Lobby} />
				{/* <Board/> */}
			</Switch>
		</HashRouter>
	)
}

const mapStateToProps = (state) => {
	return {
		message: state.alert.message
	}
}
export default connect(mapStateToProps, null)(App)


