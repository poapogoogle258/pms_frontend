import http from "./http-common";
import convert from "./dict_to_datafrom_convert"

class courses{

    async get_all_course(){
        const res = await http.get('/api/plugin/course')
        return res.data
    }
    async get_course(course_id){
        const res = await http.get(`/api/plugin/course/${course_id}`)
        return res.data
    }
    async create_course(content){
        let datafrom = convert(content)
        const res = await http.post(`/api/plugin/course`,datafrom)
        return res.data
    }
    async update_course(course_id,content){
        let datafrom = convert(content)
        const res = await http.patch(`/api/plugin/course/${course_id}`,datafrom)
        return res.data
    }
    async delete_course(course_id){
        const res = await http.delete(`/api/plugin/course/${course_id}`)
        return res.data
    }

}


export default new courses();

