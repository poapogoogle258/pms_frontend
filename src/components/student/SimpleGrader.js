import React, { useState } from 'react';
import { Segment, Grid, Button, Form } from 'semantic-ui-react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import submissions from '../../services/submissions'

export default function SimpleGrader(props) {

    const {default_value} = props

    const [courses_id, task_id,problem_id] = ['external','simple_grader','simple_grader'];

    const [submission, setSubmission] = useState()
    const [readCode, writeCode] = useState(default_value)
    const [isRuning, setRuning] = useState(false)


    let ShowResult = <Segment></Segment>;

    if (isRuning) {
        setRuning(true)
        submissions.create_submissions(courses_id, task_id, problem_id, readCode)
            .then(res => {
                do {
                    setTimeout(() => {
                        submissions.get_submissions(courses_id, task_id, res.submissionid)
                            .then(res => setSubmission(res[0]))
                    }, 1000)
                } while (submission && submission.status != 'done');
                setRuning(false)
            })
        setRuning(false)
    }



    if(submission && submission.status == 'done'){
        ShowResult = <Segment inverted color='black' >{submission.feedback.trim()}</Segment>;
    }

    return <>
        <Form onSubmit={Submit}>
            <Segment>
                <Grid style={{ margin: '5px' }}>
                    <Grid.Row >
                        <Grid.Column>
                            <Button color='red' onClick={() => setRuning(true)}>Run</Button>
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
                </Grid>
            </Segment>
            {ShowResult}
        </Form>
    </>

}