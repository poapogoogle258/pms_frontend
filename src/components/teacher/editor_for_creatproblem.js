import { useState } from 'react';
import { Segment, Grid, Button, Form, Container, Popup } from 'semantic-ui-react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";


export default function Editor_for_creatproblem(props) {

    const {testcast_f,noinput,fixanswer,callbackRuncode} = props

    const [readCode, writeCode] = useState('')
    const [isInput, setInput] = useState('')
    const [error_input,setError_input] = useState(false)
    const [message_testcase,set_message_testcase] = useState('')
    const [error_testcase,set_error_testcase] = useState(false)
    const [isRuning, setRuning] = useState(false)
    const [result, setResult] = useState(null)



    const validate_code_is_not_empty = () => {
        if(readCode.trim() == ''){
            setError_input(true)
            return false
        }
        else{
            setError_input(false)
            return true
        }
    }

    function marge_tastcase(){

        const testcase =  testcast_f('testcase').filter((test) => test.testcaseout != "")
        const examplecase = testcast_f('example').filter((test) => test.exampleout != "")

        const marge = {
            input : testcase.map((item) => noinput? "":item.testcasein).concat(examplecase.map((item) => noinput? "":item.examplein)),
            output : testcase.map((item) => item.testcaseout).concat(examplecase.map((item) => item.exampleout))
        }
    
        return marge
    }

    function runcode_mode() {
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
                setResult(res)
                if(callbackRuncode != undefined){
                    console.log(res.result)
                    if (res.result[0] == "complete"){
                        callbackRuncode({'testcasein':isInput,'testcaseout':res.result[1]})
                    }
                }

                setRuning(false)
            })
        }
    }

    function runtestcase_mode() {
        if( validate_code_is_not_empty() ){
            setRuning(true)

            const accept = (testcast_f('accept')!=undefined)? testcast_f('accept').split(',') : []
            const notaccept = (testcast_f('notaccept')!=undefined)? testcast_f('notaccept').split(',') : []

            fetch(`http://10.201.30.27/api/simple_compiler/python3`, {
                'method': 'POST', 'body': JSON.stringify({
                'student_code': readCode,
                'fixanswer': fixanswer,
                'accept': accept,
                'notaccept': notaccept,
                'testcase': marge_tastcase()
                })
            })
            .then(async (res) => {
                res = await res.json()
                set_message_testcase(res.result[1])
                set_error_testcase(res.result[0]=='failed')
                setRuning(false)
            })
            .catch(err => setRuning(false))
        }
    }


    return <>
        <Form>
            <Segment>
                <Grid style={{ margin: '5px' }}>
                    <Grid.Row textAlign='right' >
                        <Grid.Column>
                            <Container textAlign='left'>
                                {error_input && <p style={{color:'red'}}> กรุณาใส่คำตอบ</p>}
                                {message_testcase!='' && <p style={{color :error_testcase? 'red':'green'}}>{message_testcase} </p>}
                            </Container>
                            <Popup
                                trigger={<Button type='button' disabled={isRuning} onClick={() => runcode_mode()} style={{fontSize:'15px',fontFamily: 'Sarabun'}}>รันโค้ด</Button>}
                                content="กดรัน เพื่อแสดงผลลัพธ์"
                                basic
                            />
                            <Popup
                                trigger={<Button type='button' color='yellow' disabled={isRuning} onClick={() => runtestcase_mode()} style={{fontSize:'15px',fontFamily: 'Sarabun'}}>ทดสอบ</Button>}
                                content='เมื่อกด "ทดสอบ" จะนำเอาผลลัพธ์ของโค้ดไปเปลี่ยนเทียบกับ Test Case ทั้งหมด'
                                basic
                            />
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
                                    minLines={12}
                                    maxLines={15}
                                    width='100%'
                                    value = {isInput}
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
                        <Grid.Column width='8'>
                            เอาต์พุต :
                            <Segment>
                                <AceEditor
                                    mode="python"
                                    theme="github"
                                    readOnly={true}
                                    minLines={12}
                                    maxLines={15}
                                    width='100%'
                                    value={result==null? "":result.result[1]}
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