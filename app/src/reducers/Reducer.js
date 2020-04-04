import { 
    ADD_REGION,
    SET_SELECTED_REGION,
    ADD_CHILD,
    MOVE_REGION,
    SET_REGION_VISIBILITY,
    SHOW_ROOT_REGIONS
} from '../actions/Actions'

import { pureArrayPush, findRegion, snapEpsilon, randomRGBA } from '../Utils'

const initialState = {
    regions: [],
    selectedRegion: null,
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REGION:
            action.region.children = []
            action.region.isVisible = true
            action.region.drag = false
            action.region.color = randomRGBA()
    
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
            let regions = [...state.regions]
            for (let region of regions) {
                region.isVisible = false
            }

            return {
                ...state,
                regions: regions,
                selectedRegion: action.region,
            }
        case ADD_CHILD:
            action.parent.children.push(action.child)

            return {
                ...state,
                regions: [...state.regions]
            }
        case MOVE_REGION: {
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

            return {
                ...state,
                regions: regions
            }
        }
        case SET_REGION_VISIBILITY: {
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)
            region.isVisible = action.isVisible

            return {
                ...state,
                regions: regions
            }
        }
        case SHOW_ROOT_REGIONS: {
            let regions = [...state.regions]
            for (let region of regions) {
                region.isVisible = true
            }

            return {
                ...state,
                regions: regions
            }

        }
        default:
            return state;
    }
}