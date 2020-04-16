export const ADD_REGION = 'AddRegion'
export const SET_PARENT_REGION = 'SetParentRegion'
export const MOVE_REGION = 'MoveRegion'
export const UPDATE_DISPLAY_NAME = 'UpdateDisplayName'
export const REMOVE_REGION = 'RemoveRegion'
export const INIT_WAVESURFER = 'InitWavesurfer'

export const addRegion = (region) => {
    return {    
        type: ADD_REGION,
        region: region
    }
}

export const removeRegion = (id) => {
    return {    
        type: REMOVE_REGION,
        id: id
    }
}

export const setParentRegion = (id) => {
    return {
        type: SET_PARENT_REGION,
        id: id
    }
}

export const moveRegion = (id, start, end) => {
    return {
        type: MOVE_REGION,
        id: id,
        start: start,
        end: end
    }
}

export const updateDisplayName = (id, name) => {
    return {
        type: UPDATE_DISPLAY_NAME,
        id: id,
        name: name
    }
}

export const initWavesurfer = (element) => {
    return {
        type: INIT_WAVESURFER,
        element: element
    }
}