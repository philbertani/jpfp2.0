import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Campuses from "./Campuses"
import Students from "./Students"
import OneCampus from "./oneCampus"
import OneStudent from "./oneStudent"
import AddStudent from "./addStudent"
import EditStudent from './editStudent'
import DeleteStudent from  "./deleteStudent"
import AddCampus from "./addCampus"

import { fetchAllCampuses } from "../slices/campusesSlice";

const Main = () => {

/*   const dispatch = useDispatch();
  useEffect( ()=>{
    dispatch(fetchAllCampuses())
  }, [dispatch] ) */

  return (
    <div >
      <Navbar key='navbar'/>

      <Routes>
        <Route path="/students/edit/:studentId" element={<EditStudent />} /> 
        <Route path="/students" element={<Students />} />
        <Route path="/students/:studentId" element={<OneStudent />} />
        <Route path="/students/add/*" element={<AddStudent />} />
        <Route path="/students/delete/:studentId" element={<DeleteStudent />} />
        <Route path="/campuses" element={<Campuses />} />
        <Route path="/campuses/:campusId" element={<OneCampus />} />
        <Route path="/campuses/add" element={<AddCampus />} />
        <Route path="/campuses/enroll/:campusId/:campusName" element={<Students/>} />
        <Route path="/*" element={<Campuses />} />
      </Routes>
    </div>
  );
};

export default Main;
