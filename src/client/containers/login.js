import { setLogin } from "../actions/user";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { LoginComponent } from "../components/login/login";

const mapStateToProps = (state) => {
	return {
		login: undefined
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onSetLogin: login => {
			dispatch(setLogin(login))
		}
	}
}

export const Login = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginComponent))