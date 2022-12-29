import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom"

import {
  selectAllStudents,
  fetchAllStudents,
  updateCampusAsync,
  selectCampusUpdateStatus,
  selectdbUpdated
} from "../slices/studentsSlice"

const sp = '\u00A0'  //need this utf-8 char for &nbsp inline jsx

let switchCampus = {}
const toggleColors = ['rgba(0,0,0,0)','rgba(255,0,255)']

const Students = ( props ) => {
  const dispatch = useDispatch()
  const location = useLocation();
  //console.log('location',location)

  const { campusId, campusName } = useParams()
  if (location.pathname.includes('enroll')) {
    console.log('we are enrolling here', campusId)
  }

  console.log('campus id', campusId, campusName)

  const [sortKey, setSortKey] = useState('id')

  //dbUpdated is set to true in slice if db update
  //for student campuses is successful
  const studentCampusesUpdated = useSelector(selectdbUpdated)
  console.log('zzzzzzzzzzzz',studentCampusesUpdated)

  useEffect(() => {
    dispatch(fetchAllStudents())
  }, [studentCampusesUpdated])

  let studentData = useSelector( selectAllStudents )
  let oneCampus = false;

  let campusUpdateStatus = useSelector( selectCampusUpdateStatus)
  console.log('update status',campusUpdateStatus)
  if ( campusUpdateStatus[0] === 230 ) {
    //window.alert('reload because I can not figure out how to reload DB here using useEffect')
    console.log(campusUpdateStatus[1])
  }

/*   useEffect(()=>{
    //console.log(studentData)
    if (studentData.length && studentData.length>0) {
      console.log('should be sorting by:',sortKey) 
      //dispatch(sortBy()) //problems with Immer - bypass?
    }
  },[sortKey]) */

  //this allows us to reuse the Students component from within oneCampus
  if (props.studentData) {
    studentData = props.studentData
    console.log(studentData.length)
    oneCampus = true;
  }

  let studentDataOutput = []
  
  if ( typeof studentData !== 'undefined' 
        && studentData.length > 0) {

    for (let i = 0; i < studentData.length; i++) {
      const student = studentData[i]

      switchCampus[i] = 0;

      let campus;
      if (student.campus === null) {
        campus = {id:666, name:'not assigned'}
      }
      else {
        campus = student.campus
      }

      const lenStudentId = String(student.id).replace('/\s\s+//').length
      const padding = Math.trunc(Math.max(0,7-lenStudentId)/2)
  
      //we can control the link amount that will be highlighted by padding
      //with spaces, otherwise just the number is hightlighted which
      //is too small
      let paddedId = ''
      for (let i=0; i<padding; i++) {
        paddedId += sp
      }
      paddedId += student.id
      for (let i=0; i<padding; i++) {
        paddedId += sp
      }

      studentDataOutput.push(
        <tr
            key={'student'+student.id}
            id={student.id}
        >
            <td style={{textAlign:'center'}} >
              <Link className="studentLink" 
                to={'/students/edit/'+student.id}
               /*  style={{display:'inline-block', width:'50px'}} */
              >
                {paddedId}
              </Link>
            </td>

            <td>{student.firstName}</td>
            <td>{student.lastName}</td>
            <td><Link
                className='studentLink'
                to={'/students/'+student.id}>{'/students/'+student.id}
              </Link>
            </td>
              
            { !oneCampus ? ( [
                <td>
                  {student.email}
                </td>,
                <td>
                  {  (campusUpdateStatus[1].hasOwnProperty('switchObj')
                      && campusUpdateStatus[1].switchObj.hasOwnProperty(student.id) ) ?
                      (<Link className='studentLink' to={'/campuses/' + campusUpdateStatus[1].campusId}>
                        {campusUpdateStatus[1].campusName}
                      </Link> )
                       : 
                      (<Link className='studentLink' to={'/campuses/' + campus.id}>
                        {campus.name}
                      </Link> )
                  }
                </td>]) : (null)
            }

            { campusName ? <td style={{width:'20px'}} onClick={(ev)=>{handleSwitch(ev, student.id)}}></td> : null }

        </tr>
      )
    }

    function handleSwitch(ev, studentId) {
      //console.log('switching',studentId, ev)
      switchCampus[studentId] ^= 1
      ev.target.style.backgroundColor = toggleColors[switchCampus[studentId]]
    }

    function updateCampuses() {
      console.log('we should be updating campuses')
      const studentIdsToUpdate = Array.from(switchCampus)
      let studentsToSwitch = []
      let switchObj = {}
      for (const [studentId,switchCamp] of Object.entries(switchCampus) ) {
        if ( switchCamp === 1) { 
          studentsToSwitch.push(studentId)
          switchObj[studentId] = 1 //so we can lookup by key in the output
        }
      }
      console.log(studentsToSwitch)
      if (studentsToSwitch.length > 0 ) {
        console.log('finally swtiching here')
        dispatch(updateCampusAsync({studentsToSwitch,campusId,campusName, switchObj}))
      }
      
    }

    return ( [ 
      <div className={oneCampus?"column":"column2"} style={{marginTop:'14vh'}}>
        <h2 className='centerMain'>Here are {!oneCampus && 'ALL of'} our illustrious Students</h2>
        <h3 className='centerMain'>(click on Id # to Edit)</h3>
        {campusName ? (<h3 className='centerMain'>Click Switch button to change Campus to: {campusName} </h3>) : (null)}
        {campusName ? (
          <button style={{position:'fixed',top:'80px',left:'1vw'}}
            onClick={updateCampuses} 
            className='bigRedButton'>UPDATE CAMPUSES</button>) : null}
        <table><tbody>
          <tr>
            <td style={{textAlign:'center'}}>Id</td>
            <td>First</td>
            <td onClick={()=>{setSortKey('lastName')}}>Last</td>
            <td>Home Page</td>
            { !oneCampus ? ( [
              <td>Email</td>,
              <td>Attending</td>
              ]) : (null)
            }
            {campusName ? <td>Switch</td> : null }
          </tr>
            {studentDataOutput}
        </tbody></table>
      </div>
    ])
  }
}

export default Students
