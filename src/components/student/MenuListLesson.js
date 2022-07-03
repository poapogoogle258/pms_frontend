import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Icon, Divider,Button } from 'semantic-ui-react';


export default function MenuListLesson(props) {
    const { courses, courses_id, tasks_id, header,isAdmin } = props;
    const Other_list = (pros) => {

        const [color, setColor] = useState('')

        return <List.Item as={NavLink} to={`/courses/${courses_id}/${pros.id}`}
            onMouseOver={(e) => setColor('silver')}
            onMouseLeave={(e) => setColor('white')}
            style={{ padding: 10, fontSize: 15, color: 'black', backgroundColor: color }}
        >
            <i style={{ padding: 20 ,fontSize:'16px'}}>{pros.name}</i>

        </List.Item>
    }

    const ListLessons = courses.map((item) => {
        if (item.id == tasks_id) {
            return <List.Item style={{ padding: 10, fontSize: 15, backgroundColor: 'AliceBlue' }}>
                <p>
                    <Icon name='angle right' /><b>{item.name}</b>
                </p>
            </List.Item>
        }
        else {
            return <Other_list name={item.name} id={item.id} />
        }
    })

    return (
        <Container>
            <List >
                <List.Header style={{ padding: 10,fontSize:'20px',fontFamily: 'Prompt',marginBottom:'15px'}}>{header}</List.Header>
                <Container style={{textAlign: 'center' }}>
                            {isAdmin && <Button as={NavLink} to={`/coursemember/${courses_id}`} style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='setting' />จัดการรายวิชา</Button>}
                            {!isAdmin && <Button as={NavLink} to={`/coursedescription/${courses_id}`} style={{fontSize:'15px',fontFamily: 'Sarabun'}}><Icon name='setting' />รายละเอียดรายวิชา</Button>}
                        </Container>
                <Divider />
                {ListLessons}
            </List>
        </Container>
    )
}


