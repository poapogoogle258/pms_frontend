import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Grid, Header, Button, Container, Divider,List, Input} from 'semantic-ui-react';

export default function JoinCourses() {
    const {courseid, password} = useParams()

    const [inputpassword,setPassword] = useState(password)
    const [detail,setDetail] = useState(null)
    const [isPasswordWrong,setPasswordWrong] = useState(false)

    const register_course = (password) => fetch(`http://10.201.30.27/pms/backend/api/plugin/registercourse/${courseid}/${password}`,{'method' : 'POST', 'credentials': "include"})
        .then(async (res) => {
            res = await res.json()
            if(res.status == 'success')
                window.location.replace(`/courses/${courseid}`)
            else
                setPasswordWrong(true)

        })
        .catch((err) => console.log(err))

    useEffect(async ()=>{
        if(password != undefined){
            register_course(password)
        }
        fetch(`http://10.201.30.27/pms/backend/api/plugin/registercourse/${courseid}`,{'credentials': "include"})
        .then(async (res) => {
            res = await res.json()
            if(res.registed == true){
                window.location.replace(`/courses/${courseid}`)
            }
            setDetail(res)
            })
            .catch((err) => console.log(err))
        },[])
    
    return <div>
        {(detail != null)?<div>
            <Grid style={{margin:'100px'}}>
                <Grid.Row>
                    <Grid.Column width='4'/>
                    <Grid.Column width='8'>                     
                        <Container textAlign='left'><Header>{detail.name}</Header></Container>
                        <Container textAlign='left'>teacher :{detail.teacher}</Container>
                            <Divider/>
                        <Container textAlign='justified'>
                                description courses :<br/>
                                {detail.description}<br/>
                            <Container>
                                lessons:<br/>
                                <List as='ul'>
                                    {detail.tasks.sort((a, b) => a.localeCompare(b)).map((task) => <List.Item  as='li'>{task}</List.Item> )}
                                </List>
                            </Container>
                        </Container>
                        <Container style={{margin:'50px',pending:'20px'}} textAlign='center'>
                            {isPasswordWrong? <p style={{color:'red'}}>รหัสผ่านผิด</p>:""}
                            <Input label='password' value={inputpassword} onChange={(e,v) => setPassword(v.value)} error={detail.error != undefined}/>
                            <Button onClick={() => register_course(inputpassword)}>JOIN THIS COURSES</Button>
                        </Container>
                    </Grid.Column>
                    <Grid.Column width='4'/>
                </Grid.Row>
            </Grid>
        </div>
        :
        'loading courses ...'

        }
    </div>
}