import React from 'react'
import { connect } from 'react-redux'
import Board from '../components/board/board'
import  { Route, Switch, BrowserRouter, HashRouter, withRouter } from 'react-router-dom'
import { Login } from '../components/login/login';
import Rooms from '../components/rooms/rooms';

const App = ({message}) => {
	return (
			/* <Route
				path='/about'
				render={(props) => <About {...props} extra={someVariable} />}
			/> */
		<HashRouter>
			<Switch>
				<Route exact path='/' component={Login} />
				<Route exact path='/rooms' render={Rooms} />
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


