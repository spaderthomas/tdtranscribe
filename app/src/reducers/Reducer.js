import {
    ADD_REGION,
    SET_PARENT_REGION,
    ADD_CHILD,
    MOVE_REGION,
    SET_REGION_VISIBILITY,
    UPDATE_DISPLAY_NAME,
    REMOVE_REGION,
    INIT_WAVESURFER,
    SET_REGION_SELECTED
} from '../actions/Actions'

import { pureArrayPush, findRegion, snapEpsilon, randomRGBA } from '../Utils'

import { WaveSurfer } from '../wavesurfer'

const initialState = {
    regions: [],
    parentRegion: null,
    wavesurfer: null
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REGION:
            action.region.children = []
            action.region.isVisible = action.region.isVisible === undefined ? true : action.region.isVisible
            action.region.drag = false
            action.region.color = randomRGBA()
            action.region.selected = false
            action.region.parent = null

            action.region.parent = state.parentRegion

            state.parentRegion && state.parentRegion.children.push(action.region)

            return {
                ...state,
                regions: pureArrayPush(state.regions, action.region)
            }
        case SET_PARENT_REGION: {
            let selected = findRegion(state.regions, action.id)
            return {
                ...state,
                parentRegion: selected
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
        case UPDATE_DISPLAY_NAME: {
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)
            region.displayName = action.name

            return { 
                ...state,
                regions: regions
            }
        }
        case REMOVE_REGION: {
            let regions = [...state.regions]
            let index = 0
            for (let i = 0; i < regions.length; i++) {
                let region = regions[i]
                if (region.id === action.id) {
                    index = i
                    break
                }
            }

            regions.splice(index, 1)

            return {
                ...state,
                regions: regions
            }
        }
        case INIT_WAVESURFER: {
            let wavesurfer = WaveSurfer.create({
                container: action.element,
                waveColor: 'blue'
            })
            return { 
                ...state,
                wavesurfer: wavesurfer
            }
        } 
        case SET_REGION_SELECTED: {
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)
            region.selected = action.selected

            let wsRegion = state.wavesurfer.regions[action.id]
            if (wsRegion) {
                wsRegion.selected = true
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