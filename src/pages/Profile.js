import {useState, useEffect } from 'react'
import {useSelector} from 'react-redux'
import { Button, Form, Header, Container,Icon } from 'semantic-ui-react';

import users from '../services/users'

function Profile() {
    let username = useSelector(state => state.sessions.currentUser)
    const [profile, setProfile] = useState(null);
    const [realname, setRealname] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        users.get_user(username)
        .then((res) => {
            setProfile(res[0])
            setRealname(res[0].realname)
            setEmail(res[0].email)
        }) 
    }, [])
    
    function submit() {
        const req = {
            'realname': realname,
        }
        users.edit_profile(username, req).then((res) => {
            try {
                if (res.status == 'success') {
                    window.location.replace(`/profile`);
                }
            }
            catch (err) {
                console.log(err)
            }

        })
    }

    return <>
    {profile != null &&<Container textAlign='center' style={{paddingRight:'300px',paddingLeft:'300px'}}>
        <Header style={{ marginTop: '100px', fontSize: '36px', fontFamily: 'Prompt' }}>
            <p>
                โปรไฟล์ของฉัน
            </p>
        </Header>
        <Form onSubmit={submit} style={{marginTop:'50px'}}>
            <Form.Group inline>
                <label style={{ fontSize: '16px',width:'100px'}}>ชื่อเล่น</label>
                <input value={realname} onChange={e => setRealname(e.target.value)} style={{marginLeft:'10px'}}></input>
            </Form.Group>
            <br></br>
            <Form.Group inline>
                <label style={{ fontSize: '16px',width:'100px'}}>อีเมล</label>
                <input value={email} readOnly style={{marginLeft:'10px'}}></input>
            </Form.Group>
            <div style={{textAlign:'center'}}>
                <Button color='green' type='submit' style={{ fontSize: '15px', fontFamily: 'Sarabun',margin: 'auto', marginTop: '20px' }}><Icon name='save' />บันทึกผล</Button>
            </div>   
        </Form>
    </Container>}
</>
}
export default Profile;