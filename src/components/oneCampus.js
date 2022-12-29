import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Students from './Students'

import {
    selectOneCampus,
    fetchOneCampus,
} from "../slices/oneCampusSlice";

const OneCampus = () => {
  const { campusId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOneCampus(campusId));
  }, [dispatch]);

  const campusData = useSelector(selectOneCampus);

  //first pass is usually null so we have to check
  if (campusData.students) { 
    return [
      <div>
        <div className="oneCampus">
          <h2>Welcome to:</h2>
          <h2 style={{backgroundColor:'orange'}}>{campusData.name}</h2>
          <h2>Number of Students: {campusData.students.length} </h2>
          <div style={{textAlign:'center',marginTop:'3vh'}}>
            <Link style={{position:'relative',textAlign:'center'}}
                className='bigRedButton'
                to={'/campuses/enroll/'+campusId+'/'+campusData.name}>
              Enroll Existing Students
            </Link>
          </div>
          <img style={{width:'100%'}} src={"../" + campusData.imageUrl}></img>
        </div>,
        <Students studentData={campusData.students} />
      </div>
    ];
  }
};

export default OneCampus