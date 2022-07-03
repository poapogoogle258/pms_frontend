import { useState, useEffect } from "react"
import { Form, Button, Input, Label, Container, Header, Modal, Icon } from 'semantic-ui-react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import courses from '../../services/courses'



export default function CourseEditDashboard(pros) {
    const { coursesid } = pros

    const [course, SetCourse] = useState(null)
    const [stateUpdate, setStateUpdate] = useState(null)
    const [open, setOpen] = useState(false)
    const [isloding, setLoading] = useState(true)

    const signupSchema = yup.object().shape({
        name: yup.string().required('กรุณาใส่ชื่อรายวิชา'),
        registration_password: yup.string().min(4, 'กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร').max(20).required('กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร'),
    })
    const { register, handleSubmit, control, formState: { errors }, getValues } = useForm({ resolver: yupResolver(signupSchema) });

    const copy_link_courses = () => navigator.clipboard.writeText((`http://localhost:3000/joincourse/${coursesid}/${getValues('registration_password')}`))
    const delete_this_course = () => courses.delete_course(coursesid).then((res) => window.location.replace('/home'))


    useEffect(() => {
        setLoading(true)
        courses.get_course(coursesid)
            .then((res) => {
                SetCourse(res[0])
                setLoading(false)
            })
            .catch((err) => console.log(err))

    }, [])

    function SubmitForm(update_data) {
        courses.update_course(coursesid, update_data)
            .then((res) => setStateUpdate(true))
            .catch((err) => setStateUpdate(false))
    }

    return <div>
        <Header>
            แก้ไขข้อมูลรายวิชา :
        </Header>
        {!isloding && <Container fluid style={{ margin: '20px' }}>
            <Form onSubmit={handleSubmit(SubmitForm)}>
                <Form.Group inline>
                    <div style={{ fontSize: '16px', marginRight: '10px' }}>ชื่อรายวิชา : </div>
                    <Form.Field inline>
                        <input defaultValue={course.name} {...register('name')} />
                    </Form.Field>
                </Form.Group>
                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                <Form.Group inline>
                    <div style={{ fontSize: '16px', marginRight: '10px' }}>รหัสผ่าน : </div>
                    <Form.Field inline >
                        <input defaultValue={course.password} {...register('registration_password')} />
                        <Button style={{ 'margin': '10px' }} type='button' onClick={copy_link_courses} style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>คัดลอกลิงก์</Button>
                    </Form.Field>
                </Form.Group>
                {errors.registration_password && <p style={{ color: 'red' }}>{errors.registration_password.message}</p>}
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>รายละเอียดรายวิชา :</div>
                <Form.Field>
                    <textarea defaultValue={course.description} {...register('description')} />
                </Form.Field>
                {stateUpdate != null && <Container textAlign='center'>
                    {stateUpdate ? <p style={{ color: 'green' }}>บันทึกการเปลียนแปลงสำเร็จ</p> : <p style={{ color: 'red' }}>บันทึกการเปลียนแปลงไม่สำเร็จ</p>}
                </Container>}

                <Container textAlign='center'>
                    <Button type='submit' color='green' style={{ fontSize: '15px', fontFamily: 'Sarabun' }}><Icon name='save' />บันทึกผล</Button>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button type='button' color='red' style={{ fontSize: '15px', fontFamily: 'Sarabun' }}><Icon name='remove' />ลบรายวิชา</Button>}
                    >
                        <Header color='red' style={{ color: 'red', fontSize: '16px', fontFamily: 'Prompt' }} content='ลบรายวิชาออกจากรายวิชาของคุณ!' />
                        <Modal.Content>
                            <p>รายวิชา <a style={{ color: 'red', fontSize: '20px', fontWeight: '900' }}>{course.name}</a> จะถูกลบออกจากระบบ</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button type='button' color='red'
                                onClick={(e, v) => {
                                    delete_this_course();
                                    setOpen(false)
                                }}>
                                <Icon name='remove' />ลบรายวิชา
                            </Button>
                            <Button type='button' color='gray' style={{ fontFamily: 'Sarabun' }} onClick={() => setOpen(false)}>
                                ยกเลิก
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Container>
            </Form>
        </Container>}

    </div>

}

