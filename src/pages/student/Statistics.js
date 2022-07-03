import _ from 'lodash'
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'
import { Table, Grid, Icon,Button,Header,Modal, Container, Segment} from 'semantic-ui-react'
import { NavLink , useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';


import CourseMember from '../../services/coursemember'
import submissions from '../../services/submissions'
import tasks from '../../services/tasks'

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

export default function StatisticsDashboard(pros){
    const {courses_id} = useParams()
    const my_username = useSelector(state => state.sessions.currentUser)

    const [coursesName,setCoursesname] = useState('')
    const [finishedLoading,setfinishedLoading] = useState(false)
    const [isAdmin,setAdmin] = useState(false)
    const [format,setFormat] = useState(null)
    const [member,setMember] = useState()


    useEffect(()=>{

        async function format_submisstion() {
            

            const member = await CourseMember.get_users(courses_id)
            const data_tasks = await tasks.get_tasks(courses_id)
            const data_submisstion = await submissions.get_submissions(courses_id)

            const tasksid =  data_tasks.tasks
                .map((task) => {return {'id' : task.id,'name':task.name}})
                .sort((a ,b) => (a.name > b.name)? 1 :-1 )

            let problmeid = [];
                
            tasksid.forEach((_task) => {
                data_tasks.tasks.filter((__task) => __task.id === _task.id)[0].problems
                    .forEach((_problem) => {
                        problmeid.push({
                            "taskid" : _task.id,
                            'lessonname':_task.name,
                            "problemid":_problem.id,
                            "name": _problem.name,
                        })
                    })
            })
            
            let _format;

            if(data_tasks.is_admin){
                _format = problmeid.map((_problme) => {
                    
                    const count_submitted = (_taskid,_problmeid) => Object.values(data_submisstion[_taskid].problems[_problmeid])
                        .reduce((init,_chach) => (_chach.attempts > 0)? init + 1:init ,0)
                    const count_pass = (_taskid,_problmeid) => Object.values(data_submisstion[_taskid].problems[_problmeid])
                        .reduce((init,_chach) => (_chach.succeeded)? init + 1:init ,0)
                    const count_failed = (_taskid,_problmeid) => Object.values(data_submisstion[_taskid].problems[_problmeid])
                        .reduce((init,_chach) => (_chach.attempts > 0 && _chach.succeeded == false) ? init + 1:init ,0)

                    return {

                        'taskid':_problme.taskid,
                        'lessonname': _problme.lessonname,
                        'problemid':_problme.problemid,
                        'name':_problme.name,
                        'submitted':count_submitted(_problme.taskid,_problme.problemid),
                        'pass':count_pass(_problme.taskid,_problme.problemid),
                        'failed':count_failed(_problme.taskid,_problme.problemid)
                        
                    }

                })

                setFormat(_format)

            }
            else{
                
                _format = problmeid
                    .map((_problem) => {

                        const submission_check = data_submisstion[_problem.taskid].problems[_problem.problemid][my_username]
                        const submission_student = submission_check || false
                        return {
                            'taskid' : _problem.taskid,
                            'lessonname': _problem.lessonname,
                            'problemid':_problem.problemid,
                            'name': _problem.name,
                            'status':submission_student.status? submission_student.status : '-',
                            'attempts': submission_student? submission_student.attempts : '-',
                            'timed' :  (submission_student.timed!=null)? submission_student.timed.toFixed(4) : '-',
                            'memory' :  (submission_student.memory!=null)? (submission_student.memory/1024).toFixed(2) : '-',
                            'code': submission_student.code? submission_student.code : false 
                        }
                    })
                
                setFormat(_format)
            }
            setCoursesname(data_tasks.course_name)
            setMember(member)
            setAdmin(data_tasks.is_admin)
            setfinishedLoading(true)
        }

        format_submisstion()

    },[])


    return finishedLoading &&<div>
        <Grid>
            <Grid.Row>
                <Grid.Column width='12'>
                    <Container textAlign='left'>
                        <Header>รายละเอียดรายวิชา</Header>
                        <span> <b>ชื่อรายวิชา</b> : {coursesName} </span>
                        <br/>
                        {isAdmin &&<p><b>จำนวนสมาชิกนักเรียนในห้องทั้งหมด</b>: {Object.keys(member).length -1} คน</p>}
                 
                    </Container>
                </Grid.Column>
            </Grid.Row>

        {isAdmin? <Grid.Row centered>
                <Grid.Column width='15'>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='1'>#.</Table.HeaderCell>
                                <Table.HeaderCell width='2'>รายชื่อบทเรียน</Table.HeaderCell>
                                <Table.HeaderCell width='3'>ชื่อโจทย์</Table.HeaderCell>
                                <Table.HeaderCell width='1'>จำนวนการส่งคำตอบ</Table.HeaderCell>
                                <Table.HeaderCell width='1'>จำนวนการที่ทำผ่านแล้ว</Table.HeaderCell>
                                <Table.HeaderCell width='1'>จำนวนการที่ยังไม่ผ่าน</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {format.map((row,index) => <Table.Row>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{row.lessonname}</Table.Cell>
                                <Table.Cell>
                                    <NavLink to={`/courses/${courses_id}/${row.taskid}/example/${row.problemid}`}> {row.name} </NavLink>
                                </Table.Cell>
                                <Table.Cell>{row.submitted}</Table.Cell>
                                <Table.Cell>{row.pass}</Table.Cell>
                                <Table.Cell>{row.failed}</Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        :
            <Grid.Row centered>
                 <Grid.Column width='12'>
                     <Table celled>
                         <Table.Header>
                             <Table.Row>
                                <Table.HeaderCell width='1' rowSpan='2'>#</Table.HeaderCell>
                                <Table.HeaderCell width='2' rowSpan='2'>รายชื่อบทเรียน</Table.HeaderCell>
                                <Table.HeaderCell width='4' rowSpan='2'>รายชื่อโจทย์</Table.HeaderCell>
                                <Table.HeaderCell width='1' rowSpan='2'>สถานะ</Table.HeaderCell>
                                <Table.HeaderCell width='1' rowSpan='2' textAlign='center'>จำนวนการส่ง</Table.HeaderCell>
                                <Table.HeaderCell width='1' rowSpan='2' textAlign='center'>คำตอบที่ดีที่สุด</Table.HeaderCell>

                                <Table.HeaderCell colSpan ='2' textAlign='center'>ผลลัพธ์ที่ดีที่สุด</Table.HeaderCell>
                             </Table.Row>
                             <Table.Row>
                                <Table.HeaderCell width='2' textAlign='center'>ความเร็ว</Table.HeaderCell>
                                <Table.HeaderCell width='2' textAlign='center'>หน่วยความจำ</Table.HeaderCell>
                             </Table.Row>
                         </Table.Header>
                         <Table.Body>
                            {format.map((row,index) => <Table.Row>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{row.lessonname}</Table.Cell>
                                <Table.Cell>
                                    <NavLink to={`/courses/${courses_id}/${row.taskid}/example/${row.problemid}`}> {row.name} </NavLink>
                                </Table.Cell>
                                <Table.Cell>{row.status}</Table.Cell>
                                <Table.Cell>{row.attempts}</Table.Cell>
                                <Table.Cell>{(row.code)? <DescriptionCode code={row.code}/>:'-'}</Table.Cell>
                                <Table.Cell>{row.timed}</Table.Cell>
                                <Table.Cell>{row.memory}</Table.Cell>
                            </Table.Row>)}
                         </Table.Body>
                     </Table>
                 </Grid.Column>
             </Grid.Row>
        }
        </Grid>


    </div>
}


function DescriptionCode(props) {
    const {code} = props
    const [open,setOpen] = useState(false)

    return <>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button icon><Icon name='search'/></Button>}
            >
                <Header color='red' content='คำตอบของคุณ' />
                <Modal.Content>
                    <AceEditor
                            mode="python"
                            theme="github"
                            width='100%'
                            value={code}
                            readOnly = {true}
                            name="UNIQUE_ID_OF_DIV"
                            showPrintMargin={false}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                fontSize: 15
                            }}
                        />
                </Modal.Content>
                <Modal.Actions>
                    <Button color='gray' onClick={() => setOpen(false)}>
                        ปิด
                    </Button>
                </Modal.Actions>
            </Modal>
    </>
}