import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const sp = "\u00A0"; //need this utf-8 char for &nbsp inline jsx

import { selectOneStudent, fetchOneStudent } from "../slices/oneStudentSlice";

const OneStudent = () => {
  const { studentId } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(window.innerWidth,0)
    dispatch(fetchOneStudent(studentId));
  }, [dispatch]);

  const studentData = useSelector(selectOneStudent);

  if (studentData === null) {
    return (
      <div style={{ marginTop: "14vh" }}>
        <h2>no data</h2>
      </div>
    );
  }

  let campus;
  if (studentData !== null && studentData.campus === null) {
    campus = { id: 666, name: "unassigned" };
  } else if (studentData !== null) {
    campus = studentData.campus;
  }

  //findByPk returns just an object - not array so check for existence
  //of non empty object

  //img src looks for file in the directory of
  //the link /campuses/ but we need it to look
  //in the root so it can find it in /public

  //need to check if it is an actual url or if it has no http then
  //assume it is local from /public

  if (Object.keys(studentData).length > 0) {
    return [
      <div style={{ marginTop: "14vh", textAlign: "center" }}>
        <h2>
          {studentData.firstName} {studentData.lastName}
        </h2>
        <h2>({studentData.email})</h2>
        <h2>
          {" "}
          Attending: {sp}
          <Link to={"/campuses/" + campus.id}>{campus.name}</Link>
        </h2>
        <h2>GPA: {studentData.gpa} </h2>
        <img src={"../" + studentData.imageUrl}></img>
      </div>,

      <div>
        <Link
          id="oneStudentEdit"
          className="bigRedButton"
          to={"/students/edit/" + studentId}
        >
          Edit
        </Link>
      </div>,

      <div>
        <Link
          id="oneStudentDelete"
          className="bigRedButton"
          to={"/students/delete/" + studentId}
        >
          Delete
        </Link>
      </div>,
    ];
  } else {
    return (
      <div style={{ marginTop: "14vh" }}>
        <h2>no data</h2>
      </div>
    );
  }
};

export default OneStudent;
