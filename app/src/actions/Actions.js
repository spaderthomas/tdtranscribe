export const ADD_REGION = 'AddRegion'
export const SET_SELECTED_REGION = 'SetSelectedRegion'
export const ADD_CHILD = 'AddChild'
export const ADD_ROOT_REGION = 'AddRootRegion'
export const UPDATE_REGION = 'UpdateRegion'

export const addRegion = (region) => {
    return {    
        type: ADD_REGION,
        region: region
    }
}

export const setSelectedRegion = (region) => {
    return {
        type: SET_SELECTED_REGION,
        region: region
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

export const updateRegion = (id, start, end) => {
    return {
        type: UPDATE_REGION,
        id: id,
        start: start,
        end: end
    }
}