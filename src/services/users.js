import http from './http-common'
import convert from './dict_to_datafrom_convert'

class User{

    async get_user(username){
        const res = await http.get(`/api/plugin/user/${username}`)
        return res.data
    }

    async edit_profile(username,content){
        let datafrom = convert(content)
        const res = await http.patch(`/api/plugin/user/${username}`,datafrom)
        return res.data
    }

    async register(username , realname,  email, passwd, passwd2) {
        const datafrom = convert({
            'username': username,
            'realname' : realname,
            'email': email,
            'passwd' : passwd,
            'passwd2' : passwd2
        })

        const res = http.post(`/api/plugin/user`,datafrom)

        return res

    }
    
        
}

export default new User();