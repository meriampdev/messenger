import axios from "axios"

const skettt_api = process.env.REACT_APP_SKETTT_API
const post = async (apiroute, payload) => {
  let headers = {
    "Content-Type": "application/json",
  }
  if (typeof localStorage !== 'undefined') {
    let loginData = localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null 
    if(loginData) {
      headers = { ...headers, 
        "Authorization": `Bearer ${loginData?.AccessToken}`
      }
    }
  }
  
  const request = axios.request({
    method: "POST",
    baseURL: `${skettt_api}${apiroute}`,
    headers: headers,
    data: payload,
  });

  return request
}

const get = async (apiroute, accessToken) => {
  try {
    let headers = {
      "Content-Type": "application/json",
    }
    if(accessToken) {
      headers = { ...headers, 
        "Authorization": `Bearer ${accessToken}`
      }
    } else if (typeof localStorage !== 'undefined') {
      let loginData = localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null 
      if(!!loginData) {
        headers = { ...headers, 
          "Authorization": `Bearer ${loginData?.AccessToken}`
        }
      }
    } 
    
    const response = await axios.request({
      method: "GET",
      baseURL: `${skettt_api}${apiroute}`,
      headers: headers
    });

    return response
  } catch (error) {
    return error
  }
}

const methods = {
  post,
  get
}

export default methods