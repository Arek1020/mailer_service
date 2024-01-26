import config from "./config";

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

        const response = await fetch(`${url}`, {
            method: 'POST',
            body: (data instanceof FormData) ? data : JSON.stringify(data || {}),
            headers: headers
        })
        if (response.status === 403) return window.location.href = '/login'
        else if (response.status > 400) return { err: true, msg: 'UPSS! Coś poszło nie tak. Spróbuj ponownie później lub skontaktuj się z administratorem. Status błędu: ' + response.status }
        try {
            return await response.json()
        } catch (err) {
            return response
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