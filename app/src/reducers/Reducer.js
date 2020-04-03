import { ADD_REGION } from '../actions/Actions'

import { pureArrayPush } from '../Utils'
const initialState = {
    regions: [],
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
        default:
            return state;
    }
}