import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Card, Image} from 'semantic-ui-react';


function CardListCourse(props){
    
    const {name,course_id,description,isAdmin} = props;

    const src_image = isAdmin? process.env.PUBLIC_URL + '/img/leaning.png' : process.env.PUBLIC_URL + '/img/introduction.jpg'
        
    return (
        <Container textAlign='left'>
                <Card fluid as= {NavLink} to={`/courses/${course_id}`} >
                    <Image src={src_image} wrapped/>
                    <Card.Content>
                        <Card.Header style={{height:'50px',overflow:'hidden',textOverflow:'ellipsis'}} textAlign='center'>{name}</Card.Header>
                        <Card.Meta style={{height:'100px',overflow:'hidden',textOverflow:'ellipsis'}}>{description}</Card.Meta>
                    </Card.Content>
                </Card> 
        </Container>
    )
}

export default CardListCourse;
