'use strict'
const SQL = require('sequelize')
const router = require('express').Router()
const { Campuses, Students } = require('../db/models')


router.post('/campuses/add', async (req,res,next)=>{

  let status = 200;
  try {
    const [newCampus,created] = await Campuses.findOrCreate( {where: req.body.formData.campusForm} )

    console.log(newCampus, created)
    if ( newCampus !== null ) {
      if (created) {
        //do something?
      }
      else {
        status = 210;
      }
    }
    else {
      throw new Error( 'newCampus was null')
    }
    res.status(status).json(newCampus)
  } catch(err) {
    res.status(500).json(err)
    //the details about validation are in err.response.data
  }
})

router.get('/campuses/:id', async (req,res,next)=>{
  if ( req.params.id ) {
    const data = await Campuses.findByPk( req.params.id,  
      { include: Students }
    )
    if (data === null ) console.log('null data from campus id: ',req.params.id)
    res.json(data)
  }
  else {
    res.json(null)
  }
})

router.get('/campuses', async (req,res,next)=>{
  const data = await Campuses.findAll( 
    {
      //only return the COUNT of the associated students
      attributes: {
        include: [[SQL.fn("COUNT",SQL.col("students.id")),"studentCount"]]
      },
      include:{ model:Students, attributes:[]},
      group: ['campuses.id']
    }
  )
  res.json(data)
})

router.delete('/students/delete/:id', async (req,res,next)=>{

  try {
    const studentToDelete = await Students.findByPk(req.params.id)

    let status = 200;
    if (studentToDelete !== null) {
      const result = await studentToDelete.destroy();
      console.log('result of destroy',result)
    }
    else {
      status = -1;
    }
    res.status(200).json(status)
  }
  catch (err) {

  }

})

router.post('/students/add', async (req,res,next)=>{

  let status = 200;
  try {
    const [newStudent,created] = await Students.findOrCreate( {where: req.body.formData.studentForm} )

    console.log(newStudent, created)
    if ( newStudent !== null ) {
      if (created) {
        newStudent.setCampus(req.body.formData.campusId)
      }
      else {
        status = 210;
      }
    }
    else {
      throw new Error( 'newStudent was null')
    }
    res.status(status).json(newStudent)
  } catch(err) {
    res.status(500).json(err)
    //the details about validation are in err.response.data
  }
})

router.put('/students/switchCampus', async(req, res, next) =>{
  const studentIds = req.body.inp.studentsToSwitch;
  const campusId = req.body.inp.campusId
  console.log(studentIds, campusId)

  try {
    for (const studentId of studentIds) {
      const student = await Students.findByPk(studentId);
      if (student !== null) {
        student.setCampus(campusId);
        console.log(student.id, student.setCampus);
      }
    }
    //if we get here I guess it worked
    res.status(230).json('update complete, reload page')
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put("/students/edit/:id", async (req, res, next) => {
  console.log(req.body.formData);

  let status = 200;
  try {
    const data = await Students.update(req.body.formData.studentForm, {
      where: { id: req.params.id },
    }); // , returning:true, plain:true})

    console.log("updated", data);

    if (data[0] === 1) {
      //update worked
      const updatedStudent = await Students.findByPk(req.params.id);
      if (updatedStudent != null) {
        updatedStudent.setCampus(req.body.formData.campusId);
      } else {
        throw new Error( 'updatedStudent was null')
      }
      res.status(status).json(updatedStudent)
    }
    else {
      throw new Error( 'update did not work')
    }
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/students/:id', async (req,res,next)=>{
  const data = await Students.findByPk( req.params.id,  
    {include:{model: Campuses, attributes:['id','name']}})
  res.json(data)
})

router.get('/students', async (req,res,next)=>{
  const data = await Students.findAll( {
    include:{model: Campuses,
      attributes:['id','name']
    },
    order: [['id']]

  })
  res.json(data)
})

router.use((req, res, next) => {
  const err = new Error('API route not found!')
  err.status = 404
  next(err)
})

module.exports = router