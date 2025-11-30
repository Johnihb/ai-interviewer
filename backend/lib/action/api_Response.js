 const  serverResponse = (code ,subcode ,user)=>{
   const message ={
     200: "OK",
     201: "Created",
     202: "Accepted",
     204: "No Content",
     400: "Bad Request",
     401: "Unauthorized",
     403: "Forbidden",
     404: "Not Found",
     500: "Internal Server Error"
    }

    const subMessage = {
      1 : "Internal Server Error",
      200 : "User created successfully",
      201 : "User logged in successfully",
      202 : "User logged out successfully",
      203 : "Quetion fetched successfully",
      204 : "Answer checked successfully",
      300 : "User already exists",
      301 :"Error in creating user" ,
      302 : "Invalid user credentials",
      303 : "Unauthorized user" ,
      // 401 : 'Error in fetching question'
    }
    
    const defaultResponse =  {
      success:code>=200 && code<300 ,
      message:message[code] || "Unknown Status Code" ,
      status:code,
      description:subMessage[subcode] || subcode,
    }



  return user ? {...defaultResponse , user} : defaultResponse


}


export default  serverResponse