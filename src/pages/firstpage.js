import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Card, Image, Grid, Button, Icon, Divider } from 'semantic-ui-react';
import '../css/font.css'

export default function Firstpage() {
    // const data =["https://sv1.picz.in.th/images/2021/10/23/uQQigt.png","https://sv1.picz.in.th/images/2021/10/23/uQ5B7Q.png"]
    const data = [
        { descript: '[ผู้สอน] 5.ตรวจสอบความคืบหน้าของผู้เรียน', link: '/picture_firstpage/1_5ดูความคืบหน้า.png' },
        { descript: '[ผู้สอน] 4.เชิญผู้เรียนเข้าร่วมรายวิชาจากอีเมลหรือลิงก์รายวิชา', link: '/picture_firstpage/1_4การเชิญ.png' },
        { descript: '[ผู้สอน] 3.สร้างโจทย์ปัญหาในแต่ละบทเรียน', link: '/picture_firstpage/1_3สร้างโจทย์ปัญหา.png' },
        { descript: '[ผู้สอน] 2.สร้างบทเรียนในรายวิชา', link: '/picture_firstpage/1_2สร้างบทเรียน.png' },
        { descript: '[ผู้สอน] 1.สร้างรายวิชาของคุณ', link: '/picture_firstpage/1_1สร้างรายวิชา.png' },
        { descript: 'เริ่มต้นการเรียนการสอนการเขียนโปรแกรมด้วยตัวคุณเอง โดย 1 บัญชีเป็นได้ทั้งผู้เรียนและผู้สอน', link: '/picture_firstpage/home.png' },
        { descript: '[ผู้เรียน] 1.ใส่รหัสผ่านเพื่อเข้าร่วมรายวิชา', link: '/picture_firstpage/2_1เข้าสู่รายวิชา.png' },
        { descript: '[ผู้เรียน] 2.เข้าดูบทเรียนและโจทย์ปัญหาที่มีอยู่ในรายวิชา', link: '/picture_firstpage/2_2ดูบทเรียนและโจทย์ปัญหา.png' },
        { descript: '[ผู้เรียน] 3.ทำโจทย์ปัญหาโดยการเขียนโปรแกรม', link: '/picture_firstpage/2_3ทำโจทย์ปัญหา.png' },

    ]
    const [index, setIndex] = useState(5)
    const previous_img = () => {
        if (index != 0) {
            setIndex(index - 1)
        }
    }
    const next_img = () => {
        if (index < data.length - 1) {
            setIndex(index + 1)
        }
        console.log(data.length - 1)
    }
    return (<>
        <div style={{ margin: '5%' }} >
            <div style={{ fontSize: '45px', fontWeight: 'bold', fontFamily: 'Prompt', marginTop: '100px', textAlign: 'center' }}>ระบบการจัดการการเขียนโปรแกรม</div>
            <div style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'Prompt', marginTop: '55px', textAlign: 'center' }}>(Programming Management System)</div>
            <Grid >
                <Grid.Row verticalAlign='middle'>
                    <Grid.Column width={2}>
                        <Button active='false' onClick={previous_img} style={{ border: 'none', background: 'none', fontSize: '24px', fontFamily: 'Sarabun' }}><Icon name='angle left' />ผู้สอน</Button>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Card style={{ marginTop: '50px', width: '500%', textAlign: 'center' }}>
                            <Image src={data[index].link} Fluid />
                            <Card.Content style={{ height: '50px', fontSize: '18px', fontFamily: 'Sarabun' }}>
                                {data[index].descript}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button active='false' onClick={next_img} style={{ border: 'none', background: 'none', fontSize: '24px', fontFamily: 'Sarabun' }}>ผู้เรียน<Icon name='angle right' /></Button>
                    </Grid.Column>
                </Grid.Row>

                <Divider />

                <Grid.Row centered>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'Prompt', marginTop: '40px' }}>คุณลักษณะที่สำคัญในระบบ PMS</div>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Card style={{ marginTop: '50px', width: '100%', textAlign: 'center', borderStyle: 'solid' }}>
                            <Image src='/picture_firstpage/Frame 1.png' Fluid />
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Card style={{ marginTop: '50px', width: '100%', textAlign: 'center', borderStyle: 'solid' }}>
                            <Image src='/picture_firstpage/Frame 2.png' Fluid />
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Card style={{ marginTop: '50px', width: '100%', textAlign: 'center', borderStyle: 'solid' }}>
                            <Image src='/picture_firstpage/Frame 3.png' Fluid />
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Card style={{ marginTop: '50px', width: '100%', textAlign: 'center', borderStyle: 'solid' }}>
                            <Image src='/picture_firstpage/Frame 4.png' Fluid />
                        </Card>
                    </Grid.Column>
                </Grid.Row>

                <Divider />

                <Grid.Row style={{ marginTop: '100px' }}>
                    <Grid.Column floated='centered' width={6}>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            ใช้ HTML และ Markdown เพื่อสรรสร้างบทเรียนของคุณ
                        </div>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            โดยสามารถใช้ HTML ร่วมกับ Markdown ได้โดยการขึ้นบรรทัดใหม่
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '30px' }}>
                    <Grid.Column floated='centered' width={13}>
                        <Image src='/picture_firstpage/1_2สร้างบทเรียน.png' Fluid />
                    </Grid.Column>
                </Grid.Row>
                <Divider />

                <Grid.Row style={{ marginTop: '100px' }}>
                    <Grid.Column floated='centered' width={6}>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            การสร้างโจทย์ปัญหาการเขียนโปรแกรมหลากหลายรูปแบบ
                        </div>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            กำหนด <span style={{ color: 'red', fontSize: '22px' }}>Test Case</span> ซึ่งเป็นตัวตรวจสอบคำตอบของผู้เรียนกับผลเฉลยของโจทย์ปัญหา
                        </div>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            กำหนด <span style={{ color: 'red', fontSize: '22px' }}>Keyword</span> สำหรับการใช้ทำโจทย์ปัญหา เพื่อให้ผู้เรียนเขียนโปรแกรมตามวัตถุประสงค์การเรียนรู้ที่ผู้สอนตั้งไว้
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '30px' }}>
                    <Grid.Column floated='centered' width={13}>
                        <Image src='/picture_firstpage/สร้างโจทย์ปัญหา.png' Fluid />
                    </Grid.Column>
                </Grid.Row>
                <Divider />

                <Grid.Row style={{ marginTop: '100px' }}>
                    <Grid.Column floated='centered' width={6}>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            การทำโจทย์ปัญหาโดยการเขียนโค้ด ทดสอบและส่งคำตอบให้ผู้สอน
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '30px' }} verticalAlign='top'>
                    <Grid.Column floated='left' width={10}>
                        <Image src='/picture_firstpage/3_2ส่ง.png' Fluid />
                    </Grid.Column>
                    <Grid.Column floated='right' width={5}>
                        <Image src='/picture_firstpage/3_3_1จัดอันดับ.png' style={{ marginTop: '30px' }} />
                        <div style={{ fontSize: '16px', textAlign: 'center', marginTop: '15px' }}>
                            ระบบนำคุณภาพซอสโค้ดมาจัดอันดับโดยอัตโนมัติ โดยระบบจะคำนวณเฉพาะซอสโค้ดที่ <span style={{ color: 'red', fontSize: '18px' }}>คำตอบถูกต้องตามผลเฉลยเท่านั้น</span>
                        </div>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            ซึ่งจะจัดอันดับคุณภาพซอสโค้ดตามความเร็วที่ใช้ในการรันและหน่วยความจำที่ใช้งาน
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Divider />

                <Grid.Row style={{ marginTop: '100px' }}>
                    <Grid.Column floated='centered' width={6}>
                        <div style={{ fontSize: '16px', textAlign: 'center' }}>
                            สามารถดูความคืบหน้า ดูคะแนนในรายวิชาและสถิติการทำโจทย์ปัญหาในแต่ละบทเรียน
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '30px' }}>
                    <Grid.Column floated='centered' width={13}>
                        <Image src='/picture_firstpage/3_4คะแนน.png' Fluid />
                    </Grid.Column>
                </Grid.Row>
                <Divider />
            </Grid>
        </div>
    </>)
}