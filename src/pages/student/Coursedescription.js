import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Grid, Header, Button, Container, Divider,List,Modal,Icon} from 'semantic-ui-react';

export default function Coursedescription(pros) {
    const {courses_id} = useParams()

    const [detail,setDetail] = useState()
    const [open,setOpen] = useState(false)
    const [finishedLoading ,setfinishedLoading] = useState(false)

    
    const unregister = async () => {
        const raw_data_unregister = await fetch(`http://localhost:8080/api/plugin/coursemember/${courses_id}`,
            {'method' : 'DELETE', 'credentials': "include"}
        )

        const data_unregister = await raw_data_unregister.json()


        if (data_unregister.status ==  'success'){
            window.location.replace(`/home`)

        }  
    }

    useEffect(() => {
        async function get_description() {
            const raw_data_description = await fetch(`http://localhost:8080/api/plugin/registercourse/${courses_id}`,{'credentials': "include"})
            const data_description = await raw_data_description.json() 
            
            setDetail({
                'name':data_description.name,
                'teacher' : data_description.teacher,
                'tasks': data_description.tasks.sort((a, b) => a.localeCompare(b))

            })
            
            setfinishedLoading(true)
        }

        get_description()
    },[])

    return finishedLoading &&<div>
            <Grid style={{margin:'100px'}}>
                <Grid.Row>
                    <Grid.Column width='4'/>
                    <Grid.Column width='8'>                     
                        <Container textAlign='left'><Header>{detail.name}</Header></Container>
                        <Container textAlign='left'>ผู้สอน :{detail.teacher}</Container>
                            <Divider/>
                        <Container textAlign='justified'>
                                คำอธิบายรายวิชา :<br/>
                                {detail.description}<br/>
                            <Container>
                                บท:<br/>
                                <List as='ul'>
                                    {detail.tasks.map((task) => <List.Item  as='li'>{task}</List.Item> )}
                                </List>
                            </Container>
                            <Container textAlign='center' style={{'marginTop':'110px'}}>
                                <Modal
                                    onClose={() => setOpen(false)}
                                    onOpen={() => setOpen(true)}
                                    open={open}
                                    trigger={<Button color='red' style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='remove' />ลบรายวิชานี้ออกจากรายวิชาของคุณ</Button>}

                                >
                                    <Header color='red' style={{ color: 'red', fontSize: '16px',fontFamily: 'Prompt'}} content='ลบรายวิชาออกจากรายวิชาของคุณ!' />
                                    <Modal.Content>
                                        <p>รายวิชานี้ <a style={{ color: 'red', fontSize: '20px', fontWeight: '900' }}>{detail.name}</a> จะถูกลบออกจากรายวิชาที่เรียนอยู่ของคุณ</p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='red' style={{fontFamily: 'Sarabun'}}
                                            onClick={(e, v) => {
                                                unregister()
                                                setOpen(false)
                                            }}>
                                            <Icon name='remove' />ออกจากรายวิชา
                                        </Button>
                                        <Button color='gray' style={{fontFamily: 'Sarabun'}} onClick={() => setOpen(false)}>
                                            ยกเลิก
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Container>
                        </Container>
                    </Grid.Column>
                    <Grid.Column width='4'/>
                </Grid.Row>
            </Grid>
        </div>
}

