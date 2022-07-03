import _ from 'lodash'
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'
import { Table, Grid, Icon,Button,Header,Modal,Container, Segment} from 'semantic-ui-react'
import { NavLink , useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';


import CourseMember from '../../services/coursemember'
import submissions from '../../services/submissions'
import tasks from '../../services/tasks'


import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

export default function ScoreDashboard(pros){
    const {courses_id} = useParams() 

    const [task_courses,setTasks] = useState()

    const [finishedLoading,setfinishedLoading] = useState(false)
    const [isAdmin,setAdmin] = useState(false)
    const [maxScore,setMaxScore] = useState(0)
    const [format,setFormat] = useState(null)
    const [coursesName,setCoursesname] = useState('')
    const my_username = useSelector(state => state.sessions.currentUser)



    useEffect(()=>{

        async function format_submisstion() {

            const member = await CourseMember.get_users(courses_id)
            const data_tasks = await tasks.get_tasks(courses_id)
            const data_submisstion = await submissions.get_submissions(courses_id)

            const tasksid =  data_tasks.tasks
                .map((task) => {return {'id' : task.id,'name':task.name}})
                .sort((a ,b) => (a.name > b.name)? 1 :-1 )
            let _format;

            console.log(data_tasks.tasks)

            if(data_tasks.is_admin){
                _format = Object.entries(member).map((people) => {

                    const get_score_task = (_submisstion,_username) => Object.values(_submisstion.problems)
                        .map((_problem) => _problem[_username]?  Number(_problem[_username].grade) + Number(_problem[_username].extrapoint) : 0)
                        .reduce((init,number) => init + number,0)

                    const get_number_succeeded = (_submisstion,_username) => Object.values(_submisstion.problems)
                        .map((_problem) => (_problem[_username] == undefined || !_problem[_username].succeeded)? 0 : 1)
                        .reduce((init,number) => init + number,0)
                    
                    const username = people[0]
                    const realname = people[1].realname
                    const taskScore = tasksid.map((task) => {
    
                        return {
                            'succeeded': get_number_succeeded(data_submisstion[task.id],username),
                            'score': get_score_task(data_submisstion[task.id],username)
    
                        }
                    })
                    const result = taskScore.reduce((init,_task) => init + _task.score  ,0)
    
                    return {
                        'realname': realname,
                        'username':username,
                        'resultSucceeded' : result,
                        'taskScore': taskScore,
                    }
                })
                
                setFormat(_format)

            }
            else{
                let problmeid = [];
                const history_submission = await submissions.get_historys_submission(courses_id)
                

                tasksid.forEach((_task) => {
                    data_tasks.tasks.filter((__task) => __task.id === _task.id)[0].problems
                        .forEach((_problem) => {
                            problmeid.push({
                                "taskid" : _task.id,
                                "problmeid":_problem.id,
                                'lessonname':_task.name,
                                'score_task':_problem.score,
                                "name": _problem.name,
                                "deadline" : _problem.deadline
                            })
                        })
                })
                
                _format = problmeid
                    .map((_problem) => {

                        const submission_check = data_submisstion[_problem.taskid].problems[_problem.problmeid][my_username]
                
                        const submission_student = (submission_check !== undefined )
                        
                        return {
                            'taskid' : _problem.taskid,
                            'problemid':_problem.problmeid,
                            'name': _problem.name,
                            'lessonname':_problem.lessonname,
                            'status':( submission_student && submission_check.status !== null )? submission_check.status : '-',
                            'scoreTask':_problem.score_task,
                            'point': ( submission_student && submission_check.status !== null )? submission_check.grade : '0',
                            'extrapoint' : submission_student? submission_check.extrapoint : 0,
                            'submission_on': ( submission_student && submission_check.status !== null )? new Date(submission_check.submitted_on) : '-',
                            'deadline':_problem.deadline? new Date(_problem.deadline) : 'ไม่มีกำหนดส่ง',
                            'history': history_submission[_problem.taskid].problems[_problem.problmeid][my_username],
                            'code': submission_student? submission_check.code : false 
                        }

                    })
                
                setFormat(_format)
                console.log(_format)
            }
            

            let _maxScore = 0
            data_tasks.tasks.forEach(lesson => {
                lesson.problems.forEach((problem) => {
                    const score = problem.score || 0
                    _maxScore = _maxScore + score
                })
            });

            setMaxScore(_maxScore) 
            setCoursesname(data_tasks.course_name)
            setAdmin(data_tasks.is_admin)
            setTasks(tasksid)
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
                 
                    </Container>
                </Grid.Column>
            </Grid.Row>
                
        {isAdmin?<Grid.Row centered>
                <Grid.Column width='15'>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='1' rowSpan='3'>#.</Table.HeaderCell>
                                <Table.HeaderCell width='3' rowSpan='3'>ชื่อ - นามสกุล</Table.HeaderCell>
                                <Table.HeaderCell width='1' rowSpan='3'>คะแนนรวม({maxScore})</Table.HeaderCell>
                                <Table.HeaderCell colSpan={task_courses.length *2 } textAlign='center'>บทเรียน</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                {task_courses.map((lesson) => <Table.HeaderCell colSpan='2' textAlign='center'>
                                    <NavLink to={`/score/${courses_id}/${lesson.id}`}>{lesson.name}</NavLink>
                                </Table.HeaderCell>)}
                            </Table.Row>
                            <Table.Row>
                                {task_courses.map((lesson) => <>
                                    <Table.HeaderCell>จำนวนงานที่ส่ง</Table.HeaderCell>
                                    <Table.HeaderCell>คะแนน</Table.HeaderCell>
                                </>)
                                }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {format.map((member,index) => {
                                const id = member
                                return <>
                                    <Table.Row>
                                    <Table.Cell>{index+1}</Table.Cell>
                                    <Table.Cell>{member.realname}</Table.Cell>
                                    <Table.Cell>{member.taskScore.reduce((init,_taskScore) => init + _taskScore.score,0)}</Table.Cell> 
                                    {member.taskScore.map((_taskSubmised) => {
                                        return <>
                                            <Table.Cell>{_taskSubmised.succeeded}</Table.Cell>
                                            <Table.Cell>{_taskSubmised.score}</Table.Cell>  
                                        </>
                                    })
                                    }                                 
                                </Table.Row>
                                </>
                            })
                            }
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        :
            <Grid.Row centered>
                 <Grid.Column width='15'>
                     <Table celled>
                         <Table.Header>
                             <Table.HeaderCell width='1'>#</Table.HeaderCell>
                             <Table.HeaderCell width='3'>รายชื่อบทเรียน</Table.HeaderCell>
                             <Table.HeaderCell width='3'>รายชื่อโจทย์</Table.HeaderCell>
                             <Table.HeaderCell width='1'>สถานะ</Table.HeaderCell>
                             <Table.HeaderCell width='1'>คะแนนเต็ม</Table.HeaderCell>
                             <Table.HeaderCell width='1'>คะแนน</Table.HeaderCell>
                             <Table.HeaderCell width='2'>ส่งเมื่อ</Table.HeaderCell>
                             <Table.HeaderCell width='2'>กำหนดส่ง</Table.HeaderCell>
                             <Table.HeaderCell width='1'>รายละเอียด</Table.HeaderCell>
                         </Table.Header>
                         <Table.Body>
                             {format.map((row,index) => <Table.Row>
                                 <Table.Cell>{index+1}</Table.Cell>
                                 <Table.Cell>{row.lessonname}</Table.Cell>
                                 <Table.Cell><NavLink to ={`/courses/${courses_id}/${row.taskid}/example/${row.problemid}`}>{row.name}</NavLink></Table.Cell>
                                 <Table.Cell>{row.status}</Table.Cell>
                                 <Table.Cell>{row.scoreTask}</Table.Cell>
                                 <Table.Cell>{row.extrapoint == 0? `${row.point}` : `${row.point} ( ${(row.extrapoint > 0)? `+${row.extrapoint}` : `${row.extrapoint}` } )`}</Table.Cell>
                                 <Table.Cell>{row.submission_on.toLocaleString('th-Th')}</Table.Cell>
                                 <Table.Cell>{row.deadline.toLocaleString('th-Th')}</Table.Cell>
                                 <Table.Cell>{(row.status != '-')? <DescriptionCode history ={row.history}/> : '-'} </Table.Cell>
                             </Table.Row>)}
                         </Table.Body>
                         <Table.Footer style={{'backgroundColor' : 'Azure'}}>
                             <Table.Cell></Table.Cell>
                             <Table.Cell></Table.Cell>
                             <Table.Cell>คะแนนรวม</Table.Cell>
                             <Table.Cell></Table.Cell>
                             <Table.Cell>{format.reduce((init,row) => init + Number(row.point) + Number(row.extrapoint) ,0)} / {maxScore}</Table.Cell>
                             <Table.Cell></Table.Cell>
                             <Table.Cell></Table.Cell>
                             <Table.Cell></Table.Cell>
                             <Table.Cell></Table.Cell>
                         </Table.Footer>
                     </Table>
                 </Grid.Column>
             </Grid.Row>
        }
        </Grid>

    </div>
}


function DescriptionCode(props) {
    const {history} = props
    const [open,setOpen] = useState(false)
    const [stateHistory,setStateHistory] = useState(history)
    const [page,setPage] = useState('table')
    const [code,setCode] = useState('')
    const [feedback,setFeedback] = useState('')
    const [quality,setQuality] = useState('')
    const [dataSwitch,setDataSwitch] = useState(true)

    const switch_data = () => {
        setDataSwitch(!dataSwitch)
        setStateHistory(stateHistory.reverse())
    }

    return <>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button icon><Icon name='search'/></Button>}
            >
                <Header color='red' content='คำตอบของคุณ' />
                <Modal.Content>
                    {page=='table' &&<Container>
                        <span onClick={switch_data}>(เรียงจาก {(dataSwitch)? 'หลัง -  หน้า':'หน้า - หลัง'}) <Icon name='sort'/></span>
                        <Table>
                            <Table.Header>
                                <Table.HeaderCell width='1'>#</Table.HeaderCell>
                                <Table.HeaderCell width='3'>วันเวลาที่ส่ง</Table.HeaderCell>
                                <Table.HeaderCell width='1'>สถานะ</Table.HeaderCell>
                                <Table.HeaderCell width='1'>คำตอบ</Table.HeaderCell>
                            </Table.Header>
                            <Table.Body>
                                {stateHistory.map((submistion,index) => <Table.Row>
                                    <Table.Cell>{index+1}</Table.Cell>
                                    <Table.Cell>{new Date(submistion.submitted_on).toLocaleString('th-Th')}</Table.Cell>
                                    <Table.Cell>{(submistion.status!="failed")? 'ผ่าน':'ไม่ผ่าน'}</Table.Cell>
                                    <Table.Cell><Button icon value={submistion.code} onClick={(e,v) => {
                                        setCode(v.value)
                                        setPage('Answer')
                                        setFeedback(`${(submistion.status != 'failed')? 'ผ่าน':`ยังไม่ผ่าน : ${submistion.feedback}`}`)
                                        setQuality({'memory':submistion.memory,'runtime':submistion.timed})
                                        }}>
                                        <Icon name='file code'/>
                                    </Button></Table.Cell>
                                </Table.Row>)}
                            </Table.Body>
                        </Table>
                    </Container>}

                    {page=='Answer' &&<Container>
                        <Segment>
                            <p>การตอบกลับ : {feedback}</p>
                            {quality.memory!=null &&<p>คุณภาพของโค็ต : {`memory : ${(quality.memory/1024).toFixed(2) } Kib, runtime : ${(quality.runtime).toFixed(4)} วินาที.`}</p>}
                        </Segment>
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
                    </Container>}
                </Modal.Content>
                <Modal.Actions>
                    <Container textAlign='right'>
                        {page=='Answer' &&<Button color='gray' onClick={() => setPage('table')}>
                            ย้อนกลับ
                        </Button>}
                        <Button color='gray' onClick={() => setOpen(false)}>
                            ปิด
                        </Button>
                    </Container>
  
                </Modal.Actions>
            </Modal>
    </>
}