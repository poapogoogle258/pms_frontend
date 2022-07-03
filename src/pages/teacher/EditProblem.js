import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container, Checkbox, Form, TextArea, Button, Segment, Grid, Header, Divider,Icon} from 'semantic-ui-react'
import { useForm, useFieldArray, FormProvider, useFormContext, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';

import DatePicker from "react-datepicker";
import th from 'date-fns/locale/th';

import AceEditor from "react-ace";
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import "react-datepicker/dist/react-datepicker.css";

import Editor_for_creatproblem from '../../components/teacher/editor_for_creatproblem';
import problems from '../../services/problems';


function Testcasefunc(props) {
    const { register, control, getValues,setValue } = useFormContext({})
    const { fields, append, remove, } = useFieldArray({ control, name: "testcase" });


    return <>
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px' }}>Test Case</p>
            {fields.map((item, index) => {
                return (
                    <Form.Group inline widths='equal' key={item.id}>
                        <label style={{ fontSize: '16px' }}>อินพุต</label>
                        <Controller
                            render={({ field }) => <TextArea {...field} value={props.noinput ? "" : getValues(`testcase[${index}].testcasein`)} disabled={props.noinput} />}
                            name={`testcase.${index}.testcasein`}
                            control={control}
                            rules={{ required: !props.noinput }}
                        />

                        <label style={{ marginLeft: '20px', fontSize: '16px' }}>เอาต์พุต</label>
                        <Controller
                            render={({ field }) => <TextArea {...field} />}
                            name={`testcase[${index}].testcaseout`}
                            control={control}
                            rules={{ required: true }}
                        />

                        <table>
                            <tr>
                                <Button color='blue' value={index} style={{ marginLeft: '20px',width:'65px',fontSize:'15px',fontFamily: 'Sarabun'}} type="button" onClick={(e,{value}) => {
                                    //add in eample
                                    if (fields[value].testcaseout.trim() != ''){
                                        
                                        let ValueTestCase =  getValues('example')
                                        
                                        let checkCanDefineInOddForm = false 
                                
                                        for(let index = 0; index < ValueTestCase.length; index++){
                                            if( ValueTestCase[index].exampleout.trim() == "" ){
                                                ValueTestCase[index].examplein = fields[value].testcasein
                                                ValueTestCase[index].exampleout = fields[value].testcaseout
                                                checkCanDefineInOddForm = true
                                                break;
                                            }
                                        }
                                        if(!checkCanDefineInOddForm){
                                            ValueTestCase.push({'examplein':fields[value].testcasein,'exampleout':fields[value].testcaseout})
                                        }
                                        setValue('example',ValueTestCase)
                                    }
                                }}>
                                    เพิ่ม
                                </Button>
                            </tr>
                            <tr>
                                <Button color='red' style={{ marginLeft: '20px',fontSize:'15px',fontFamily: 'Sarabun'}} type="button" onClick={() => {
                                if(fields.length > 2){
                                    remove(index)
                                    }
                                }}>
                                    ลบ
                                </Button>
                            </tr>
                            
                        </table>
                    </Form.Group>

                );
            })}
        </div>
        <section style={{ textAlign: 'right' }}>
            <Button
                type="button"
                onClick={() => {
                    append({ testcasein: "", testcaseout: "" });
                }}
                color='green'
                style={{fontSize:'15px',fontFamily: 'Sarabun'}}
                icon labelPosition='left'
            >
            <Icon name='add' />
                เพิ่ม Test case
            </Button>
        </section>
    </>
}

function Examplefunc(props) {
    const { register, control, getValues, setValue } = useFormContext({});
    const { fields, append, remove } = useFieldArray({ control, name: "example" });

    return <>
        <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '20px' }}>Example Case</p>
            {fields.map((item, index) => {
                return (
                    <Form.Group inline widths='equal' key={item.id}>
                        <label style={{ fontSize: '16px' }}>อินพุต</label>
                        <Controller
                            render={({ field }) => <TextArea {...field} value={props.noinput ? "" : getValues(`example[${index}].examplein`)} disabled={props.noinput} />}
                            name={`example[${index}].examplein`}
                            control={control}
                            rules={{ required: !props.noinput }}
                        />
                        <label style={{ marginLeft: '20px', fontSize: '16px' }}>เอาต์พุต</label>
                        <Controller
                            render={({ field }) => <TextArea {...field} />}
                            name={`example[${index}].exampleout`}
                            control={control}
                            rules={{ required: true }}
                        />
                        <Button color='red' type="button" style={{ marginLeft: '20px',fontSize:'15px',fontFamily: 'Sarabun'}} onClick={() => {
                            if(fields.length > 2){
                                remove(index)
                            }
                            }
                            }>
                            ลบ
                        </Button>
                    </Form.Group>
                );
            })}
        </div>
        <section style={{ textAlign: 'right' }}>
            <Button
                type="button"
                onClick={() => {
                    append({ examplein: "", exampleout: "" });
                    console.log(fields)
                }}
                color='green'
                style={{fontSize:'15px',fontFamily: 'Sarabun'}}
                icon labelPosition='left'
            >
            <Icon name='add' />
                เพิ่ม Example Case
            </Button>
        </section>
    </>

}

export default function EditProblem(pros) {
    const { courses_id, task_id, problemid } = useParams()
    const [context, setContext] = useState('')
    const [fixanswer, setFixanswer] = useState(false)
    const [noinput, setNoinput] = useState(false)
    const [page, setPage] = useState(1)

    const keywords_python = [
        'False', 'elif', 'lambda', 
        'None', 'else', 'nonlocal', 
        'True', 'except', 'not', 
        'and', 'finally','or', 
        'as', 'for', 'pass', 
        'assert', 'from', 'raise', 
        'break', 'global', 'return', 
        'class', 'if', 'try', 
        'continue','import', 'while',
        'def', 'in', 'with', 
        'del','is', 'yield', 
    ]

    useEffect(async () => {
        problems.get_problems(courses_id, task_id, problemid)
            .then(res => {
                methods.setValue('problemname', res.problems[0].name)
                methods.setValue('score', res.problems[0].score)
                methods.setValue('score_late', res.problems[0].score_late)
                methods.setValue('deadline',(res.problems[0].deadline!=null)? new Date(res.problems[0].deadline):null)
                methods.setValue('statement', res.problems[0].statement)
                methods.setValue('accept',(res.problems[0].accept.length != 0)? res.problems[0].accept.join(','):'')
                methods.setValue('notaccept',(res.problems[0].notaccept.length != 0)? res.problems[0].notaccept.join(',') :'')
                setContext(res.problems[0].header)
                setFixanswer(res.problems[0].fixanswer)
                setNoinput(res.problems[0].noinput)

                for (let i = 0; i < res.problems[0].testcase.output.length; i++) {
                    methods.setValue(`testcase[${i}].testcaseout`, res.problems[0].testcase.output[i])
                    methods.setValue(`testcase[${i}].testcasein`, res.problems[0].testcase.input[i])
                }
                for (let i = 0; i < res.problems[0].examplecase.output.length; i++) {
                    methods.setValue(`example[${i}].exampleout`, res.problems[0].examplecase.output[i])
                    methods.setValue(`example[${i}].examplein`, res.problems[0].examplecase.input[i])
                }
            })
    }, [])


    const gfm = require('remark-gfm')

    const signupSchema = yup.object().shape({
        problemname: yup.string().required('กรุณาใส่ชื่อโจทย์ปัญหา'),
        score: yup.number().typeError('กรุณาใส่คะแนน (ตัวเลขเท่านั้น)').min(0, 'กรุณาใส่คะแนนให้ถูกต้อง').required(),
        score_late: yup.number().typeError('กรุณาใส่คะแนน (ตัวเลขเท่านั้น)').min(0, 'กรุณาใส่คะแนนให้ถูกต้อง').required(),
        statement : yup.string().required('กรุณาใส่คำสั่งโจทย์ปัญหา'),
        testcase :yup.mixed().required().test('testcasemoretwo','กรุณาใส่ข้อมูลอย่างน้อย 2 ชุด',
            function (value) {
                const testcastHaveDate =  value.filter((_item) => _item.testcaseout != '')
                return ((noinput && testcastHaveDate.length == 1) || testcastHaveDate.length >= 2)
                
        }),
        example : yup.mixed().required().test('moretwo','กรุณาใส่ข้อมูลอย่างน้อย 2 ชุด',
        function (value) {
            const exampleHaveDate =  value.filter((_item) => _item.exampleout != '')
            return ((noinput && exampleHaveDate.length == 1) || exampleHaveDate.length >= 2)
        }),
        accept : yup.string().notRequired().test('check_keyword1','ไม่มี keywoord นี้',
            function(value) {
                const split_keyword = (value!=null)? value.split(','):[]
                let pass_check = true
                split_keyword.forEach( _text => {
                    if(_text != '' && !keywords_python.includes(_text)){
                        pass_check = false
                        return false
                    }
                })
                if(pass_check){
                    return true
                }          
            }
        ),
        notaccept : yup.string().nullable().notRequired().test('check_keyword2','ไม่มี keywoord นี้',
            function(value) {
                const split_keyword = (value!=null)? value.split(',') : []
                let pass_check = true
                split_keyword.forEach( _text => {
                    if(_text != '' && !keywords_python.includes(_text)){
                        pass_check = false
                        return false
                    }
                })
                if(pass_check){
                    return true
                }              
            }
        )
    })

    let methods = useForm({
        resolver: yupResolver(signupSchema)
    });
    const { errors } = methods.formState

    function Input_keyword_python(pros) {
        const {name} = pros
        const {register ,control} = useFormContext({});

        return <Segment inline>
            <p> 
                {pros.header}
                {errors[name] && <span style={{ color: 'red' }}>{errors[name].message}</span>}
            </p>
            <Controller
                control = {control}
                name = {name}
                render = {({field}) => <Form.Input {...field}  placeholder='if, else, for ...'/>}
            />
        </Segment> 
    }

    const SubmitForm = (data) => {

        const list_testcase = data.testcase.filter(item => item.testcaseout != '')
        const list_eample = data.example.filter(item => item.exampleout != '')


        const req = {
            'name': data.problemname,
            'score': data.score,
            'score_late': data.score_late,
            'deadline': data.deadline,
            'header': context,
            'fixanswer': fixanswer,
            'noinput': noinput,
            'accept' : data.accept!=''? data.accept.split(","):[],
            'notaccept' : data.notaccept!=''? data.notaccept.split(","):[],
            'statement': data.statement,
            'testcase': {
                'input': list_testcase.map((item) => noinput ? "" : item.testcasein),
                'output': list_testcase.map((item) => item.testcaseout)
            },
            'examplecase': {
                'input': list_eample.map((item) => noinput ? "" : item.examplein),
                'output': list_eample.map((item) => item.exampleout)
            }

        }
        problems.edit_problems(courses_id, task_id,problemid, req)
        .then((res) => {
            try {
                if (res.status == 'success') {
                    window.location.replace(`/courses/${courses_id}/${task_id}/example/${problemid}`)
                }
            }
            catch (err) {
                console.log(err)
            }

        })
    }

    // ต้องใช้ usestate error
    const nextpage = (result) => {
        if (result == true) {
            setPage(page + 1)
        }

    }
    const backpage = () => setPage(page - 1)
    const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })


    return <>
        <FormProvider {...methods}>
            <Form onSubmit={methods.handleSubmit(SubmitForm)}>
                {page === 1 && <div style={{ margin: '5% 5% 5% 5%' }}>
                    <Form.Group>

                        <Form.Field>
                            <div style={{fontSize:'16px',marginBottom:'10px'}}>ชื่อโจทย์ปัญหา</div>
                            <Controller
                                control={methods.control}
                                name='problemname'
                                render={({ field }) => <Form.Input {...field} />}
                                rules={{ required: true }}
                            />
                            {errors.problemname && <p style={{ color: 'red' }}>{errors.problemname.message}</p>}
                        </Form.Field>
                        <Form.Field>
                            <div style={{fontSize:'16px',marginBottom:'10px'}}>คะแนน</div>
                            <Controller
                                control={methods.control}
                                name='score'
                                render={({ field }) => <Form.Input {...field} />}
                                rules={{ required: true }}
                            />
                            {errors.score && <p style={{ color: 'red' }}>{errors.score.message}</p>}
                        </Form.Field>
                        <Form.Field>
                        <div style={{fontSize:'16px',marginBottom:'10px'}}>คะแนนเมื่อส่งงานช้า</div>
                            <Controller
                                control={methods.control}
                                name='score_late'
                                render={({ field }) => <Form.Input {...field} />}
                                rules={{ required: true }}
                            />
                            {errors.score_late && <p style={{ color: 'red' }}>{errors.score_late.message}</p>}
                        </Form.Field>

                        <Form.Field>
                            <div style={{fontSize:'16px',marginBottom:'10px'}}>กำหนดส่ง(ถ้าไม่ใส่ คือ ไม่มีกำหนดส่ง)</div>
                            <Controller
                                control={methods.control}
                                name='deadline'
                                render={({ field }) => <Form.Input as={DatePicker} {...field} showTimeSelect locale={th} selected={methods.getValues('deadline')} dateFormat="dd/MM/yyyy hh:mm:ss"/>}
                            />
                        </Form.Field>
                        <Button type="button" color='green' style={{ marginTop: '30px', marginBottom: '30px' }} onClick={
                            async () => {
                                const result = await methods.trigger(['problemname', 'score', 'score_late']);
                                nextpage(result);
                                scrollTop();
                            }}
                        > ถัดไป </Button>
                    </Form.Group>

                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header textAlign='center' style={{fontSize:'20px'}}>
                                    คำอธิบายโจทย์ปัญหา
                                    <Header.Subheader>
                                        เขียนโดยใช้ Markdown และ Html (สามารถใช้ร่วมกันได้)
                                    </Header.Subheader>
                                </Header>
                                <Container style={{ margin: '10px' }}>
                                    <Segment textAlign='left'>
                                        <Segment>
                                            <AceEditor
                                                mode="Markdown"
                                                theme="github"
                                                width=''
                                                height='550px'
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
                                    </Segment>
                                </Container>

                            </Grid.Column>
                            <Grid.Column>
                                <Header textAlign='center' style={{fontSize:'20px'}}>
                                    แสดงผล
                                </Header>
                                <Segment style={{ height: '610px', marginTop: '29px', overflow: 'scroll' }}>
                                    <ReactMarkdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]} children={context} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>}
                {page === 2 && <div style={{ margin: '5% 5% 5% 5%' }}>
                    <Grid>
                        <Grid.Column width={8}>
                            <Header style={{ fontSize: '20px', textAlign: 'center' }}>ทดสอบโจทย์ปัญหา
                            </Header>
                            <section style={{ textAlign: 'left' }}>
                                <Form.Checkbox
                                    as={Checkbox}
                                    onChange={(e, data) => setFixanswer(!fixanswer)}
                                    checked={!fixanswer}
                                    label={`เอาต์พุตต้องเหมือนกับเอาต์พุตของ Tase Case ทุกประการ (ช่องว่างและตัวอักษรพิมพ์เล็ก-ใหญ่จะไม่มีผลในการเปรียบเทียบ)`}
                                />
                            </section>
                            <section style={{ textAlign: 'left' }}>
                                <Form.Checkbox
                                    as={Checkbox}
                                    onChange={(e, data) => setNoinput(!noinput)}
                                    checked={noinput}
                                    label={`โจทย์ปัญหาที่ไม่มีอินพุค`}
                                />
                            </section>
                            <Segment.Group>
                                <Input_keyword_python name ='accept' header='ต้องมี keywords :' />
                                <Input_keyword_python  name='notaccept' header='ห้ามมี keywords :' />
                            </Segment.Group>
                            <div style={{ marginTop: '15px' }}></div>
                            <Editor_for_creatproblem 
                                noinput={noinput} 
                                testcast_f={methods.getValues} 
                                fixanswer={fixanswer} 
                                accept={methods.getValues('accept')} 
                                notaccept={methods.getValues('notaccept')} 
                            />

                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Grid.Row style={{ textAlign: 'center',marginBottom:'15px'}}>
                                <Header style={{ fontSize: '20px' }}>โจทย์ปัญหา</Header>
                                {errors.statement && <p style={{ textAlign:'left',color: 'red' }}>{errors.statement.message}</p>}
                                <Controller
                                    control={methods.control}
                                    name='statement'
                                    render={({ field }) => <TextArea  {...field} />}
                                />
                            </Grid.Row>
                            <Grid.Row>
                                {errors.testcase && <p style={{ color: 'red' }}>{errors.testcase.message}</p>}
                                <Testcasefunc noinput={noinput} />
                            </Grid.Row>
                            <Grid.Row>
                                {errors.example && <p style={{ color: 'red' }}>{errors.example.message}</p>}
                                <Examplefunc noinput={noinput} />
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        <Button style={{ marginRight: '5px', marginTop: '20px' ,fontSize:'15px',fontFamily:'Sarabun'}} onClick={backpage}>ย้อนกลับ</Button>
                        <Button color='green' style={{ marginLeft: '5px', marginTop: '20px',fontSize:'15px',fontFamily:'Sarabun' }} type='submit'><Icon name='save'/>บันทึกผล</Button>
                    </div>
                </div>}
            </Form>
        </FormProvider>
    </>
}