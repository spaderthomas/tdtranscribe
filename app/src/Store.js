import { createStore } from 'redux'
import { rootReducer } from './reducers/Reducer'

export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// const unsubscribe = store.subscribe(() => {
//     console.log('state was updated!')
//     console.log(store.getState())
// })
