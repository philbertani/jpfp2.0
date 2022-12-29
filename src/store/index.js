
import { configureStore } from "@reduxjs/toolkit";
import  campusesReducer from '../slices/campusesSlice'
import  studentsReducer from '../slices/studentsSlice'
import oneCampusReducer from "../slices/oneCampusSlice"
import oneStudentReducer from "../slices/oneStudentSlice"
import addStudentReducer from "../slices/addStudentSlice"
import addCampusReducer from "../slices/addCampusSlice"

const store = configureStore({
  reducer: {
    campuses: campusesReducer,
    students: studentsReducer,
    oneCampus: oneCampusReducer,
    oneStudent: oneStudentReducer,
    addStudent: addStudentReducer,
    addCampus: addCampusReducer
  }
});

export default store;