import { 
    ADD_REGION,
    SET_SELECTED_REGION,
    ADD_CHILD,
    ADD_ROOT_REGION,
    UPDATE_REGION
} from '../actions/Actions'

import { pureArrayPush, findRegion, snapEpsilon } from '../Utils'

const initialState = {
    regions: [],
    selectedRegion: null,
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REGION:
            if (state.selectedRegion) {
                action.region.root = false
                state.selectedRegion.children.push(action.region)
            } else {
                action.region.root = true
            }
    
            return {
                ...state,
                regions: pureArrayPush(state.regions, action.region)
            }
        case SET_SELECTED_REGION:
            return {
                ...state,
                selectedRegion: action.region,
            }
        case ADD_CHILD:
            action.parent.children.push(action.child)

            return {
                ...state,
                regions: [...state.regions]
            }
        case UPDATE_REGION:
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)

            let snappedStart, snappedEnd = false
            for (let other of state.regions) { 
                if (Math.abs(other.start - region.end) < snapEpsilon ) {
                    console.log('snapped!')
                    region.end = other.start
                    snappedEnd = true
                }
                if (Math.abs(region.start - other.end) < snapEpsilon ) {
                    region.start = other.end
                    snappedStart = true
                }
            }

            if (!snappedStart) region.start = action.start
            if (!snappedEnd) region.end = action.end

            region.updateRender()
            
            return {
                ...state,
                regions: regions
            }
        default:
            return state;
    }
}