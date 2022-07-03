import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, List, Icon, Divider } from 'semantic-ui-react';


export default function MenuListExample(props) {
    const { problems, problemid, tasks_id, courses_id, header } = props;
    const Other_list = (pros) => {

        const [color, setColor] = useState('')

        return <List.Item as={NavLink} to={`/courses/${courses_id}/${tasks_id}/example/${pros.id}`}
            onMouseOver={(e) => setColor('silver')}
            onMouseLeave={(e) => setColor('white')}
            style={{ padding: 10, fontSize: 15, color: 'black', backgroundColor: color }}
        >
            <i style={{ padding: 20 }}>{pros.name}</i>

        </List.Item>
    }

    const ListLessons = problems.map((item) => {
        if (item.id == problemid) {
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
                <List.Header style={{ padding: 10,fontSize:'20px',fontFamily: 'Prompt',marginBottom:'15px'}}>
                    <NavLink to={`/courses/${courses_id}/${tasks_id}`} style={{'color' : 'black'}}>{header} </NavLink>
                </List.Header>
                <Divider />
                {ListLessons}
            </List>
        </Container>
    )
}


