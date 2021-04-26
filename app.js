const Joi = require('joi')
const express = require('express');
const bodyParser= require('body-parser');
const { json } = require('express');
const { min } = require('joi/lib/types/array');
const e = require('express');
app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static('public'));

const courses =[];
const students=[];
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/home.html')
});

app.get('/web/courses/create',(req,res)=>{
    res.sendFile(__dirname+'/public/create_course.html')
});

app.post('/api/courses/create',(req,res)=>{
    const { error } = validateCourse(req.body);
    if (error){
        return res.status(400).send(error.details[0].message);
    }


    const course = {
        name: req.body.name,
        code: req.body.code,
        id: courses.length+1,
        description: req.body.description
    };

    courses.push(course);
    printCourse(course,res,true);
});
app.put('/api/courses/:id',(req,res)=>{
    const course= courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Course not Found!!');
    }  
    const { error } = validateCourse(req.body);
    if (error){
        return res.status(400).send(error.details[0].message);
    }

    course.name= req.body.name;
    course.code= req.body.code;
    course.description= req.body.description;
    printCourse(course,res,true);
});
app.delete('/api/courses/:id',(req,res)=>{
    const course= courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Course not Found!!');
    } 

    const index= courses.indexOf(course)
    courses.splice(index,1)
    printCourse(course,res,true);
});

app.get('/api/courses',(req,res)=>{
    if (courses.length===0){
        res.send('No Courses Yet!');
    }
    else{
        printCourses(courses,res);
    }
});



app.get('/web/students/create',(req,res)=>{
    res.sendFile(__dirname+'/public/create_student.html')
});

app.post('/api/students/create',(req,res)=>{
    const { error } = validateStudent(req.body);
    if (error){
        return res.status(400).send(error.details[0].message);
    }
    const student = {
        name: req.body.name,
        code: req.body.code,
        id: students.length+1
    };
    students.push(student);
    printStudent(student,res,true)

});
app.put('/api/students/:id',(req,res)=>{
    const student= students.find(c => c.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).send('Student not Found!!');
    }  
    
    const { error } = validateStudent(req.body);
    if (error){
        return res.status(400).send(error.details[0].message);
    }

    student.name= req.body.name;
    student.code= req.body.code;
    printStudent(student,res,true);
});

app.delete('/api/students/:id',(req,res)=>{
    
    const student= students.find(c => c.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).send('Student not Found!!');
    } 
    
    
    
    const index= students.indexOf(student)
    students.splice(index,1)

    
    printStudent(student,res,true);
});


app.get('/api/students',(req,res)=>{
    if (students.length===0){
        res.send('No Students Yet!');
    }
    else{
        printStudents(students,res);
    }
});





function validateCourse(course){
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$/i,'3 Letters Followed by 3 Numbers').required(),
        description: Joi.string().max(200).allow('').optional()
    };
    return Joi.validate(course, schema);   
}

function validateStudent(student){
    const schema = {
        name: Joi.string().regex(/^[a-zA-Z-']+$/i,'only letters in both cases, apostrophe and dashes are allowed').required(),
        code: Joi.string().length(7).required(),
    };
    return Joi.validate(student, schema);
}

function printCourse(course,res,last){
    res.write(`Name: ${course.name}`);
    res.write(`Code: ${course.code}`);
    res.write(`ID: ${course.id}`);
    res.write(`Description: ${course.description}`);
    res.write('\n');
    if (last){
        res.end();
    }
}

function printStudent(student,res,last){
    res.write(`Name: ${student.name}`);
    res.write(`Code: ${student.code}`);
    res.write(`ID: ${student.id}`);
    res.write('\n');
    if (last){
        res.end();
    }
}

function printCourses(courses,res){
    var i;
    for (i=0 ; i<courses.length; i++){
        if (i === courses.length-1){
            printCourse(courses[i],res,true);
        }
        else{
            printCourse(courses[i],res,false);
        }
    }
}

function printStudents(students,res){
    var i;
    for (i=0 ; i<students.length; i++){
        if (i === students.length-1){
            printStudent(students[i],res,true);
        }
        else{
            printStudent(students[i],res,false);
        }
    }
}


const port = process.env.PORT || 12000
app.listen(port, ()=> console.log(`Listening on port ${port}...`));