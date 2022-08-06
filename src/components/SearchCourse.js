
import React, { useState } from 'react'
import { Search, Label, Grid, Button, Container } from 'semantic-ui-react'


const initialState = {
    loading: false,
    results: [],
    value: '',
}

function exampleReducer(state, action) {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialState
        case 'START_SEARCH':
            return { ...state, loading: true, value: action.query }
        case 'FINISH_SEARCH':
            return { ...state, loading: false, results: action.results }
        case 'UPDATE_SELECTION':
            return { ...state, value: action.selection }

        default:
            throw new Error()
    }
}



export default function SearchCourse() {

    const [state, dispatch] = React.useReducer(exampleReducer, initialState)
    const { loading, results, value } = state
    const resultRenderer = ({title,teacher}) => <Grid>
        <Grid.Row>
            <Grid.Column width='13'>
                {title}
            </Grid.Column>
            <Grid.Column width='3' textAlign ='center'>
                <Label content={`teacher : ${teacher}`}/>
            </Grid.Column>
        </Grid.Row>
    </Grid>

    const timeoutRef = React.useRef()
    const [searchFrom,getSearchFrom] = useState('allcourse')
    
    const handleSearchChange = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }
            fetch(`http://10.201.30.27/pms/backend/api/plugin/search/${searchFrom}/${data.value}`,{
                credentials: "include"
            })
            .then(async (res) => {
                res = await res.json()
                dispatch({
                    type: 'FINISH_SEARCH',
                    results: res
                })
            })
        }, 300)
    }, [searchFrom])

    React.useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
    <Grid>
        <Grid.Row>
            <Grid.Column width='16'>
                <Search
                fluid
                input = {{fluid:true,iconPosition:'left'}}
                size='large'
                loading={loading}
                onResultSelect={(e, data) => 
                    window.location.assign(`/joincourse/${data.result.id}`)
                }
                onSearchChange={handleSearchChange}
                resultRenderer = {resultRenderer}
                results={results}
                value={value}
            /> 
            </Grid.Column>  
        </Grid.Row>
        <Grid.Row>
            <Container textAlign>
                <div>
                    <Button active={searchFrom == 'allcourse'}  value='allcourse' onClick={(e, data) => getSearchFrom(data.value)} > ค้นหาจากรายวิชาทั้งหมด</Button>
                    <Button active={searchFrom == 'registed'}  value='registed'  onClick={(e, data) => getSearchFrom(data.value)}> ค้นหาจากรายวิชาที่มีอยู่ </Button>
                </div>
            </Container>
        </Grid.Row>
    </Grid>
        
    )

}



