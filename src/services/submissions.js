import http from "./http-common";

class submissions{

    async get_submissions(course_id,tasks_id=null,problemid=null){
        const res = await http.get(`/api/plugin/submission/${course_id}${tasks_id? `/${tasks_id}`:''}${problemid? `/${problemid}`:''}`)
        return res.data
    }

    async get_historys_submission(course_id,tasks_id=null,problemid=null){
        const res = await http.get(`/api/plugin/history_submission/${course_id}${tasks_id? `/${tasks_id}`:''}${problemid? `/${problemid}`:''}`)
        return res.data
    }

    async get_submissions_id(course_id,tasks_id,submission_id){
        const res = await http.get(`/api/v0/courses/${course_id}/tasks/${tasks_id}/submissions/${submission_id}`)
        return res.data[0]
    }

    async create_submissions(course_id,tasks_id,problem_id,data){
        const json_data = JSON.stringify({'student_code' : data})
        const res = await http.post(`/api/plugin/submission/${course_id}/${tasks_id}/${problem_id}`,json_data)
        return res.data
    }
}

export default new submissions();

