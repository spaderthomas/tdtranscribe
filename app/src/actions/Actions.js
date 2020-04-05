export const ADD_REGION = 'AddRegion'
export const SET_SELECTED_REGION = 'SetSelectedRegion'
export const ADD_CHILD = 'AddChild'
export const ADD_ROOT_REGION = 'AddRootRegion'
export const MOVE_REGION = 'MoveRegion'
export const SET_REGION_VISIBILITY = 'SetRegionVisibility'
export const SHOW_ROOT_REGIONS = 'ShowRootRegions'
export const UPDATE_DISPLAY_NAME = 'UpdateDisplayName'

export const addRegion = (region) => {
    return {    
        type: ADD_REGION,
        region: region
    }
}

export const setSelectedRegion = (id) => {
    return {
        type: SET_SELECTED_REGION,
        id: id
    }
}

export const addToChildren = (parent, child) => {
    return {
        type: ADD_CHILD,
        parent: parent,
        child: child
    }
}

export const addRootRegion = (region) => {
    return {
        type: ADD_ROOT_REGION,
        region: region
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

export const setRegionVisibility = (id, isVisible) => {
    return {
        type: SET_REGION_VISIBILITY,
        id: id,
        isVisible: isVisible
    }
}

export const showRootRegions = () => {
    return {
        type: SHOW_ROOT_REGIONS
    }
}

export const updateDisplayName = (id, name) => {
    return {
        type: UPDATE_DISPLAY_NAME,
        id: id,
        name: name
    }
}