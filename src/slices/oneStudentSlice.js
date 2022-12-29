import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchOneStudent = createAsyncThunk('/api/students/:id',async (id)=>{
    try {
        const response = await axios.get('/api/students/'+id)
        return response.data
    }
    catch (err) {
        console.log(err)
    }
})

export const destroyStudent = createAsyncThunk('/api/students/delete/:id',async (id)=>{
    try {
        const response = await axios.delete('/api/students/delete/'+id)
        console.log('returned from delete')
        return [id,response.status]
    }
    catch (err) {
        console.log(err)
    }
})

const oneStudentSlice = createSlice({
    name: 'oneStudent',
    initialState: {
        apiData: {},
        hover: [],
        dbUpdated: false,
        deleteStatus: {},
    },
    reducers: {
        setHover(state,action) { 
            state.hover = action.payload
        }, 
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOneStudent.fulfilled, (state,action)=>{
            //console.log('onestudent data',action.payload)
            state.apiData = action.payload
        })
        builder.addCase(destroyStudent.fulfilled, (state,action)=> {
            console.log('slice',action.payload)
            state.deleteStatus[action.payload[0]] = action.payload[1]
        })
    }
})

export const selectHover = (state)=>{
    return state.oneStudent.hover;
}
export const selectOneStudent = (state)=>{
    return state.oneStudent.apiData
}
export const selectDeleteStatus = (state)=>{
    return state.oneStudent.deleteStatus
}

export const { setHover } = oneStudentSlice.actions;

export default oneStudentSlice.reducer;