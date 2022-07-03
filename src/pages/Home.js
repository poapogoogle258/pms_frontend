import { useEffect,useState} from 'react';
import { Grid, Container, Checkbox, Button,Pagination,Icon} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom';

import courses from '../services/courses';


import CardListCourse from '../components/student/CardListCourse';

  
function Home() {
  const dispacth = useDispatch()

  const state_slice_student = useSelector(state => state.components.slicebarShowCourseStudent)
  const state_slice_teacher = useSelector(state => state.components.slicebarShowCourseTeacher)

  const [course,setCourse] = useState([])

  const ListCourse = (pros) => {

    const {course , fullsize} = pros

    console.log(course)

    const [Row , Column ] =  [2 , (fullsize)? 6 : 3]
    

    const [numberTab,setNumberTab] = useState(1)

    return <div style={{textAlign : 'center'}}>

            {course != undefined && course.length > 0? 
            <>
            <Container fluid style={{height:'750px', padding : '10px', border:'1px solid gray'}} >
                <Grid columns={Column}>
                    {Object.values(course).slice( (numberTab-1) * (Column*Row), numberTab * (Column * Row) )
                    .map(value =>
                        <Grid.Column>
                            <CardListCourse name = {value.name} course_id={value.id} description={value.description} isAdmin={value.is_admin}/>
                        </Grid.Column>)}
                </Grid>
            </Container>
                <Pagination
                boundaryRange={0}
                defaultActivePage={numberTab}
    
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                onPageChange={(e,{activePage}) => setNumberTab(activePage)}
                totalPages={Math.ceil(Object.entries(course).length / (Column * Row))} 
                style={{marginTop: '50px'}}
                />
            </>
                : "ไม่มีรายวิชา."
            }
            

        </div>        
}
        
  useEffect(() => {
    courses.get_all_course()
    .then(res => {
        setCourse(res)
    })        
  },[])

  const teacher_course = <ListCourse course={course.filter((item) => item.is_admin)} fullsize = {state_slice_teacher && !state_slice_student}/>
  const student_course = <ListCourse course={course.filter((item) => !item.is_admin)} fullsize = {state_slice_student && !state_slice_teacher}/>

  return (
    <div style={{margin :'5px'}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width='8'>
              <Button as={NavLink} to={`/newcourses`} floated='right' icon labelPosition='left' style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='add' />สร้างรายวิชา</Button>
              <Checkbox toggle checked = {state_slice_teacher} onChange={() => dispacth({type : 'switch_slice_teacher'})} label={'รายวิชาที่สอน'} style={{fontSize:'16px'}}/>  
            </Grid.Column>
            <Grid.Column width='8'>
              <Checkbox toggle checked= {state_slice_student} onChange={() => dispacth({type : 'switch_slice_student'})} label ={'รายวิชาที่เรียน'} style={{fontSize:'16px'}}/>
            </Grid.Column>

          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={(state_slice_teacher && !state_slice_student)? 16 : 8}>
                {state_slice_teacher? teacher_course:null}
            </Grid.Column>

            <Grid.Column width={(state_slice_student && !state_slice_teacher)? 16 : 8}>
                {state_slice_student? student_course:null}
            </Grid.Column>
          </Grid.Row>
        </Grid>

        

    </div>
  );
}

export default Home;
