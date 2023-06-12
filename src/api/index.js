// import instance from "axios";
import axios from 'axios'

let baseURL = "";
if (process.env.NODE_ENV === "development") {
    baseURL = process.env.VUE_APP_API_DEV;
} else {
    baseURL = process.env.VUE_APP_API_PRO;
}

export const searchPoi=params=>{
    return axios({
        url:`${baseURL}/v3/place/text?keywords=`+params.keywords+'&offset='+params.offset+'&page='+params.page+'&key='+params.key,
        method:'get'
    });
}
