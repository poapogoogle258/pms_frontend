import { Button, Form, Container, TextArea, Icon } from 'semantic-ui-react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import { useEffect } from "react";

import courses from '../../services/courses';



function CreateCourses() {

    const signupSchema = yup.object().shape({
        name: yup.string().required('กรุณาใส่ชื่อรายวิชา'),
        password: yup.string().min(4,'กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร').max(20).required('กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร'),
    })
    

    const old_data = localStorage.getItem('created_course')

    const { register, handleSubmit, control, formState: { errors } ,watch, getValues } = useForm(
        {
            resolver: yupResolver(signupSchema), 
            defaultValues: {
                ...JSON.parse(old_data)
            }
        })
    
    const watchAllFields = watch()

    useEffect(() => {

        localStorage.setItem( 'created_course' , JSON.stringify( getValues() ))
    
    },[watchAllFields])

    const create_new_course = (data) => {
        let from_data = {
            'name': data.name,
            'password': data.password,
            'description': data.description
        }
        courses.create_course(from_data)
            .then((res) => {
                if (res.status == 'success') {
                    localStorage.removeItem('created_course')
                    window.location.replace(`/courses/${res.courseid}`)
                }
            })
            .catch((err) => console.log(err))
    }

    return <div>
        <Container>
            <Form onSubmit={handleSubmit(create_new_course)}>
                <div style={{ marginBottom: '5px', fontSize: '16px' }}>ชื่อรายวิชา</div>
                <Controller
                    control={control}
                    name='name'
                    render={({ field }) => <Form.Input  {...field} placeholder='เช่น ภาษาไพธอนพื้นฐาน' />}
                />
                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                <div style={{ marginBottom: '5px', fontSize: '16px' }}>รหัสผ่านเข้าสู่รายวิชา</div>
                <Controller
                    control={control}
                    name='password'
                    render={({ field }) => <Form.Input  {...field} placeholder='รหัสผ่านสำหรับการเข้าสู่รายวิชา' />}
                />
                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                <div style={{ marginBottom: '5px', fontSize: '16px' }}>คำอธิบาย</div>
                <Controller
                    control={control}
                    name='description'
                    render={({ field }) => <Form.Field
                        {...field}
                        control={TextArea}
                        rows={10}
                        placeholder='บอกรายละเอียดเกี่ยวกับรายวิชาของฉัน'
                    />}
                />
                <div style={{ textAlign: 'center' }}>
                    <Button color='green' type='submit' style={{ fontSize: '15px', fontFamily: 'Sarabun' }}><Icon name='save' />บันทึกผล</Button>
                </div>
            </Form>
        </Container>
    </div>
}

export default CreateCourses;