import http from "./http-common";
import convert from './dict_to_datafrom_convert'


class authentication{

    async login(data) {
        let formData  = convert(data);
        const res = await http.post('/api/v0/authentication',formData)
        return res.data
    }

    async logout(){
        const res = await http.delete('/api/plugin/authentication')
        console.log(res.data)
    }

    async get_status(){
        const res = await http.get('/api/v0/authentication')
        return res.data
    }
}

export default new authentication();


