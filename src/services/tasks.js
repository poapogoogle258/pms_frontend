import http from './http-common'
import convert from './dict_to_datafrom_convert'

class tasks{

    async get_tasks(course_id,tasks_id = null){
        const res = await http.get(`/api/plugin/task/${course_id}${tasks_id? `/${tasks_id}`:''}`)
        return res.data
    }
    async create_task(course_id,content){
        let datafrom = convert(content)
        const res = await http.post(`/api/plugin/task/${course_id}`,datafrom)
        return res.data
    }
    async edit_task(course_id,tasks_id,content){
        let datafrom = convert(content)
        const res = await http.patch(`/api/plugin/task/${course_id}/${tasks_id}`,datafrom)
        return res.data
    }
    async delete_task(course_id,tasks_id){
        const res = await http.delete(`/api/plugin/task/${course_id}/${tasks_id}`)
        return res.data
    }

    async get_problem(courseid,taskid,problemid){
        const res = await http.get(`/api/plugin/task/${courseid}/${taskid}/${problemid}`)
        return res.data
    }

}

export default new tasks();
