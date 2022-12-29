import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom"
import { 
    fetchAllCampuses,
    selectAllCampuses } from "../slices/campusesSlice"
import {
    selectOneStudent,
    fetchOneStudent
  } from "../slices/oneStudentSlice"

import {editStudent, selectDbStatus} from '../slices/addStudentSlice'

import { formSchema } from './formSchema'
import { StudentsTable } from "../../server/db/models/StudentsConfig.js"


const StudentsModel = formSchema(StudentsTable)

const sp = '\u00A0'  //need this utf-8 char for &nbsp inline jsx

let doneOne = false;
let userFields = []
let userFieldLookup = {}
let isEditable = []
let dataChanged = false;
const nullState = Array(20).fill("")

const EditStudent = (props) => {

    const { studentId } = useParams();
    let studentIdToUse = studentId;
    if (props.studentId) {
        studentIdToUse = props.studentId
    }

    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(fetchOneStudent(studentIdToUse))
    }, [dispatch])

    const studentData = useSelector( selectOneStudent )

    useEffect(() => {
      dispatch(fetchAllCampuses());
    }, [dispatch]);
  
    const campusData = useSelector(selectAllCampuses);

    let campus;
    if (studentData.campus === null) {
        campus = {id:666, name: 'unassigned'}
    }
    else {
        campus = studentData.campus
    }
    
    let [dbCreateStatus, editStudentResult] = useSelector(selectDbStatus);
    console.log('db status',dbCreateStatus,  editStudentResult)
    if ( dbCreateStatus === 200) {
      console.log('have to reset inp')      
    }


    const [inp, setInp] = useState(nullState);
    const [campusId, setCampusId] = useState(-1);

    const fields = Object.keys(studentData)
    let dbValues = [];
  
    const [id, setId] = useState(studentId)
    useEffect(()=>{
        //need to reset the indicator to reinitialize
        //the main form state when student id changes
        //from navigation
        doneOne = false;
  
    },[id])

    if (fields.length > 0) {

      if (!doneOne) {

        //need to compare all of the db fields we get 
        //versus the stuff we doing db.define since 
        //we get extra derived stuff that can't be modified by user

        for (let i=0; i< fields.length; i++ ) {
            let editable = false;
            const field = fields[i];
            if ( StudentsModel.isRequired.hasOwnProperty(field) ) {
                userFields.push({name:field,dbIndex:i})
                userFieldLookup[field] = i
                editable = true;
            }
            isEditable[i] = editable
        }

        //console.log('edit s',studentData)
        let newInp = [...inp];
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          //null values in DB fields are wreaking havoc here
          //so do the lazy trick of adding empty string
          let value = (studentData[field] + "").toString();
          if ( typeof studentData[field] === 'object') {
            value = JSON.stringify(studentData[field])
          }
          dbValues.push(value); //needed for forms
          newInp[i] = value; //needed for new state array
        }

        //we only want to do this once or else - crashhh
        //here is the setInp that initializes the form state with db data
        setInp(newInp);
        console.log('campus id',studentData.campusId)
        setCampusId(studentData['campusId'])
        doneOne = true;
        dataChanged = false;
      }
    }

    function handleInput(ev, i) {
      //console.log(ev)
      //here is the setInp that responds to user input
      //if (isEditable[i])
      {
        let newInp = [...inp];
        newInp[i] = ev.target.value;
        setInp(newInp);
        dataChanged = true;
      }
    }

    let formOut = []
    for (let i=0; i<fields.length; i++) {
        const canEdit = isEditable[i]
        formOut.push(
          <div key={"input" + fields[i]} className="forms">
            <label key={"label" + i} htmlFor={fields[i]}>
              {fields[i]}
            </label>
            <input
              type="text"
              key={i}
              value={inp[i]}
              style={{backgroundColor: canEdit ? 'yellow' : 'white'  }}
              onChange={(ev) => (canEdit ? handleInput(ev, i):'')}
            ></input>
          </div>
        );
    }

    let campusOptions = [];
    if (campusData.length > 0 && fields.length > 0) {

      campusOptions.push(
        <option key='nochange' value={-1}>No Change</option>
      )
      for (let i = 0; i < campusData.length; i++) {
        //this is the only reliable place to set campusId to default value

          const c1 = campusData[i];
          campusOptions.push(
            <option key={'CampusOptionEdit'+c1.id} value={c1.id}>
              {c1.name}
            </option>
          );
      }
    }

    function intercept(ev) {
      ev.preventDefault()
      console.log('yeah you submitted it, now what?')
      console.log('data change', dataChanged, campusId)

      if ( campusId == -1 || campusId === studentData.campusId) {
        console.log('no change to campus')
      }
      else {
        console.log('you are changing campuses')
      }

      let studentForm = {}
      //need to create object for Sequelize
      for (let i=0; i<userFields.length;i++) {
        const {name,dbIndex} = userFields[i]
        studentForm[name] = inp[dbIndex]
      }
    
      //console.log(studentForm)
      dispatch(editStudent( { studentForm, campusId, studentId:Number(studentId) }))

    }

    if (Object.keys(editStudentResult).length>0 ) {
        console.log( 'ids', editStudentResult, studentId)
    }

    //console.log(studentData)
    //findByPk returns just an object - so check if has keys
    if ( fields.length > 0 ) {
        return ( [ 
            <div key='editStud' style={{marginTop:'12vh',textAlign:'center'}}>
            <h2>{studentData.firstName} {studentData.lastName}</h2>
            <h2>({studentData.email})</h2>
            <h2> Attending: {sp}
                <Link to={'/campuses/' + campus.id}>
                    {campus.name}
                </Link> </h2>
            </div>,
            <form style={{marginLeft:'2vw',marginTop:'2vh'}}
                  key='editStudDiv' onSubmit={intercept}>
                {formOut}
                <div id="campusSelect">
                <span>New Campus</span>
                  <select onChange={(ev) => { setCampusId(ev.target.value)}}>
                    {campusOptions}
                  </select>
                </div>
                <input id="editStudentSubmit" type="submit" value="UPDATE"></input>
            </form>,
            <div className='infoTabs2'>
              <div style={{marginRight:'1vw',marginLeft:'1vw'}}>
                <h3>DB Status</h3>
                <p>{dbCreateStatus}</p>
                <p style={{wordBreak:'break-all'}}>{JSON.stringify(editStudentResult)}</p>
                <h3>
                  <Link className="addStudentEditLink" to={'/students/'+studentId}>Home Page</Link>
                </h3>
              </div>

            </div>
        ])
    }
    else {
        return <h2>no data</h2>
    }
}

export default EditStudent