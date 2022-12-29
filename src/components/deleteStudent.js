import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { selectOneStudent, fetchOneStudent, destroyStudent, selectDeleteStatus } from "../slices/oneStudentSlice";

const deleteStudent = () => {

  const {studentId} = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOneStudent(studentId));
  }, [dispatch]);

  const studentData = useSelector(selectOneStudent);

  const deleteStatus = useSelector(selectDeleteStatus);
  console.log(deleteStatus)

  function deleteAlready() {
    dispatch(destroyStudent(studentId))
    console.log('trying to delete')
  }

  if ( deleteStatus[studentId]  ) {
    return ([
        <div style={{margin:'2vw', marginTop:'15vh'}}>
            <h1>this student has been deleted</h1>
            <h1>the student ID was: {studentId} </h1>
        </div>
    ])
  } else {
  return ( [
    <div style={{margin:'2vw',marginTop:'14vh', marginRight:'2vw', wordBreak:'break-all'}}>
        <h2>You Will Be Deleting This Student</h2>
        <h2>Click on the Big Red Button</h2>
        <p>{JSON.stringify(studentData)}</p>
    </div>,

    <button onClick={deleteAlready} style={{marginLeft:'2vw',marginTop:'2vh'}} className='bigRedButton'>DELETE ME</button>
  ])
}
};

export default deleteStudent
