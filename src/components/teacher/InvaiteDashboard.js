import _ from 'lodash'
import {useState,useEffect} from 'react'
import { Button, Table, Input, Icon,Header, Modal, Form } from 'semantic-ui-react'

import CourseMember from '../../services/coursemember'






export default function InvaiteDashboard(pros){
    const {coursesid} = pros 

    const [students, setStudents] = useState(null)
    const [email,setEmail] = useState('')
    const [message,setMessage] = useState(null)



    const  Modal_delete_student = (pros) => {

        const { username_student , realname_student } = pros

        const [open,setOpen] = useState(false)

        async function Delete(username){
            const res_dalete = await CourseMember.delete(coursesid,username)
            setMessage(`deleted ${username}`)
            setOpen(false)
        }


        return <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<Button icon textAlign='center'>
                    <Icon name='ban' color='red' />
                </Button>}
            >
                <Header color='red' content='ลบรายนักเรียนออกจากรายวิชาของคุณ!' />
                <Modal.Content>
                    <p>นักเรียน <a style={{ color: 'red', fontSize: '20px', fontWeight: '900' }}>{realname_student}</a> จะถูกลบออกจากรายวิชานี้</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button type='button' color='red'
                        value={username_student}
                        onClick={(e,{value}) =>Delete(value)}>
                        <Icon name='remove' />ลบนักเรียนออกจากวิชานี้
                    </Button>
                    <Button type='button' color='gray' onClick={() => setOpen(false)}>
                        ยกเลิก
                    </Button>
                </Modal.Actions>
            </Modal>
    }

    useEffect(() =>{
        async function load_member() {
            const data = await CourseMember.get_users(coursesid)
            setStudents(data)
        }
        load_member()
    },[message])

    function Invate(){
        CourseMember.invate(coursesid,email)
        .then(res => {
            if (res.status == 'success'){ 
                setMessage(`invated student ${res.realname}`)
            }else{
                setMessage(res.message)
            }
        })
    }



    return <div>
        <Form>
        <Form.Group inline>
            <div style={{fontSize:'16px',marginRight:'10px'}}>เชิญจากอีเมล :</div>
            <Form.Field width='6'>
                
                <Input fluid placeholder='student@email.com ...' action={{icon: 'search',onClick : Invate }} value={email} onChange={(e,{value}) => setEmail(value)} />
            </Form.Field>
            </Form.Group>
        </Form>
        <div style={{fontSize:'16px',marginRight:'10px'}}>จำนวนสมาชิก : {students != null?  _.size(students):''} {message}</div>
        <Table celled>
            <Table.Header>
                <Table.HeaderCell width='1'>#. </Table.HeaderCell>
                <Table.HeaderCell>ชื่อสมาชิก </Table.HeaderCell>
                <Table.HeaderCell>อีเมล </Table.HeaderCell>
                <Table.HeaderCell width='2' textAlign='center'>สถานะ</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {students != null && Object.keys(students).map((username, index) => <Table.Row>
                    <Table.Cell>{index+1}</Table.Cell>
                    <Table.Cell>{students[username].realname}</Table.Cell>
                    <Table.Cell>{students[username].email}</Table.Cell>
                    <Table.Cell>
                        {(students[username].isAdmin)?
                            'admin'
                            :
                            <Modal_delete_student username_student = {username} realname_student = {students[username].realname} />
                        }
                    </Table.Cell>
                </Table.Row>)}
            </Table.Body>
        </Table> 
    </div>
}

