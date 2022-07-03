import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container,Header,Divider} from 'semantic-ui-react';

export default function Examples(pros) {
    const { course_id,task_id,examples } = pros;

    const HeaderExamples = examples
    .map((example) => <>
        <Header as={NavLink} to={`/courses/${course_id}/${task_id}/example/${example.id}`} color={(example.succeeded==false)? 'red': (example.status=='late')? 'yellow':'green'}>
            * {example.name}
        </Header>
        <span style={{ 'float':'right','color':'gray'}}> 
            {`คะแนนเต็ม: ${example.score} ส่งสาย: ${example.score_late}`}
        </span>
        <Divider />
        <Header as='h3'>
            คำสั่ง 
            <span style={{ 'float':'right','fontSize':'12px','color':'gray'}} inline>
                <span> 
                    {(example.succeeded==false)? <span style={{'color':'red'}}>(ยังไม่ผ่าน)</span> 
                    :
                    (example.status_work=='notting')? <span style={{'color':'red'}}>(ยังไม่ได่ส่ง)</span> 
                    :
                    (example.status_work=='late')? <span style={{'color':'yellow'}}>(ส่งสาย)</span> 
                    :
                    <span style={{'color':'black'}}>(ส่งแล้ว)</span>}{'  '}
                    {example.deadline!=null? new Date(example.deadline).toLocaleString('th-Th'):'ไม่มีกำหนดส่ง' }
                </span>               
            </span>
        </Header>
            <Container inline>
                {example.statement}
            </Container>
        <Divider />
    </>
    )

    return <Container>
        {HeaderExamples}
    </Container>
}