import actionTypes from "../actions/actionTypes";

const initialState = {
    stringText: ""
};

const diseaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SEARCHED_DISEASE:
            console.log("search disease", action.stringText)
            return {
                ...state,
                stringText: action.stringText
            };
        default:
            return state
    }
}

export default diseaseReducer