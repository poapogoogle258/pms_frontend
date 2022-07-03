import http from './http-common'
import convert from './dict_to_datafrom_convert'

class problems{
    async get_problems(course_id,tasks_id,problemid){
        const res = await http.get(`/api/plugin/problem/${course_id}/${tasks_id}${problemid? `/${problemid}`:''}`)
        return res.data
    }

    async create_problems(course_id,tasks_id,content){
        let datafrom = convert(content)
        datafrom = JSON.stringify(content)
        const res = await http.post(`/api/plugin/problem/${course_id}/${tasks_id}`,datafrom)
        return res.data
    }

    async edit_problems(course_id,tasks_id,problemid,content){
        let datafrom = convert(content)
        let datafromjson = JSON.stringify(content)

        const res = await http.patch(`/api/plugin/problem/${course_id}/${tasks_id}/${problemid}`,datafromjson)
        return res.data
    }
    
    async delete(course_id,tasks_id,problemid){
        const res = await http.delete(`/api/plugin/problem/${course_id}/${tasks_id}/${problemid}`)
        return res.data
    }

}

export default new problems();
