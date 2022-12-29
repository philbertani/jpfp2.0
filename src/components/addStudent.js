import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StudentsTable } from "../../server/db/models/StudentsConfig.js"
import { fetchAllCampuses, selectAllCampuses } from "../slices/campusesSlice"
import { addStudent,  selectDbStatus} from "../slices/addStudentSlice"
import { Link } from "react-router-dom";
import { v4 } from "uuid" //using v4() as key causes chaos

const fields=Object.keys(StudentsTable);

const numFields = fields.length

const init = ""
const nullState = Array(numFields).fill(init)

let isRequired = {}
let requiredFields = []
let isNum = []

for ( const [field,fieldDef] of Object.entries(StudentsTable) ) {
  if ( typeof fieldDef['allowNull'] !== 'undefined' && fieldDef['allowNull'] === false ) {
    isRequired[field] = 1
    requiredFields.push(field)  //slightly redundant but makes validation loop quicker
  }
  else { isRequired[field] = 0 }

  //we need to reset numeric fields to null if they were left empty
  if (fieldDef['type'] == 2) {  //see StudentConfig.js, sorry
    isNum.push(true)
  }
  else {
    isNum.push(false)
  }
}

//isRequired gives us an index into the following array so we can color
//them differently
const fieldColors = ['white','rgba(170,150,200,.4)']

let studentId = -1, fn='', ln='';
let studentId2 = -1, fn2='', ln2='';
let editStudent = false;
let showCreated = false;

let counter = 0;

const AddStudent = () => {
  const [inp, setInp] = useState(nullState);
  const [campusId, setCampusId] = useState(-1);

  const dispatch = useDispatch();

  //we need a list of campuses for the new student to choose from
  useEffect(() => {
    dispatch(fetchAllCampuses());
  }, [dispatch]);

  const campusData = useSelector(selectAllCampuses);

  let [dbCreateStatus, studentData] = useSelector(selectDbStatus);

  if (dbCreateStatus === 210) {
    counter++;
    studentId = studentData.id;
    fn = studentData.firstName;
    ln = studentData.lastName;
    editStudent = true;
  } else if (dbCreateStatus === 200) {
    studentId2 = studentData.id;
    fn2 = studentData.firstName;
    ln2 = studentData.lastName;
    showCreated = true;
  }

  function handleInput(ev, i) {
    //console.log(ev)
    let newInp = [...inp];
    newInp[i] = ev.target.value;
    setInp(newInp);
  }

  const intercept = (ev) => {
    console.log("intercepting", inp);

    ev.preventDefault();
    let resetInp = [];
    let studentForm = {};
    let valid = true;

    for (let i = 0; i < numFields; i++) {
      let copyInp = [...inp];
      const field = fields[i];

      resetInp.push("");

      //here is a nice long winded name which I previously
      //might have just called: zork
      const fieldIsJustWhiteSpaceOrNull =
        String(copyInp[i]).replace(/\s\s+/g, " ") === " " || copyInp[i] === "";

      if (isRequired[field] == 1) {
        //console.log('required',field)
        if (fieldIsJustWhiteSpaceOrNull) {
          valid = false;
          console.log("missing: ", field);
        }
      }

      if (isNum[i] && fieldIsJustWhiteSpaceOrNull) {
        copyInp[i] = null;
      } else if (isNum[i]) {
        const isValidNum = parseFloat(copyInp[i]);
      }

      //create object for Sequelize create
      studentForm[field] = copyInp[i]; //finally set the property
    }

    if (valid) {
      console.log("dispatching", studentForm);
      dispatch(addStudent({ studentForm, campusId }));
      setInp([...nullState]);
    }
  };

  let formOut = [];
  for (let i = 0; i < numFields; i++) {
    formOut.push(
      <div key={"input" + fields[i]} className="forms">
        <label key={"label" + i} htmlFor={fields[i]}>
          {fields[i]}
        </label>
        <input
          type="text"
          style={{ backgroundColor: fieldColors[isRequired[fields[i]]] }}
          key={"addStudentOption"+i}
          value={inp[i]}
          onChange={(ev) => handleInput(ev, i)}
        ></input>
      </div>
    );
  }

  let campusOptions = [];
  if (campusData.length > 0) {
    for (let i = 0; i < campusData.length; i++) {
      //this is the only reliable place to set campusId to default value
      if (campusId === -1) {
        setCampusId(campusData[0].id);
      }
      const c1 = campusData[i];
      campusOptions.push(
        <option key={"option" + c1.name} value={c1.id}>
          {c1.name}
        </option>
      );
    }
  }

  return [
    <h2
      key="sth2"
      style={{
        textAlign: "center",
        backgroundColor: "orange",
        marginTop: "15vh",
      }}
    >
      Add a New Adventure Seeker
    </h2>,
    <div key="stdiv">
      <form id="addStudent" onSubmit={intercept}>
        {formOut}
        <div id="campusSelect">
          <span>Campus</span>
          <select onChange={(ev) => setCampusId(ev.target.value)}>
            {campusOptions}
          </select>
        </div>
        <input id="campusSubmit" type="submit" value="ROLL"></input>
      </form>
    </div>,

    <div key={"ass"} className="addStudentInfo">
      <div key="sse" hidden={!editStudent}  className="infoTabs">
        <h3 style={{ textAlign: "right", marginRight: "2vw" }}>
          Latest Duplicate Appears Here
        </h3>
        {editStudent && [
          <h2 key="sse2" style={{ marginTop: "1vh", marginRight: "2vw" }}>
            {fn} {ln}
          </h2>,
          <br key="assbr1"></br>,
          <span style={{ marginRight: "2vw" }}>
            already exists in Students DB
          </span>,
          <br key="assbr2"></br>,
          <Link key="sse3" className="addStudentEditLink"
            to={"/students/edit/" + studentId}>EDIT
          </Link>,
          <br></br>,
          <Link key="sse3b" className="addStudentEditLink"
            to={"/students/" + studentId}>Go to Home Page</Link>
        ]}
      </div>
      ,
      <div key="sse4"  hidden={!showCreated} className="infoTabs">
        <h3 style={{ textAlign: "right", marginRight: "2vw" }}>
          Latest Created Appears Here
        </h3>
        {showCreated && [
          <h2 key="sse5" style={{ marginTop: "5vh", marginRight: "2vw" }}>
            {fn2} {ln2}
          </h2>,
            <br key="assbr3"></br>,
            <Link key="sse6" className="addStudentEditLink"
              to={"/students/edit/" + studentId2}>EDIT
            </Link>,
            <br key="assbr4"></br>,
            <Link key="sse7" className="addStudentEditLink"
              to={"/students/" + studentId2}>Go to Home Page</Link>

        ]}
      </div>
    </div>,
  ];
};

export default AddStudent;
