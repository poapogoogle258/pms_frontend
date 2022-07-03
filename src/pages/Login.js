import React, { useEffect, useState } from 'react';
import { Button, Form, Segment, Input, Grid, Icon, Image, Header, Label } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import authentication from '../services/authentication';



export default function Login() {

    const dispacth = useDispatch()

    const [checkbox, setCheckbok] = useState(false)
    const [errorLogin, setErrorLogin] = useState(false)
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        authentication.get_status()
            .then((status_loggin) => {
                if (status_loggin.authenticated) {
                    dispacth({ 'type': 'login', 'username': status_loggin.username, 'realname': status_loggin.realname })
                    window.location.replace('/home')
                }
            })
    }, [])

    function login() {
        const data = { 'login': username, 'password': password }
        authentication.login(data)
            .then(res => {
                if (res.status == 'success') {
                    dispacth({ 'type': 'login', 'username': res.username, 'realname': res.realname })
                    window.location.replace('/home')
                }
            })
            .catch(err => setErrorLogin(true))
    }


    return (
        <>
            <Segment basic>
                <Image
                    src={process.env.PUBLIC_URL + '/img/logoPython.png'}
                    size='medium'
                    centered
                    style={{ marginButtom: '0px' }}
                />
                <Header textAlign='center' style={{ margin: '0px', fontSize: '36px', fontFamily: 'Prompt' }}>
                    <Icon name='code' color='blue' />
                    เข้าสู่ระบบ
                </Header>
                <Grid width='equal'>
                    <Grid.Row centered>
                        <Grid.Column width={6}>
                            <Form style={{ marginTop: '20px' }}>
                                <div style={{ fontSize: '16px',marginBottom:'10px'}}>ชื่อผู้ใช้งาน</div>
                                <Form.Field
                                    id='form-input-control-username'
                                    control={Input}
                                    onChange={e => setUserName(e.target.value)}
                                    Icon='name:'
                                />
                                <div style={{ fontSize: '16px',marginBottom:'10px'}}>รหัสผ่าน</div>
                                <Form.Field
                                    id='form-input-control-password'
                                    control={Input}
                                    onChange={e => setPassword(e.target.value)}
                                    type={(checkbox == false) ? 'password' : 'text'}
                                />
                                <Form.Group inline>
                                    <Form.Checkbox onClick={(e, data) => setCheckbok(!checkbox)} style={{ marginTop: '7px' }} />
                                    <div style={{ fontSize: '16px' }}>แสดงรหัสผ่าน</div>
                                </Form.Group>
                                {errorLogin && <p style={{ 'color': 'red' }} >ชื่อผู้ใช้งาน หรือ หรัสผ่านไม่ถูกต้อง</p>}
                                <div style={{ textAlign: 'center' }}>
                                    <Button type='submit' onClick={login} style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>เข้าสู่ระบบ</Button>
                                    <Link to='./register'><Button style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>สมัครสมาชิก</Button></Link>
                                </div>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </>
    )
}