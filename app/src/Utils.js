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