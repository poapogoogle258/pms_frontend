import _ from 'lodash'
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'
import { Table,Segment, Grid, Modal,Header,Button, Container,Input} from 'semantic-ui-react'
import { NavLink , useParams } from 'react-router-dom'

import { useForm,FormProvider,Controller,useFormContext, get } from "react-hook-form";



import CourseMember from '../../services/coursemember'
import submissions from '../../services/submissions'
import tasks from '../../services/tasks'


import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

function Input_update_extrapoint(pros) {
    
    const { problemid,username ,value} = pros
    const { getValues,control,setValue } = useFormContext()

    if(getValues(`${problemid}.${username}`) == undefined){
        setValue(`${problemid}.${username}`,value)
    }

    const updateAddScore = (newScore) => {
        if((newScore == '-' || newScore == '') || (Number(newScore) != NaN && Number(newScore) < 100 && Number(newScore) > -100)){
            setValue(`${problemid}.${username}`,Number(newScore))
        }
    }

    return <Controller
        control={control}
        name={`${problemid}.${username}`}
        render={({ field }) => <Input fluid {...field} fluid onChange={(e,v) => updateAddScore(v.value)} />}
    />
    
   
}

function TestPopupCode(props) {
    const {problmeSubmised} = props

    const [open,setOpen] = useState(false)

    if (problmeSubmised.succeeded == false){
        console.log(problmeSubmised)
    }


    return (problmeSubmised.succeeded == false && problmeSubmised.status == null)? '-'
            :
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button type='button'>{`${(problmeSubmised.succeeded==false)? "failed": problmeSubmised.status}`}</Button>}
            >
                <Header color='red' content='คำตอบของนักเรียน' />
                <Modal.Content>
                    <Segment>
                        <p>การตอบกลับ : {(problmeSubmised.succeeded)? 'ผ่านแล้ว':'ยังไม่ผ่าน'}</p>
                        {problmeSubmised.succeeded &&<p>คุณภาพของโค็ต : {`memory : ${(problmeSubmised.memory/1024).toFixed(2) } Kib, runtime : ${(problmeSubmised.runtime).toFixed(4)} วินาที.`}</p>}
                    </Segment>
                    <AceEditor
                            mode="python"
                            theme="github"
                            width='100%'
                            value={problmeSubmised.code}
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
                    <Button type='button' color='gray' onClick={() => setOpen(false)}>
                        ปิด
                    </Button>
                </Modal.Actions>
            </Modal>
    }

export default function ScoreTaskDashboard(){
    const {courses_id,task_id} = useParams() 

    const methods = useForm();
    const [problme_courses,setProblme] = useState()
    const [finishedLoading,setfinishedLoading] = useState(false)
    const [isAdmin,setAdmin] = useState(false)
    const [maxScore,setMaxScore] = useState(0)
    const [format,setFormat] = useState(null)
    const [coursesName,setCoursesname] = useState('')
    const [saveState,setSaveState] = useState(-1)

    

    useEffect(()=>{

        async function format_submisstion() {

            const memberall = await CourseMember.get_users(courses_id)
            const member = Object.entries(memberall).filter((item) => !item[1].isAdmin)

            const data_problme = await tasks.get_tasks(courses_id,task_id)
            const data_submisstion = await submissions.get_submissions(courses_id,task_id)
            const data_problmes_submission = data_submisstion[task_id].problems

            const problmesid =  data_problme.tasks[0].problems
                .map((_problem) => {return {'id' :_problem.id,'name':_problem.name}})
                .sort((a ,b) => (a.name > b.name)? 1 :-1 )
            
            const _format = member.map((people) => {
                const username = people[0]
                const realname = people[1].realname

                const problmeScore = problmesid.map((problme) => {

                    const haveAnswer = data_problmes_submission[problme.id][username] != undefined

                    return {
                        'problemid': problme.id,
                        'succeeded': (haveAnswer)? data_problmes_submission[problme.id][username].succeeded : false,
                        'status' : (haveAnswer)? data_problmes_submission[problme.id][username].status : "notting",
                        'score': (haveAnswer)? data_problmes_submission[problme.id][username].grade : 0,
                        'code': (haveAnswer)? data_problmes_submission[problme.id][username].code : "",
                        'runtime': (haveAnswer)? data_problmes_submission[problme.id][username].timed : 0,
                        'memory' : (haveAnswer)? data_problmes_submission[problme.id][username].memory : 0,
                        'attempts' : (haveAnswer)? data_problmes_submission[problme.id][username].attempts : 0,
                        'extrapoint': (haveAnswer)? data_problmes_submission[problme.id][username].extrapoint : 0
                    }
                })
                const result = problmeScore.reduce((init,_problme) => init + _problme.score + _problme.extrapoint ,0)

                return {
                    'realname': realname,
                    'username':username,
                    'problemid': problmeScore.problemid,
                    'resultSucceeded' : result,
                    'problmeScore': problmeScore,
                    'attempts':problmeScore.attempts
                } 
            }) 
 
            
            let _maxScore = 0
            data_problme.tasks.forEach(lesson => {
                lesson.problems.forEach((problem) => {
                    const score = problem.score || 0
                    _maxScore = _maxScore + score
                })
            });

            setCoursesname(data_problme.course_name)
            setFormat(_format)
            setProblme(problmesid)
            setMaxScore(_maxScore)
            setAdmin(data_problme.is_admin)
            setfinishedLoading(true)
        }

        format_submisstion()
        console.log('one yet')

    },[saveState])


    async function onSubmit(data) {
        
        const res = await fetch(`http://10.201.30.27/pms/backend/api/plugin/extrapoint/${courses_id}/${task_id}`,{
            method : 'POST',
            credentials: 'include',
            body : JSON.stringify(data)
        })

        const Data = await res.json()

        if (Data.error) {
            setSaveState(0)
        }
        else{
            setSaveState(saveState + 2)
        }

    } 


    return finishedLoading &&<div>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                {isAdmin && <Grid.Row centered>
                        <Grid.Column width='15'>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width='1' rowSpan='3'>#.</Table.HeaderCell>
                                        <Table.HeaderCell width='3' rowSpan='3'>ชื่อ - นามสกุล</Table.HeaderCell>
                                        <Table.HeaderCell width='1' rowSpan='3'>คะแนนรวม({maxScore})</Table.HeaderCell>
                                        <Table.HeaderCell colSpan={problme_courses.length *4 } textAlign='center'>โจทย์ปัญหา</Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row>
                                        {problme_courses.map((lesson) => <Table.HeaderCell colSpan='4' textAlign='center'>
                                            <NavLink to={`/courses/${courses_id}/${task_id}/example/${lesson.id}`}> {lesson.name} </NavLink>
                                        </Table.HeaderCell>)}
                                    </Table.Row>
                                    <Table.Row>
                                        {problme_courses.map((lesson,index) => <>
                                            <Table.HeaderCell width='1'>สถานะการส่ง</Table.HeaderCell>
                                            <Table.HeaderCell width='1' >จำนวนการส่ง</Table.HeaderCell>
                                            <Table.HeaderCell width='1' colSpan='2'>คะแนน</Table.HeaderCell>
                                        </>)
                                        }
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {format.map((member,index) => {
                                        return <>
                                            <Table.Row>
                                                <Table.Cell>{index+1}</Table.Cell>
                                                <Table.Cell>{member.realname}</Table.Cell>
                                                <Table.Cell>{member.resultSucceeded}</Table.Cell> 
                                                {member.problmeScore.map((_problmeSubmised) => {
                                                    return <>
                                                        <Table.Cell>
                                                            {(_problmeSubmised.status != 'notting')? <TestPopupCode problmeSubmised={_problmeSubmised}/>
                                                                : 
                                                                '-'
                                                            }

                                                        </Table.Cell>
                                                        <Table.Cell>{_problmeSubmised.attempts}</Table.Cell> 
                                                        <Table.Cell>{_problmeSubmised.score}</Table.Cell>  
                                                        <Table.Cell>
                                                            <Input_update_extrapoint value={_problmeSubmised.extrapoint} username={member.username} courses_id={courses_id} task_id={task_id} problemid={_problmeSubmised.problemid}/>
                                                        </Table.Cell> 
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
                    </Grid.Row>}
                    <Container textAlign ='center'>
                        {(saveState < 0)? '':
                        saveState? <p style={{'color':'green'}}>บันทึกข้อมูลแล้ว</p>:<p style={{'color' : 'red'}}>บันทึกข้อมูลไม่สำเร็จ</p>}
                        <Button type='submit' color='green'>บันทึกการเปลียนแปลง</Button>   
                    </Container>
                </Grid>
            </form>
        </FormProvider>

    </div>
}




