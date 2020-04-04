export const isEmptyObject = (obj) => {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

export const pureArrayPush = (array, element) => {
    return [...array, element]
}

export const back = (array) => {
    return array[array.length - 1]
}

export const randomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

export const randomRGBA = () => {
    return 'rgba(' + randomInt(0, 255).toString() + ', ' + randomInt(0, 255).toString() + ', ' + randomInt(0, 255).toString() + ', 0.1)'
}

export const findRegion = (regions, id) => {
    for (let region of regions) {
        if (region.id === id) {
            return region
        } 
    }

    return null
}

export const snapEpsilon = 1