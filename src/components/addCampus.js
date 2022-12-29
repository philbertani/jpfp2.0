import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CampusesTable } from "../../server/db/models/CampusesConfig.js";
import { formSchema } from "./formSchema";

import { addCampus, selectDbStatus } from "../slices/addCampusSlice";
import { setDBupdated } from "../slices/campusesSlice"

const CampusModel = formSchema(CampusesTable);

const fields = CampusModel.fields; //need a shortcut - sorry
const isRequired = CampusModel.isRequired;
const isNum = CampusModel.isNum;
const nullState = CampusModel.nullState;

//isRequired gives us an index into the following array so we can color
//them differently
const fieldColors = ["white", "rgba(170,150,200,.4)"];

//this is getting dangerous using addCampus and AddCampus
const AddCampus = () => {
  const [inp, setInp] = useState(nullState);
  const dispatch = useDispatch();
  let [dbCreateStatus, createdCampusData] = useSelector(selectDbStatus);

  useEffect(()=>{
    //this is happening everytime we switch to the addCampus from campuses view
    //or when a campus is actually updated, not working efficiently
    if (dbCreateStatus===200) {
      console.log('dispatching db update for campus')
      dispatch(setDBupdated())
    }
  },[dbCreateStatus])

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
    let campusForm = {};
    let valid = true;

    for (let i = 0; i < CampusModel.numFields; i++) {
      let copyInp = [...inp];
      const field = fields[i];

      resetInp.push("");

      //here is a nice long winded name which I previously
      //might have just called: zork
      const fieldIsJustWhiteSpaceOrNull =
        String(copyInp[i]).replace(/\s\s+/g, " ") === " " || copyInp[i] === "";

      if (CampusModel.isRequired[field] == 1) {
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
      campusForm[field] = copyInp[i]; //finally set the property
    }

    if (valid) {
      console.log("dispatching", campusForm);
      dispatch(addCampus({ campusForm }));
      setInp([...nullState]);
    }
  };

  let formOut = [];
  for (let i = 0; i < CampusModel.numFields; i++) {
    formOut.push(
      <div key={"input" + fields[i]} className="forms">
        <label key={"label" + i} htmlFor={fields[i]}>
          {fields[i]}
        </label>
        <input
          type="text"
          style={{ backgroundColor: fieldColors[isRequired[fields[i]]] }}
          key={"addCampusOption" + i}
          value={inp[i]}
          onChange={(ev) => handleInput(ev, i)}
        ></input>
      </div>
    );
  }

  return ( [
    (
      <div style={{ marginTop: "15vh" }} key="stdiv">
        <form id="addStudent" onSubmit={intercept}>
          {formOut}
          <input className="genericSubmit" type="submit" value="Create"></input>
        </form>
      </div>
    ),
    (
      <div className="infoTabs2">
        <div style={{ marginRight: "1vw", marginLeft: "1vw" }}>
          <h3>DB Status</h3>
          <p>{dbCreateStatus}</p>
          <p style={{ wordBreak: "break-all" }}>
            {JSON.stringify(createdCampusData)}
          </p>
        </div>
      </div>
    )

  ]);
};

export default AddCampus;
