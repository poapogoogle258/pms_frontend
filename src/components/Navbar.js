import React, { useState } from 'react'
import { NavLink,Link } from 'react-router-dom'
import { Menu, Container, Icon,Dropdown } from 'semantic-ui-react'
import {useDispatch ,useSelector} from 'react-redux'

import Login from '../pages/Login2'
import SearchCourse from './SearchCourse2'

import authentication from '../services/authentication'

import '../css/font.css'


function NavLink_Navbar(pros) {
  const [color,setColor] = useState('white')

  return <Menu.Item
    as = {NavLink}
    style={{ fontSize:'16px',fontFamily: 'Prompt',color:color,marginRight:'20px'}}
    onMouseEnter={(e) => setColor('#DCDCDC')}
    onMouseLeave={(e) => setColor('white')}
    name = {pros.name}
    to = {pros.to}
  />
}

function Dropdown_Help_Navbar() {
  const [color,setColor] = useState('white') 
  
  return  <Dropdown 
    item 
    text='คู่มือการใช้งาน' 
    style={{ fontSize:'16px',fontFamily: 'Prompt',color:color,marginRight:'20px'}}
    onMouseEnter={(e) => setColor('#DCDCDC')}
    onMouseLeave={(e) => setColor('white')}
  >
    <Dropdown.Menu>
      <Dropdown.Item>
        <a target="_blank" href='https://youtu.be/bpe5aSCQKzk'>
          ผู้เรียน
        </a>
      </Dropdown.Item>
      <Dropdown.Item>
        <a target="_blank" href='https://youtu.be/bpe5aSCQKzk'>
          ผู้สอน
        </a>
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown >
}

function Menu_Item_Home() {
  const [color,setColor] = useState('white') 

  return  <Menu.Item 
    name='home' 
    as={NavLink} 
    to='/home'
    onMouseEnter={(e) => setColor('#DCDCDC')}
    onMouseLeave={(e) => setColor('white')}>
      <Icon name='home' size='large' color='inverted' />
      <div style={{ fontSize:'16px',fontFamily: 'Prompt',color:color,marginRight:'20px'}}>
        หน้าแรก
      </div>
  </Menu.Item>
}




export default function Navbar(){
  let dispacth = useDispatch()

  let [state,setStatus] = useState(false)
  let realname = useSelector(state => state.sessions.realname)

  let seletedCourse = localStorage.getItem('currentCourse') != undefined

  
  const [color1, setColor1] = useState('white')
  const [color2, setColor2] = useState('white')

  const logout = async () => {
    const logout_status = await authentication.logout()
    localStorage.removeItem('currentCourse')
    dispacth({'type' : 'logout'})
  }

  authentication.get_status()
  .then((status_loggin) => { 
    setStatus(status_loggin.authenticated)
    if (!status_loggin.authenticated){
      if(window.location.pathname != '/login' && window.location.pathname != '/register' &&  window.location.pathname != '/'){
        window.location.replace('/')
      }
    }
  })

  const not_login = <>
      <Dropdown
        text='เข้าสู่ระบบ'
        pointing
        item
        simple style={{ color: 'white',fontSize:'16px',fontFamily: 'Prompt',marginRight:'20px',fontSize:'18px'}}>
          <Dropdown.Menu position='right'>
            <Login />
          </Dropdown.Menu>
      </Dropdown>
    </>

  const logined = <>
    <Menu.Item>
        <Link as={NavLink} to='/Profile'
          onMouseOver={() => setColor1('#DCDCDC')}
          onMouseLeave={() => setColor1('white')}
        >
        <div style={{ color: color1,fontSize:'16px',fontFamily: 'Prompt',marginRight:'20px'}}>ยินดีต้อนรับคุณ : {realname}</div>
        </Link>
    </Menu.Item>
    <Menu.Item
        onMouseEnter={(e) => setColor2('#DCDCDC')}
        onMouseLeave={(e) => setColor2('white')}
        onClick={logout}
        >
        <div style={{ color: color2,fontSize:'16px',fontFamily: 'Prompt',marginRight:'20px'}}><Icon name='sign out' size='large' />ออกจากระบบ</div>
    </Menu.Item>
  </>

  return (
    <Container fluid textAlign='center' style={{ margin: '65px' }}>
      <Menu text size='small' fixed='top' style={{ backgroundColor: '#2185d0', padding: '5px' }}>

        <Menu_Item_Home/>

        {seletedCourse &&<NavLink_Navbar
          name='รายวิชา'
          to={`/courses/${localStorage.getItem('currentCourse')}`}
        />}

        {seletedCourse &&<NavLink_Navbar
          name='คะแนน'
          to={`/score/${localStorage.getItem('currentCourse')}`}
        />}

        {seletedCourse &&<NavLink_Navbar
          name='สถิติ'
          to={`/statistics/${localStorage.getItem('currentCourse')}`}
        />}

        <Dropdown_Help_Navbar/>
 
        <Menu.Menu position='right' style={{ textAlign: 'justify' }}>
          {state == true && <div style={{ marginRight: '20px', width: '500px' }}>
            <SearchCourse />
          </div>
          }
          {state ? logined : not_login}
        </Menu.Menu>
      </Menu>
    </Container >
  )
}