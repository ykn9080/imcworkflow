import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const glovalVariableReducer = (state = globalVar, action) => {
  return { ...state, [action.type]: action.payload };
};

export default counterSlice.reducer;

const globalVar = {
  openDialog: false,
  openPopup: false,
  dispatchData: [],
  onGoing: null, //ongoing task list
  imsiForm: null, //임시저장된 form
  userId: null,
  userList: null,
  processTypeCount: null, //process type별 갯수
  processArray: null, //process의 단계별 설정
  editorText: "",
};
