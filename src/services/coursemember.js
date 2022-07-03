import http from "./http-common";

class CourseMember{
    async get_users(course_id){
        const res = await http.get(`/api/plugin/coursemember/${course_id}`)
        return res.data
    }

    async invate(course_id,email){
        const res = await http.post(`/api/plugin/coursemember/${course_id}`,JSON.stringify({'email':email}))
        return res.data
    }
    
    async delete(course_id,username){

        const res = await http.delete(`/api/plugin/coursemember/${course_id}/${username}`)
        return res.data
    }
}

export default new CourseMember();
