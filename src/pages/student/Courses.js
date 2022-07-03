import { useState, useEffect } from 'react';
import { Grid, Header, Button, Container, Tab, Divider, Icon, Modal } from 'semantic-ui-react';
import { NavLink, useParams } from 'react-router-dom'

import Context from '../../components/student/Context'
import Examples from '../../components/student/Example'
import MenuListLesson from '../../components/student/MenuListLesson'

import tasks from '../../services/tasks'

export default function Courses() {

    let { courses_id, task_id } = useParams();
    

    const [task_all, setTask_all] = useState()
    const [task, setTask] = useState()
    const [isLoading, setLoading] = useState(true)
    const [isAdmin,setIsAdmin] = useState(false)
    const [header,setHeader] = useState('loading ..')
    const [open, setOpen] = useState(false)


    localStorage.setItem('currentCourse', courses_id)

    useEffect(() => {
        tasks.get_tasks(courses_id)
            .then(res => {
                const task_sorted = res.tasks.sort((a, b) => a.name.localeCompare(b.name))
                setHeader(res.course_name)
                setTask_all(task_sorted)
                if (res.tasks.length > 0){
                    task_id = (task_id == undefined)? task_sorted[0].id : task_id
                    setTask(task_sorted.filter((item) => item.id == task_id)[0])
                    
                }
                else{
                    setTask({})
                }
                setIsAdmin(res.is_admin)
                setLoading(false)
            })
    }, [])

    let panes = null;

    if (!isLoading) {
        panes = [
            {
                menuItem: 'เนื้อหา', render: () => <Tab.Pane>
                    {task_all.length > 0 &&<Context context={task.context} />}
                </Tab.Pane>
            },
            {
                menuItem: 'โจทย์ปัญหา', render: () => <Tab.Pane>
                    {(task_all.length > 0)? <div>
                        <Container textAlign='right'>
                            {isAdmin &&<Button as={NavLink} to={`/createproblem/${courses_id}/${ task.id}`} icon labelPosition='left' style={{fontSize:'15px',fontFamily: 'Sarabun'}}>
                                <Icon name='add' />
                                สร้างโจทย์ปัญหา</Button>}
                            </Container>
                            <Divider hidden />
                            <Examples course_id={courses_id} task_id={ task.id} examples={task.problems} />
                        </div>
                     :
                     'สร้างบทเรียนของคุณก่อน'
                        
                    }
                    
                </Tab.Pane>
            },
        ]
    }


    return (
        <div>
        {!isLoading && <Grid>
            <Grid.Row>
                <Grid.Column width={3}>
                    <MenuListLesson header={header} courses_id={courses_id} courses={task_all} tasks_id={ task.id} isAdmin={isAdmin} />
                    <div style={{textAlign:'center',marginTop:'15px'}}>
                    {isAdmin &&<Button as={NavLink} to={`/createlesson/${courses_id}`} icon labelPosition='left' style={{fontSize:'15px',fontFamily: 'Sarabun'}}>
                        <Icon name='add' />สร้างบทเรียน
                    </Button>}
                    </div>
                </Grid.Column>

                <Grid.Column width={12}>
                    
                    {task.id != undefined && <Container floated='left' fluid>
                        <Header style={{ fontSize:'24px',fontFamily: 'Prompt',marginTop:'3px'}}>บทเรียน : { task.name}
                            {isAdmin &&<Modal
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                                open={open}
                                trigger={<Button color='red' floated='right' style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='remove' />ลบบทเรียน</Button>}

                            >
                                <Header style={{ color: 'red', fontSize: '16px',fontFamily: 'Prompt'}} content='ลบบทเรียนออกจากรายวิชา!' />
                                <Modal.Content>
                                    <p>บทเรียน <a style={{ color: 'red', fontSize: '16px', fontWeight: '900' }}>{task.name}</a> จะถูกลบออกจากระบบ</p>
                                </Modal.Content>
                                <Modal.Actions>
                                    {isAdmin && <Button color='red' style={{fontFamily: 'Sarabun'}}
                                        onClick={(e, v) => {
                                            tasks.delete_task(courses_id,  task.id)
                                                .then(() => {
                                                    setOpen(false)
                                                    window.location.replace(`/courses/${courses_id}`)
                                                })
                                                .catch((err) => {
                                                    setOpen(false)
                                                    window.location.replace(`/courses/${courses_id}`)

                                                })
                                        }}>
                                        <Icon name='remove' />ลบบทเรียน
                                    </Button>}
                                    <Button color='gray' style={{fontFamily: 'Sarabun'}} onClick={() => setOpen(false)}>
                                        ยกเลิก
                                    </Button>
                                </Modal.Actions>
                            </Modal>}
                           {isAdmin && <Button floated='right' as={NavLink} to={`/editlesson/${courses_id}/${ task.id}`} style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='edit' />แก้ไขบทเรียน</Button>}
                        </Header>
                        <br/>
                        <Tab panes={panes}/>
                    </Container>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
        }
    </div>
    )
}
