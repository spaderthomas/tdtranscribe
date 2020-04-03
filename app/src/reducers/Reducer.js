import { 
    ADD_REGION,
    SET_SELECTED_REGION
} from '../actions/Actions'

import { pureArrayPush } from '../Utils'
const initialState = {
    regions: [],
    selectedRegion: null
}

export const rootReducer = (state = initialState, action) => {
    if (typeof state === 'undefined') {
        console.log('NO STATE YET')
        return initialState
    }

    switch (action.type) {
        case ADD_REGION:
            return {
                ...state,
                regions: pureArrayPush(state.regions, action.region)
            }
        case SET_SELECTED_REGION:
            return {
                ...state,
                selectedRegion: action.region
            }
        default:
            return state;
    }
}