import config from "./config";
import axios from 'axios'

const apiURL = config.SERVER_URL
const request = {
    post: async (url: string, data: any, auth?: string) => {
        // data = data || {}
        let headers: any = {
            'Authorization': auth || '',
            'Content-Type': 'application/json'
        }
        if ((data instanceof FormData))
            delete headers['Content-Type']

        try {
            const response = await axios.post(url, data, { headers });
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    get: async (url: string, data: any) => {
        data = data || {}

        const p = new URLSearchParams(window.location.search);
        data.cid = p.get('cid')
        let params = ''
        if (data)
            params = new URLSearchParams(data).toString();
        const response = await fetch(`${apiURL}${url}${params ? '?' + params : ''}`)
        if (response.status > 400) return {}
        return await response.json()
    }
}

export default request