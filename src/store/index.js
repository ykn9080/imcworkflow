import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
//import { persistStore } from 'redux-persist';
//import { persistedReducer } from '../reducer';
import { glovalVariableReducer } from "../features";


export const store = configureStore({
  reducer: {global:glovalVariableReducer},
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

//const persistor = persistStore(store);

//export { store, persistor };