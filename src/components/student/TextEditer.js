import { useState } from 'react';
import { Segment, Grid, Button, Form, Container ,Popup,Icon} from 'semantic-ui-react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import submissions from '../../services/submissions'

export default function TextEditer(props) {
    const { courses_id, task_id ,problem_id ,testcase ,defaultCode ,fixanswer,accept,notaccept} = props

    const [isRuning, setRuning] = useState(false)
    const [readCode, writeCode] = useState(defaultCode)
    const [isInput, setInput] = useState('')
    const [isOutput,setOutput] = useState('')

    const [result_message, setResultMessage] = useState(null)
    const [error_input,setError_input] = useState(false)


    const validate_code_is_not_empty = () => {
        if(readCode.trim() == ''){
            setError_input(true)
            setResultMessage('กรุณาใส่คำตอบ')
            return false
        }
        else{
            setError_input(false)
            return true
        }
    }

    async function Submit() {
        if ( validate_code_is_not_empty()){
            setRuning(true)
            await submissions.create_submissions(courses_id, task_id,problem_id,readCode)
                .then(async (res_id) => {
                    let res_data;
                    do {
                        res_data = await submissions.get_submissions_id(courses_id, task_id, res_id.submissionid)
                        await new Promise(r => setTimeout(r, 2000)); //every 2 secount
                    } while (res_data.status == 'waiting');
                    const submission = res_data
                    if(submission && (submission.status == 'done')){
                        console.log(submission)
                        setError_input(submission.result != "success")
                        setResultMessage(submission.result == "success"? "your code success":`${submission.result} : ${submission.feedback.trim()}`)
                    }
                    setRuning(false)
                })
                .catch(error => {
                    setOutput('ระบบเกิดปัญหาไม่สามารถตรวจคำตอบได้')
                    setRuning(false)
                })
        }
    }

    async function runcode_mode() {
        if( validate_code_is_not_empty() ){
            setRuning(true)
            fetch(`http://10.201.30.27/api/simple_compiler/python3`, {
                'method': 'POST', 'body': JSON.stringify({
                'student_code': readCode,
                'input': isInput
                })
            })
            .then(async (res) => {
                res = await res.json()
                console.log(res)
                setError_input(res.result[0]!='sucess')
                setOutput(` ${res.result[1]}`)
                setRuning(false)
            })
            .catch(error => {
                setOutput('ระบบเกิดปัญหาไม่สามารถตรวจคำตอบได้')
                setRuning(false)
            })
        }
    }

    async function runtestcase_mode() {
        if( validate_code_is_not_empty() ){
            setRuning(true)
            fetch(`http://10.201.30.27/api/simple_compiler/python3`, {
                'method': 'POST', 'body': JSON.stringify({
                'student_code': readCode,
                'fixanswer': fixanswer,
                'accept': accept,
                'notaccept': notaccept,
                'testcase': testcase
                })
            })
            .then(async (res) => {
                res = await res.json()
                console.log(res)
                setError_input(res.result[0]!='sucess')
                setResultMessage(`${res.result[0]} : ${res.result[1]}`)
                setRuning(false)
            })
            .catch(error => {
                setOutput('ระบบเกิดปัญหาไม่สามารถตรวจคำตอบได้')
                setRuning(false)
            })
        }
    }
    
    return <>
        <Form>
            <Segment>
                <Grid style={{ margin: '5px' }}>
                    <Grid.Row textAlign='right' >
                        <Grid.Column>
                        <Container textAlign='left'>
                            {result_message!='' && <p style={{color :error_input? 'red':'green'}}>{result_message}</p>}
                        </Container>
                        <Popup
                                trigger={<Button disabled={isRuning} onClick={() => runcode_mode()}style={{fontSize:'15px',fontFamily: 'Sarabun'}}>รันโค้ด</Button>}
                                content="กดรัน เพื่อแสดงผลลัพธ์"
                                basic
                            />
                            <Popup
                                trigger={<Button color='yellow' disabled={isRuning} onClick={() => runtestcase_mode()}style={{fontSize:'15px',fontFamily: 'Sarabun'}}>ทดสอบ</Button>}
                                content='เมื่อกด "ทดสอบ" จะนำเอาผลลัพธ์ของโค้ดไปเปลี่ยนเทียบกับ Test Case ทั้งหมด'
                                basic
                            />
                           <Button color='green' disabled={isRuning} onClick={() => Submit()} style={{fontSize:'15px',fontFamily: 'Sarabun'}}>ส่งคำตอบ</Button>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <AceEditor
                            mode="python"
                            theme="github"
                            width='970px'
                            value={readCode}
                            onChange={(code) => writeCode(code)}
                            name="UNIQUE_ID_OF_DIV"
                            showPrintMargin={false}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                fontSize: 15
                            }}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width='8'>
                            อินพุต :
                            <Segment>
                                <AceEditor
                                    mode="python"
                                    theme="github"
                                    value={isInput}
                                    minLines = {12}
                                    maxLines = {15}
                                    width = '100%'
                                    onChange={(code) => setInput(code)}
                                    name="UNIQUE_ID_OF_DIV"
                                    showPrintMargin={false}
                                    editorProps={{ $blockScrolling: true }}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        fontSize: 15
                                    }}
                                />
                            </Segment>
                        </Grid.Column>
                        {/* <Grid.Column width='2'/> */}
                        <Grid.Column width='8'>
                            เอาต์พุต :
                            <Segment>
                                <AceEditor
                                mode="python"
                                theme="github"
                                readOnly = {true}
                                minLines = {12}
                                maxLines = {15}
                                width = '100%'
                                value = {isOutput}
                                name="UNIQUE_ID_OF_DIV"
                                showPrintMargin={false}
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    fontSize: 15
                                }}
                                />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </Form>
    </>

}