export const ADD_REGION = 'AddRegion'

export const addRegion = (region) => {
    console.log('hi')
    return {    
        type: ADD_REGION,
        region: region
    }
}