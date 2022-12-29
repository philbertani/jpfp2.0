import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllStudents = createAsyncThunk('/api/students',async ()=>{
    try {
        const response = await axios.get('/api/students')
        return response.data
    }
    catch (err) {
        console.log(err)
    }
})

export const updateCampusAsync = createAsyncThunk('/api/students/switchCampus', async (newCampusInput)=>{
    try {
        const response = await axios.put('/api/students/switchCampus', {inp:newCampusInput})
        return [230, newCampusInput ]
    }
    catch (err) {
        console.log(err)
        return [-1, err.response.data]
    }
})

const studentsSlice = createSlice({
    name: 'students',
    initialState: {
        apiData: [],
        hover: [],
        dbUpdated: false,
        campusUpdateStatus: -1,
        updatedCampusInfo: {},
    },
    reducers: {
        setHover(state,action) { 
            state.hover = action.payload
        },
        sortBy(state, action) {
            return state.apiData.slice().sort((a,b)=>{return a.id<b.id})
        },

    },

    extraReducers: (builder) => {
        builder.addCase(fetchAllStudents.fulfilled, (state,action)=>{
            state.apiData = action.payload
            state.dbUpdated = false
        }),

        builder.addCase(updateCampusAsync.fulfilled, (state,action)=>{
            state.campusUpdateStatus = action.payload[0]
            state.updatedCampusInfo = action.payload[1]
            state.dbUpdated = true   
        })

    }
})
export const selectHover = (state)=>{
    return state.students.hover;
}
export const selectAllStudents = (state)=>{
    return state.students.apiData
}
export const selectCampusUpdateStatus = (state)=>{
    //at some point I was getting an error
    //that reducer can not return undefined
    if ( typeof state.students.campusUpdateStatus == 'undefined') {
        return [-1,{}]
    }
    else {
        return [state.students.campusUpdateStatus,state.students.updatedCampusInfo]

    }
}

export const selectdbUpdated = (state)=>{
    return state.students.dbUpdated
}

export const { setHover, sortBy } = studentsSlice.actions;

export default studentsSlice.reducer;