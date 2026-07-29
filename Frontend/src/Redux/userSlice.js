import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',          // used as prefix for action types
  initialState: { 
    user: null
   },  // starting state

  reducers: {               // functions that update state
    setUser:(state,action)=>{
        state.user = action.payload
    }
  },
});

// Export actions (to use in components)
export const { setUser } = userSlice.actions;

// Export reducer (to register in store)
export default userSlice.reducer;