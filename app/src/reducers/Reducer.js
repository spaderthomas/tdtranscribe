import {
    ADD_REGION,
    SET_SELECTED_REGION,
    ADD_CHILD,
    MOVE_REGION,
    SET_REGION_VISIBILITY,
    SHOW_ROOT_REGIONS,
    UPDATE_DISPLAY_NAME
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
        case SET_SELECTED_REGION: {
            let regions = [...state.regions]
            let selected = findRegion(regions, action.id)
            if (selected) {
                for (let region of regions) {
                    region.isVisible = false
                }

                for (let region of selected.children) {
                    region.isVisible = true
                }
            }

            return {
                ...state,
                regions: regions,
                selectedRegion: selected
            }
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
                if (Math.abs(other.start - region.end) < snapEpsilon) {
                    region.end = other.start
                    snappedEnd = true
                }
                if (Math.abs(region.start - other.end) < snapEpsilon) {
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
                region.isVisible = region.root
            }

            return {
                ...state,
                regions: regions,
                selectedRegion: null
            }

        }
        case UPDATE_DISPLAY_NAME: {
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)
            region.displayName = action.name

            return { 
                ...state,
                regions: regions
            }
        }
        default:
            return state;
    }
}