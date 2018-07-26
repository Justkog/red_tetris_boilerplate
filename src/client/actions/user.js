export const LOGIN_SET = 'LOGIN_SET'

export const setLogin = (login) => {
  return {
    type: LOGIN_SET,
    login: login,
  }
}

