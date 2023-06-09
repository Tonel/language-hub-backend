import axios from "axios"
import { Constants } from "@/constants/Constants"

const api = axios.create()

export default api

export const mediumApi = axios.create({
  baseURL: "https://medium.com",
  headers: {
    Cookie: `sid=${Constants.MEDIUM_COOKIE_SID} uid=${Constants.MEDIUM_COOKIE_UID}`,
  },
})
