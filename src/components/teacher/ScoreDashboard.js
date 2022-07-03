import _ from 'lodash'
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'
import { Table,Dropdown, Grid} from 'semantic-ui-react'

import submissions from '../../services/submissions'
import tasks from '../../services/tasks'
import CourseMember from '../../services/coursemember'


export default function ScoreDashboard(pros){
    const {coursesid} = pros 
    const [taskidoptionTask,setOptionTask] = useState([])
    const [member,setMember] = useState()
    const [student_submission,Setstudent_submission] = useState(null)
    const [numberProblem,setNumberProblem] = useState(1)

    useEffect(()=>{
        let options = []

        tasks.get_tasks(coursesid)
        .then((res) => {
            const tasks = res.tasks
            tasks.map((task,index) => {options.push({ 
                key: index,
                value: task.id,
                text :task.name,
                content:task.name
            })
        })
        const sord_options = options.sort((a ,b) => (a.content > b.content)? 1 :-1 )
        CourseMember.get_users(coursesid).then((res) => setMember(res))
        setOptionTask(sord_options)
        })
    },[])

    async function selectTask(taskid){
        submissions.get_submissions(coursesid,taskid).then((res) => {
            const problemid = Object.keys(res.problems)
            setNumberProblem(problemid.length)

            const formats = Object.keys(member).map((username) => {
                let format = {
                    'username':username,
                    'realname' : member[username].realname,
                    'submisstions' : []
                }
                
                problemid.forEach((id) => {
                    let submission = null
                    if (res['problems'][id][username] != null){
                        submission = {
                            'problemid':id,
                            'attempts':res['problems'][id][username]['attempts'],
                            'code':res['problems'][id][username]['code'],
                            'status':res['problems'][id][username]['status'],
                            'succeeded':res['problems'][id][username]['succeeded']? 'succeeded':'failed',
                            'feedback':res['problems'][id][username]['feedback'],
                            'submitted_on':res['problems'][id][username]['submitted_on'],
                        }
                    }

                    format['submisstions'].push(submission)
                })

                return format
            });
            Setstudent_submission(formats)
        })

    }

    return <div>
        <Grid>
            <Grid.Row>
                <Table>
                    <Table.Header>
                        <Table.HeaderCell width='2' rowSpan='2'>name</Table.HeaderCell>
                        <Table.HeaderCell width='1' rowSpan='2'>submission</Table.HeaderCell>
                        <Table.HeaderCell width='1' rowSpan='2'>succeeded</Table.HeaderCell>
                        <Table.HeaderCell width='1' rowSpan='2'>poiot</Table.HeaderCell>
                        <Table.HeaderCell width='13' colSpan='2'textAlign='center'>Lesson</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>
                        
                    </Table.Body>
                </Table>
            </Grid.Row>
        </Grid>
    </div>

    return <div>    
        <Grid>
            <Grid.Row>
                <Grid.Column width='2'>
                    Select Lesson :
                </Grid.Column>
                <Grid.Column width='7'>
                    <Dropdown  fluid placeholder='Select ...' options={taskidoptionTask} onChange={(e,{value}) => selectTask(value)} selection />
                </Grid.Column>
            </Grid.Row>
                {student_submission!=null && <Table celled structured>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width='1' rowSpan='3'>#.</Table.HeaderCell>
                            <Table.HeaderCell width='4' rowSpan='3'>Name</Table.HeaderCell>
                            <Table.HeaderCell colSpan={2*numberProblem} width={2*numberProblem} textAlign='center'>Excercise</Table.HeaderCell> 
                            
                        </Table.Row>
                        <Table.Row> 
                            {Array(numberProblem).fill().map((_,index) => <> 
                            <Table.HeaderCell colSpan={2} textAlign='center'>
                                example {index+1}
                            </Table.HeaderCell> 
                            </>)}
                        </Table.Row>
                        <Table.Row>
                            {Array(numberProblem).fill().map((_,index) => <> 
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>attempts</Table.HeaderCell>
                            </>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {student_submission.map((item,index) => <>
                            <Table.Row>
                                <Table.Cell>{index+1}</Table.Cell>
                                <Table.Cell>{item.realname}</Table.Cell>
                                {item.submisstions.map((submission) => <>
                                    <Table.Cell>{submission==null? "-" : `${submission.succeeded}(${submission.status})`}</Table.Cell>
                                    <Table.Cell>{submission==null? "-" : submission.attempts}</Table.Cell>
                                </>)}
                            </Table.Row>
                        </>)}
                    </Table.Body>
                </Table>
            }

        </Grid>
    </div>
}