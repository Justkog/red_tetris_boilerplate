import { setLogin } from "../actions/user";
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { LoginComponent } from "../components/login/login";

const mapStateToProps = (state) => {
	return {
		login: state.user.login || ''
	}
}

const mapDispatchToProps = (dispatch, props) => {
    console.dir(props)
	return {
		onSetLogin: login => {
            console.log('onSetLogin', login)
			dispatch(setLogin(login))
        },
	}
}

export const Login = withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginComponent))