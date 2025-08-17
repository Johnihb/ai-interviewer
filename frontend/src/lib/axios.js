import axios from "axios";

axios.create({
    baseURL : import.meta.mode !== "development" ? "http://localhost:5000/api/v1" : "",
})

export default axios;