import { 
    ADD_REGION,
    SET_SELECTED_REGION
} from '../actions/Actions'

import { pureArrayPush } from '../Utils'
const initialState = {
    regions: [],
    selectedRegion: null,
    dog: 10
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REGION:
            return {
                ...state,
                regions: pureArrayPush(state.regions, action.region)
            }
        case SET_SELECTED_REGION:
            return {
                ...state,
                selectedRegion: action.region,
                dog: state.dog + 1
            }
        default:
            return state;
    }
}