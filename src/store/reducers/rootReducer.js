import {combineReducers} from 'redux';
import { connectRouter } from 'connected-react-router';
import appReducer from "./appReducer";
import userReducer from "./userReducer";
import diseaseReducer from './diseaseReducer';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistCommonConfig = {
    storage: storage, //Sử dụng localStorage để lưu Redux state.
    stateReconciler: autoMergeLevel2, //Giúp giữ lại dữ liệu cũ khi khởi động lại ứng dụng.
};

const userPersistConfig = {
    ...persistCommonConfig,
    key: "user",
    whitelist: ["isLoggedIn", "token", "userInfo"],
};

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        user: persistReducer(userPersistConfig, userReducer),
        app: appReducer,
        disease: diseaseReducer,
    });