import actionTypes from "./actionTypes";

export const searchedDisease = (stringText) => ({
    type: actionTypes.SEARCHED_DISEASE,
    stringText: stringText
})