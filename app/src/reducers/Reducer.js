import { ADD_REGION } from '../actions/Actions'

const initialState = {
    regions: []
}

export const rootReducer = (state = initialState, action) => {
    if (typeof state === 'undefined') {
        return initialState
    }

    switch (action.type) {
        case ADD_REGION:
            let newRegions = state.regions 
            newRegions.push(action.name)
            return {
                ...state,
                regions: newRegions
            }
        default:
            return state;
    }
}