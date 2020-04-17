import {
    ADD_REGION,
    SET_PARENT_REGION,
    MOVE_REGION,
    UPDATE_DISPLAY_NAME,
    REMOVE_REGION,
    INIT_WAVESURFER,
} from '../actions/Actions'

import { pureArrayPush, findRegion, snapEpsilon, randomRGBA, addChildRegion } from '../Utils'

import { WaveSurfer } from '../wavesurfer'

const initialState = {
    regions: [],
    parent: null,
    wavesurfer: null
}

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REGION:

            let regions = pureArrayPush(state.regions, action.region)

            action.region.children = []
            action.region.isVisible = action.region.isVisible === undefined ? true : action.region.isVisible
            action.region.color = randomRGBA()
            action.region.parent = null


            let parent = findRegion(regions, state.parent)
            parent && parent.children.push(action.region.id)
            parent && (action.region.parent = parent.id)

            return {
                ...state,
                regions: regions
            }
        case SET_PARENT_REGION: {
            return {
                ...state,
                parent: action.id
            }
        }
        case MOVE_REGION: {
            let regions = [...state.regions]
            let region = findRegion(regions, action.id)
            region.start = action.start
            region.end = action.end

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
            wavesurfer.ready = false
            wavesurfer.initRegions()
    
            return { 
                ...state,
                wavesurfer: wavesurfer
            }
        } 
        default:
            return state;
    }
}