export const ADD_REGION = 'AddRegion'
export const SET_SELECTED_REGION = 'SetSelectedRegion'

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