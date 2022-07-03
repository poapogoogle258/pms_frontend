export default function components( state = {
    slicebarShowCourseStudent : true,
    slicebarShowCourseTeacher : true,
}, action){
  
    switch(action.type){
        case 'switch_slice_teacher':
            state.slicebarShowCourseTeacher = !state.slicebarShowCourseTeacher
        return state

        case 'open_slice_teacher':
            state.slicebarShowCourseTeacher = true
        return state
   
        case 'close_slice_teacher':
            state.slicebarShowCourseTeacher = false
        return state

        case 'switch_slice_student':
            state.slicebarShowCourseStudent = !state.slicebarShowCourseStudent
        return state
    
        case 'open_slice_student':
            state.slicebarShowCourseStudent = true
        return state
    
        case 'close_slice_teacher':
            state.slicebarShowCourseStudent = false
        return state
  
        default:
            return state
    }
  }