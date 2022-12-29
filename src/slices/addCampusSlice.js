import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addCampus = createAsyncThunk('/api/campuses/add', async(form)=>{

    try {
        const response = await axios.post('/api/campuses/add',{formData:form})

        if (response.status === 210) {
            //console.log('user already in DB')  
        }

        const status = response.status;
        const data = response.data;
        
        return  [response.data, status]; //data
    }
    catch (err) {
        console.log('add campus error: ', err.response.data)
        //details of the err are in err.reponse.data
        return [err.response.data, -1]
    }
})

export const addCampusSlice = createSlice({
    name: 'addCampus',
    initialState: {
        data:{},
        dataStatus:0
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addCampus.fulfilled,(state,action)=>{
            state.data = action.payload[0];
            state.dataStatus = action.payload[1];
        })

    }
})

export const selectDbStatus = (state) => {
    return [state.addCampus.dataStatus,state.addCampus.data] }

export const selectAddCampusData = (state) => { return state.addCampus.data}

export default addCampusSlice.reducer