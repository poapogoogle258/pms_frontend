import { useState, useEffect } from 'react'
import { Grid, Header, Container, Divider, Segment, Button,TextArea, Table,Modal,Icon} from 'semantic-ui-react'
import { NavLink , useParams } from 'react-router-dom'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import MenuListExample from '../../components/student/MenuListExample'

import TextEditer from '../../components/student/TextEditer'
import TableRanking from '../../components/student/TableRanking'

import problems from '../../services/problems'

export default function CodeSubmitter() {

    const { courses_id, task_id, problemid } = useParams();
    const [task_problems,setTask_problems] = useState(null)
    const [problem, setProblem] = useState(null)
    const [isAdmin,setIsAdmin] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const gfm = require('remark-gfm')


    useEffect(() => {
        problems.get_problems(courses_id, task_id)
            .then(res => {
                setTask_problems(res)
                const problme_selected = res.problems.filter((item) => item.id == problemid)[0]
                setIsAdmin(res.is_admin)
                setProblem(problme_selected)
                setLoading(false)
            })
    },[])



    return <div>
        {!isLoading && <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <MenuListExample header={task_problems.task_name} tasks_id={task_id} problems={task_problems.problems} problemid={problemid} courses_id={courses_id}/>
                </Grid.Column>
                <Grid.Column width={9}>
                

                {isAdmin &&<Modal
                                    onClose={() => setOpen(false)}
                                    onOpen={() => setOpen(true)}
                                    open={open}
                                    trigger={<Button color='red' floated='right' style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='remove' />ลบโจทย์ปัญหา</Button>}

                                >
                                    <Header color='red' style={{ color: 'red', fontSize: '16px',fontFamily: 'Prompt'}} content='ลบโจทย์ปัญหาออกจากบทเรียน!' />
                                    <Modal.Content>
                                        <p>โจทย์ปัญหา <a style={{ color: 'red', fontSize: '20px', fontWeight: '900' }}>{problem.name}</a> จะถูกลบออกจากระบบ</p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        {isAdmin && <Button color='red' style={{fontFamily: 'Sarabun'}}
                                            onClick={(e, v) => {
                                                problems.delete(courses_id,  task_id, problemid)
                                                    .then(() => {
                                                        setOpen(false)
                                                        window.location.replace(`/courses/${courses_id}`)
                                                    })
                                                    .catch((err) => {
                                                        setOpen(false)
                                                        window.location.replace(`/courses/${courses_id}`)

                                                    })
                                            }}>
                                            <Icon name='remove' />ลบโจทย์ปัญหา
                                        </Button>}
                                        <Button color='gray' style={{fontFamily: 'Sarabun'}} onClick={() => setOpen(false)}>
                                            ยกเลิก
                                        </Button>
                                    </Modal.Actions>
                                </Modal>}
                {isAdmin && <Button floated='right' as={NavLink} to={`/editproblem/${courses_id}/${ task_id}/${ problemid}`} style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='edit' />แก้ไขโจทย์ปัญหา</Button>}
                    <Container>
                        <Header style={{ fontSize:'24px',fontFamily: 'Prompt',marginTop:'3px'}}>{problem.name}</Header>
                        <span style={{ 'float':'right','fontSize':'12px','color':'gray'}} inline>
                            <span style={{fontSize:'14px'}}>
                                {(problem.status=='failed')? <span style={{'color':'red'}}>(ยังไม่ผ่าน)</span> 
                                :
                                (problem.status=='notting')? <span style={{'color':'red'}}>(ยังไม่ได่ส่ง)</span> 
                                :
                                (problem.status=='late')? <span style={{'color':'black'}}>(ส่งสาย)</span> 
                                :
                                <span style={{'color':'black'}}>(ส่งแล้ว)</span>}{'  '}
                                {problem.deadline!=null? new Date(problem.deadline).toLocaleString('th-Th'):'ไม่มีกำหนดส่ง' }
                            </span>               
                        </span>
                        <p>{`คะแนนเต็ม: ${problem.score} ส่งสาย: ${problem.score_late}`}</p>
                        <Divider />
                        <Container basic>
                            <p style={{fontSize:'16px',fontWeight:'bold'}}>โจทย์ปัญหา</p>
                            <Segment>
                                {problem.statement}
                            </Segment>
                            <Divider />

                            <Container basic>
                                <p style={{fontSize:'16px',fontWeight:'bold'}}>คำอธิบาย</p>
                                <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]} children={problem.header}/>
                            </Container>
                            <Divider />
                            <p style={{fontSize:'16px',fontWeight:'bold'}}>ข้อจำกัดของโจทย์ปัญหา</p>

                            {problem.fixanswer && <div>
                                <span><Icon name='exchange' /> เอาต์พุตเหมือนกับเอาต์พุตของ Tase Case (ช่องว่างและตัวอักษรพิมพ์เล็ก-ใหญ่จะมีผลในการเปรียบเทียบ) </span><br/>
                            </div>}
                            {problem.noinput &&<div>
                                <span><Icon name='x'/><Icon name='keyboard outline'/> โจทย์ปัญหาที่ไม่มีอินพุค </span><br/>
                            </div>}
                            {problem.accept.length > 0 &&<div>
                                <span><Icon name='check'/> keywords ที่ต้องมี {problem.accept.join(',')}</span><br/>
                            </div>}
                            {problem.notaccept.length > 0 &&<div>
                                <span><Icon name='ban'/> keywords ที่ห้ามมี {problem.notaccept.join(',')}</span><br/>
                            </div>
                            }

                        </Container>
                        <Divider />
                        <Container>
                            <Grid.Row>
                                <Grid.Column width={14}>
                                    <TextEditer 
                                        courses_id ={courses_id} 
                                        task_id= {task_id} 
                                        problem_id={problemid} 
                                        defaultCode={problem.code} 
                                        testcase={problem.examplecase} 
                                        fixanswer={problem.fixanswer}
                                        accept = {problem.accept}
                                        notaccept = {problem.notaccept}
                                        feedback={""}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Container>
                        <Container>
                            <p style={{ fontSize: '24px',marginTop:'15px'}}>Test Case</p>
                            <Segment>
                                <Table celled>
                                    <Table.Header style={{textAlign:'center'}}>
                                        <Table.Row>
                                            <Table.HeaderCell width='1'></Table.HeaderCell>
                                            <Table.HeaderCell width='6'>อินพุต</Table.HeaderCell>
                                            <Table.HeaderCell width='6'>เอาต์พุต</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {[...Array(problem.examplecase.output.length).keys()].map((index) => {
                                    return <>
                                        <Table.Row style={{textAlign:'center'}}>
                                            <Table.Cell width='1'>
                                                    {index+1}
                                            </Table.Cell>
                                            <Table.Cell>
                                                    <TextArea
                                                    value={`${problem.examplecase.input[index]}`}
                                                    />
                                            </Table.Cell>
                                            <Table.Cell>
                                                    <TextArea
                                                        value={`${problem.examplecase.output[index]}`}
                                                    />
                                            </Table.Cell>
                                        </Table.Row>
                                    </>
                                    })
                                    }
                                    </Table.Body>
                                </Table>
                            </Segment>
                        </Container>
                    </Container>
                </Grid.Column>

                <Grid.Column width={4}>
                    <TableRanking coursesid={courses_id} taskid={task_id} problemid={problemid}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>}
    </div>
}