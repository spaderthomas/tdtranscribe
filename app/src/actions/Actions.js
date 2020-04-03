export const ADD_REGION = 'AddRegion'

export const addRegion = (region) => {
    return {    
        type: ADD_REGION,
        region: region
    }
}