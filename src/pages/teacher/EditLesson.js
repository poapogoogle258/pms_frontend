import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { Input, Container, Form, Grid, Header, Segment, Button, Modal, Icon, Dropdown } from "semantic-ui-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';


import AceEditor from "react-ace";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import tasks from "../../services/tasks";


export default function EditLesson() {
    const { courses_id, task_id } = useParams()

    const [task, setTask] = useState(null)
    const [context, setContext] = useState('')
    const [open, setOpen] = useState(false)

    const signupSchema = yup.object().shape({
        lessonname: yup.string().required('กรุณาใส่ชื่อบทเรียน'),
    })

    const { handleSubmit, formState: { errors }, control,setValue } = useForm({ resolver: yupResolver(signupSchema) });


    const gfm = require('remark-gfm')

    useEffect(async () => {
        tasks.get_tasks(courses_id, task_id)
            .then((res) => {
                setTask(res.tasks[0])
                setContext(res.tasks[0].context)
                setValue('lessonname',res.tasks[0].name)
            })

    }, [])

    const SubmitForm = (data) => {
        const req = {
            'name': data.lessonname,
            'context': context
        }
        tasks.edit_task(courses_id, task_id, req).then((res) => {
            try {
                if (res.status == 'success') {
                    window.location.replace(`/courses/${courses_id}/${task_id}`);
                }
            }
            catch (err) {
                console.log(err)
            }

        })
    }

    return <Container fluid style={{ panding: '12px' }}>
        <div style={{ margin: '5% 5% 5% 5%' }}>
            {task != null && <Form onSubmit={handleSubmit(SubmitForm)}>
            <Form.Group >
                    <Form.Field>
                        <div style={{ fontSize: '16px', marginBottom: '10px' }}>ชื่อบทเรียน</div>
                        <Controller
                            control={control}
                            name='lessonname'
                            render={({ field }) => <Form.Input {...field} placeholder='เช่น 1. โครงสร้างพื้นฐาน' />}
                            rules={{ required: true }}
                        />
                        {errors.lessonname && <p style={{ color: 'red' }}>{errors.lessonname.message}</p>}
                    </Form.Field>
                    <div style={{marginTop:'30px'}}>
                    <Modal
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button type='button' style={{ fontSize: '15px', fontFamily: 'Sarabun' }}>เพิ่มรูปภาพ วิดิโอหรือไฟล์ PDF</Button>}
                    >
                        <Header style={{ fontSize: '20px', fontFamily: 'Prompt' }} content='นำลิงก์ไฟล์หรือลิงก์แชร์ใน Google Drive มาใส่ในช่อง URL (เขียนโดยใช้ iframe)' />
                        <Modal.Content>
                            <Add_ifame context={context} setContext={setContext} setOpen={setOpen} />
                        </Modal.Content>
                    </Modal>
                    <Button color='green' type='submit' style={{ fontSize: '15px', fontFamily: 'Sarabun', }}><Icon name='save' />บันทึกผล</Button>
                    </div>
                </Form.Group>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header textAlign='center' style={{ fontSize: '20px' }}>
                                สร้างบทเรียน
                                <Header.Subheader>
                                    เขียนโดยใช้ Markdown และ Html (สามารถใช้ร่วมกันได้)
                                </Header.Subheader>
                            </Header>
                            <Segment>
                                <AceEditor
                                    mode="Markdown"
                                    theme="github"
                                    width=''
                                    height='900px'
                                    minLines='150'
                                    value={context}
                                    onChange={(value) => setContext(value)}
                                    showPrintMargin={false}
                                    editorProps={{ $blockScrolling: true }}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        fontSize: 16
                                    }}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header textAlign='center' style={{ fontSize: '20px' }}>
                                แสดงผล
                            </Header>
                            <Segment style={{ height: '930px', marginTop: '29px', overflow: 'scroll' }}>
                                <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]} children={context} />
                            </Segment>
                        </Grid.Column>
                        <Button color='green' type='submit' style={{ fontSize: '15px', fontFamily: 'Sarabun', margin: 'auto', marginTop: '20px' }}><Icon name='save' />บันทึกผล</Button>
                    </Grid.Row>
                </Grid>
            </Form>
            }
        </div>
    </Container>
}


function Add_ifame(props) {
    const options = [
        { key: 1, text: 'image', value: 'image' },
        { key: 2, text: 'video', value: 'video' },
        { key: 3, text: 'pdf', value: 'pdf' },
    ]
    const { getValues, setValue, control } = useForm({
        defaultValues: {
            add_url: '',
            add_width: '',
            add_height: '',
            add_type: options[0].value,
        }
    })
    const SubmitForm = () => {
        const data = getValues()
        if (data.add_url != '') {
            data.add_url = data.add_url.split('view', 1)
            data.add_url = data.add_url + 'preview'
            if (data.add_type == 'image' || data.add_type == 'video') {
                if (data.add_width == '') {
                    data.add_width = '100%'
                }
                if (data.add_height == '') {
                    data.add_height = '100%'
                }
            }
            else if (data.add_type == 'pdf') {
                if (data.add_width == '') {
                    data.add_width = '100%'
                }
                if (data.add_height == '') {
                    data.add_height = '930'
                }
            }
        }
        let iframe = `<iframe src="${data.add_url}" width="${data.add_width}" height="${data.add_height}" allow="autoplay"></iframe>`
        props.setContext(props.context + `\n` + iframe)

    }
    return <>
        <Container>
            <Form>
                <Form.Field>
                    <lable style={{ fontSize: '16px' }}>URL</lable>
                    <Controller
                        control={control}
                        name='add_url'
                        render={({ field }) => <Form.Input {...field} placeholder='https://drive.google.com/file/d/1soxyhmcf9q4tAJcqOQCCiWOZsQvKanbo/view?usp=sharing' />}
                    />
                </Form.Field>
                <Form.Field>
                    <lable style={{ fontSize: '16px' }}>ความกว้าง</lable>
                    <Controller
                        control={control}
                        name='add_width'
                        render={({ field }) => <Form.Input {...field} placeholder='ค่าความกว้างเริ่มต้น คือ 100%' />}
                        rules={{ required: true }}
                    />
                </Form.Field>
                <Form.Field>
                    <lable style={{ fontSize: '16px' }}>ความยาว</lable>
                    <Controller
                        control={control}
                        name='add_height'
                        render={({ field }) => <Form.Input {...field} placeholder='ค่าความยาวเริ่มต้น คือ 100%' />}
                        rules={{ required: true }}
                    />
                </Form.Field>
                <Form.Field>
                    <lable style={{ fontSize: '16px' }}>รูปแบบ</lable>
                    <Dropdown options={options} selection onChange={(e, v) => setValue('add_type', v.value)} defaultValue={options[0].value} />
                </Form.Field>
                <Container textAlign='right'>
                    <Button color='green' type='button' icon labelPosition='left' style={{ fontFamily: 'Sarabun' }}
                        onClick={() => {
                            props.setOpen(false);
                            SubmitForm();
                        }}>
                        <Icon name='add' />เพิ่ม
                    </Button>
                    <Button color='gray' onClick={() => props.setOpen(false)} style={{ fontFamily: 'Sarabun' }}>
                        ยกเลิก
                    </Button>
                </Container>
            </Form>
        </Container>
    </>
}

