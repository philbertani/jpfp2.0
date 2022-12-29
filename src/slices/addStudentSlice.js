import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addStudent = createAsyncThunk('/api/students/add', async(form)=>{

    try {
        const response = await axios.post('/api/students/add',{formData:form})

        if (response.status === 210) {
            //console.log('user already in DB')  
        }

        const status = response.status;
        const data = response.data;
        return  [response.data, status]; //data
    }
    catch (err) {
        console.log('add student error: ', err.response.data)
        //details of the err are in err.reponse.data
        return [err.response.data, -1]
    }
})

export const editStudent = createAsyncThunk('/api/students/edit', async(form)=>{

    const studentId = form.student
    try {
        const response = await axios.put(
            '/api/students/edit/'+form.studentId,{formData:form})

        console.log('editstudent response',response)
        const status = response.status;
        const data = response.data;
        
        return  [response.data, status]; //data
    }
    catch (err) {
        console.log('add student error: ', err.response.data)
        //details of the err are in err.reponse.data
        return [err.response.data, -1]
    }
})


export const addStudentSlice = createSlice({
    name: 'addStudent',
    initialState: {
        data:{},
        dataStatus:0
    },
    reducers: {
        resetAddStudent(state) {
            state.addStudent.dataStatus=0
            state.addStudent.data={}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addStudent.fulfilled,(state,action)=>{
            state.data = action.payload[0];
            state.dataStatus = action.payload[1];
        }),

        builder.addCase(editStudent.fulfilled,(state,action)=>{
            state.data = action.payload[0];
            state.dataStatus = action.payload[1];
        }) 
    }
})

export const selectDbStatus = (state) => {
    return [state.addStudent.dataStatus,state.addStudent.data] }

export const selectData = (state) => { return state.addStudent.data}

export const { resetAddStudent } = addStudentSlice.actions

export default addStudentSlice.reducer
