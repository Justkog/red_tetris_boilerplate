export const LOGIN_SET = 'LOGIN_SET'
export const LOGIN_RESET = 'LOGIN_RESET'

export const setLogin = (login) => {
  return {
    type: LOGIN_SET,
    login: login,
  }
}

export const resetLogin = () => {
  return {
    type: LOGIN_RESET,
  }
}

