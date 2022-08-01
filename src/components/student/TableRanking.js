import _ from 'lodash'
import { useState,useEffect } from "react/cjs/react.development"
import { Container, Table } from "semantic-ui-react"

export default function TableRanking(pros){
    const {coursesid,taskid,problemid} = pros
    const [submission,setSubmission] = useState(null)


    useEffect(() => {
        fetch(`http://10.201.30.27/pms/api/api/plugin/ranking/${coursesid}/${taskid}/${problemid}`, {credentials: "include"})
        .then(async (res) => {
            res = await res.json()
            setSubmission(res)
        })
    },[])

    return <Container textAlign='center'>
        <Table>
            <Table.Header sortable textAlign='center' >
                <Table.Row>
                    <Table.HeaderCell width='1' colSpan='4' textAlign='center'>Ranking.</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell width='1'>ลำดับ</Table.HeaderCell>
                    <Table.HeaderCell width='3'>ชื่อ</Table.HeaderCell>
                    <Table.HeaderCell width='2'>ความเร็ว(วินาที)</Table.HeaderCell>
                    <Table.HeaderCell width='2'>หน่วยความจำ(กิบิไบต์)</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {_.size(submission)==0 &&<Table.Row><Table.Cell colSpan='4' textAlign='center'>ยังไม่มีข้อมูล</Table.Cell></Table.Row>}
                {submission!=null &&submission.filter(_item => _item.runtime != null).map((student) => <>
                    <Table.Row>
                        <Table.Cell width='1'>{student.number}</Table.Cell>
                        <Table.Cell width='2'>{student.realname}</Table.Cell>
                        <Table.Cell width='1'>{student.runtime.toFixed(4)}</Table.Cell>
                        <Table.Cell width='1'>{(student.memory/1024).toFixed(2) }</Table.Cell>
                    </Table.Row>
                </>)}
            </Table.Body>
        </Table>
    </Container>

}