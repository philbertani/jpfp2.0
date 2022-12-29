import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllCampuses = createAsyncThunk('/api/campuses',async ()=>{
    try {
        const response = await axios.get('/api/campuses')
        //response.data.studentCount is an extra field created 
        //by Sequelize.fn COUNT of student ids associated with each campus id
        //makes no sense to return the actual data here
        return response.data
    }
    catch (err) {
        console.log(err)
    }
})

const campusesSlice = createSlice({
    name: 'campuses',
    initialState: {
        apiData: [],
        hover: [],
        divRefs: [],
        dbUpdated: false
    },
    reducers: {
        setHover(state,action) { 
            state.hover = action.payload           
        },
        setDBupdated(state,action) {
            state.dbUpdated = true
        },
        setDivRefs(state,action) {
            state.divRefs = action.payload
        }
 
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCampuses.fulfilled, (state,action)=>{
            state.apiData = action.payload
            state.dbUpdated = false
        })
    }
})

export const selectHover = (state)=>{
    return state.campuses.hover;
}
export const selectDBupdated = (state)=>{
    return state.campuses.dbUpdated
}
export const selectDivRefs = (state) => {
    return state.campuses.divRefs
}

export const selectAllCampuses = (state)=>{
    //console.log(state)
    return state.campuses.apiData
}

export const { setHover, setDBupdated, setDivRefs } = campusesSlice.actions;

export default campusesSlice.reducer;