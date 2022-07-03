import React, { useState } from 'react';
import { Button, Form, Segment, Input, Grid, Icon, Image, Header, Label } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import authentication from '../services/authentication';



function Login() {

    const dispacth = useDispatch()
    let isAuthentication = useSelector(state => state.sessions.isAuthentication)

    // if (isAuthentication == true)
    //     window.location.replace(`/`)

    const [chenkbox, setCheckbok] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false)
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function login() {
        const data = { 'login': username, 'password': password }
        authentication.login(data)
            .then(res => {
                if (res.status == 'success') {
                    dispacth({ 'type': 'login', 'username': res.username, 'realname': res.realname })
                    console.log(res)
                    window.location.replace('/home')
                }
                else {
                    setErrorLogin(true)
                }
            })
            .catch(err => setErrorLogin(true))
    }


    return (
        <>
            <Segment basic>
                <Header textAlign='center' style={{ margin: '0px',fontSize:'16px',fontFamily:'Prompt' }}>
                        <Icon name='user' color='black' />
                        เข้าสู่ระบบ
                </Header>

                <Form style={{ marginTop: '20px' }}>
                    <Form.Field
                        id='form-input-control-username'
                        control={Input}
                        onChange={e => setUserName(e.target.value)}
                        Icon='name:'
                        label='ชื่อผู้ใช้งาน'
                        placeholder='username'

                    />

                    <Form.Field
                        id='form-input-control-password'
                        control={Input}
                        onChange={e => setPassword(e.target.value)}
                        label='รหัสผ่าน'
                        placeholder='password'
                        type={(chenkbox == false) ? 'password' : 'text'}
                    />
                    <Form.Checkbox label='แสดงรหัสผ่าน' onClick={(e, data) => setCheckbok(!chenkbox)} />
                    {errorLogin && <p style={{ 'color': 'red' }} >ชื่อผู้ใช้งาน หรือ หรัสผ่านไม่ถูกต้อง</p>}
                    <div style={{ textAlign: 'center' }}>
                        <Button type='submit' onClick={login} style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>เข้าสู่ระบบ</Button>
                        <Link to='./register'><Button style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>สมัครสมาชิก</Button></Link>
                    </div>
                </Form>
            </Segment>
        </>
    )
}

export default Login;