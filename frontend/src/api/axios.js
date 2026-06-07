import axios from 'axios'

const api = axios.create({
  baseURL: 'https://courtroomai-production.up.railway.app',
})
//Interceptor means:
// Code that automatically runs before or after every request. 

api.interceptors.request.use(
    (config)=>{                 
        const token=localStorage.getItem('token')
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    }
)



export default api

// export means other files can import and use this
// export default means this is the main thing this file exports


// api.interceptors.request.use(
//    (config) => {

//    }
// )   ante:=    before every request run this function ani ardam...

