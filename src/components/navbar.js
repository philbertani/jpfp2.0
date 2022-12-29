import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div id="navbar" className='row'>
      <Link className='navElem' to="/students">Students</Link>
      <Link className='navElem' to="/campuses">Campuses</Link>
      <Link className='navElem' to="/students/add">Add Student</Link>
      <Link className='navElem' to="/campuses/add">Add Campus</Link>
    </div>
  );
};

export default Navbar;
