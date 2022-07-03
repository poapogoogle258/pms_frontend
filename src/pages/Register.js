import { Form, Button, Container, Segment, Header, Icon } from 'semantic-ui-react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useState } from 'react';
import users  from '../services/users';

// const genderOptions = [
//     { key: 'm', text: 'Male', value: 'male' },
//     { key: 'f', text: 'Female', value: 'female' },
//     { key: 'o', text: 'Other', value: 'other' },
// ]
// const [chenkbox, setCheckbok] = useState(false);

 function Register() {
    const [errDuplicateuser,setErrDuplicateuser] = useState()
    const [errDuplicateemail,setErrDuplicateemail] = useState()
    const signupSchema = yup.object().shape({
        username: yup.string().min(4,'กรุณาใส่ชื่อผู้ใช้งานอย่างน้อย 4 ตัวอักษร').required('กรุณาใส่ชื่อผู้ใช้งานอย่างน้อย 4 ตัวอักษร'),
        password: yup.string().min(4,'กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร').max(20).required('กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร'),
        passwordcf: yup.string().oneOf([yup.ref('password'), null], 'พาสเวิร์ดไม่เหมือนกัน'),
        name: yup.string().required('กรุณาใส่ชื่อ'),
        email: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณาใส่อีเมล'),
    })
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(signupSchema) });
    function SubmitForm(data){ 
        users.register(data.username,data.name,data.email,data.password,data.passwordcf)
        .then(res => {
            if (res.data.status == 'success'){
                window.location.replace(`./login`)
            }
            else{
                setErrDuplicateuser(res.data.message1)
                setErrDuplicateemail(res.data.message2)
            }
        })
    };

    const showPassword = () => {
        var x = document.getElementById('inputP');
        if (x.type === 'password') {
            x.type = 'text';
        } else {
            x.type = 'password';
        }
    };
    const showPasswordcf = () => {
        var y = document.getElementById('inputPcf');
        if (y.type === 'password') {
            y.type = 'text';
        } else {
            y.type = 'password';
        }
    };

    const clearusername = (e) =>{
        e.preventDefault();
        setErrDuplicateuser('')
    };


    const clearemail= (e) =>{
        e.preventDefault();
        setErrDuplicateemail('')
    };

    return (
        <Segment basic>
            <Container text>
                <Header icon textAlign='center' size='huge'>
                    <Icon name='address card' />
                    <div style={{ margin: '0px', fontSize: '36px', fontFamily: 'Prompt' }}>สมัครสมาชิก</div>
                </Header>
                <Form onSubmit={handleSubmit(SubmitForm)}>
                    <div>
                        <div style={{ fontSize: '16px',marginBottom:'10px'}}>ชื่อผู้ใช้งาน</div>
                        <input {...register('username')} placeholder='กรุณาใส่ชื่อผู้ใช้งานอย่างน้อย 4 ตัวอักษร' onChange={clearusername}/>
                        {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
                        <p style={{ color: 'red' }}>{errDuplicateuser}</p>
                    </div>
                    <br></br>
                    <div>
                    <div style={{ fontSize: '16px',marginBottom:'10px'}}>รหัสผ่าน</div>
                        <input type='password' id='inputP' placeholder='กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร' {...register('password')} />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                        <div class='ui checkbox' style={{ marginTop: '8px' }}>
                            <input type='checkbox' name='p1' onClick={showPassword} />
                            <label>แสดงรหัสผ่าน</label>
                        </div>
                    </div>
                    <br></br>
                    <div>
                    <div style={{ fontSize: '16px',marginBottom:'10px'}}>ยืนยันรหัสผ่าน</div>
                        <input type='password' id='inputPcf'placeholder='กรุณาใส่พาสเวิร์ดอย่างน้อย 4-20 ตัวอักษร' {...register('passwordcf')} />
                        {errors.passwordcf && <p style={{ color: 'red' }}>{errors.passwordcf.message}</p>}
                        <div class='ui checkbox' style={{ marginTop: '8px' }}>
                            <input type='checkbox' name='p2' onClick={showPasswordcf} />
                            <label>แสดงยืนยันรหัสผ่าน</label>
                        </div>
                    </div>
                    <br></br>
                    <div>
                    <div style={{ fontSize: '16px',marginBottom:'10px'}}>ชื่อเล่น</div>
                        <input {...register('name')} placeholder='กรุณาชื่อเล่นงานอย่างน้อย 4 ตัวอักษร'/>
                        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                        </div>
                    <br></br>
                    <div>
                    <div style={{ fontSize: '16px',marginBottom:'10px'}}>อีเมล</div>
                        <input {...register('email')} placeholder='useremail@gmail.com' onchange={clearemail}/>
                        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                        <p style={{ color: 'red' }}>{errDuplicateemail}</p>
                    </div>
                    <br></br>
                    <div style={{ textAlign: 'center' }}>
                        <Button color="green" style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>ยืนยัน</Button>
                    </div>
                </Form>
            </Container>
        </Segment>
    )
}

export default Register;