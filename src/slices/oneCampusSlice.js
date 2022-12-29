import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOneCampus = createAsyncThunk('/api/campuses:id',async (id)=>{
    try {
        const response = await axios.get('/api/campuses/'+id)
        return response.data
    }
    catch (err) {
        console.log(err)
    }
})

const oneCampusSlice = createSlice({
    name: 'oneCampus',
    initialState: {
        apiData: {},
        hover: [],
    },
    reducers: {
        setHover(state,action) { 
            state.hover = action.payload           
        },
 
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOneCampus.fulfilled, (state,action)=>{
            state.apiData = action.payload
        })
    }
})
export const selectHover = (state)=>{
    return state.oneCampus.hover;
}
export const selectOneCampus = (state)=>{
    //console.log(state)
    return state.oneCampus.apiData
}

export const { setHover } = oneCampusSlice.actions;

export default oneCampusSlice.reducer;