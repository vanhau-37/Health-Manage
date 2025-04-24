import actionTypes from './actionTypes';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (token, userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    token: token, 
    userInfo: userInfo,
});

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL,
});

export const processLogout = () => {
    return {
        type: actionTypes.PROCESS_LOGOUT,
    };
};