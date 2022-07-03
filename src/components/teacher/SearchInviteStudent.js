import _ from 'lodash'
import { Search } from "semantic-ui-react";
import {useEffect,useReducer,useRef,useCallback} from 'react'

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

export default function SearchInviteStudent(pros){
    const source = pros.source

    const [state, dispatch] = useReducer(exampleReducer, initialState)
    const { loading, results, value } = state


    const timeoutRef = useRef()
    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })
        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }
    
            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => re.test(result.email)
    
            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(source, isMatch),
            })
        }, 300)
        }, [])

    useEffect(() => {
        return () => {
          clearTimeout(timeoutRef.current)
        }
      }, [])

      return    <Search
        loading={loading}
        onResultSelect={(e, data) =>    dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })}
        onSearchChange={handleSearchChange}
        results={source}
        value={value}
    />
}