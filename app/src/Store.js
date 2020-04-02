import { createStore } from 'redux'
import { rootReducer } from './reducers/Reducer'

export const store = createStore(rootReducer)

const unsubscribe = store.subscribe(() => {
    console.log('state was updated!')
    console.log(store.getState())
})
