import _ from 'lodash'
import { Grid,Header, Divider, Tab } from 'semantic-ui-react'
import { useParams} from 'react-router-dom'

import InvaiteDashboard from '../../components/teacher/InvaiteDashboard'
import CourseEditDashboard from '../../components/teacher/CourseEditDashboard'



export default function CourseManager(){

    const {coursesid} = useParams()

    return <div>
        <Grid>
            <Grid.Row>
                <Grid.Column width='2' />
                <Grid.Column width='12'>
                    <Divider horizontal style={{marginTop:'50px'}}></Divider>
                    <Tab  menu={{ color:'blue', attached: false}} panes={[
                        {menuItem: {icon :'users',key:'classroom' ,content:'รายวิชา'}, render:()=> <CourseEditDashboard coursesid={coursesid}/>},
                        {menuItem: { icon: 'add',key:'invite', content: 'สมาชิกในรายวิชา' }, render :() => <InvaiteDashboard  coursesid={coursesid}/>},
                    ]}/>
                </Grid.Column>
                <Grid.Column width='2' />
            </Grid.Row>
        </Grid> 
    </div>
}


