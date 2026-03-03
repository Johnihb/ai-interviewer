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

      //server error
      1 : "Internal Server Error",
      2 : "Error in loging out",
      3 : "Error in loging in",

      // successfull
      200 : "User created successfully",
      201 : "User logged in successfully",
      202 : "User logged out successfully",
      203 : "User fetched successfully",
      251 : "Question fetched successfully",
      252 : "Answer checked successfully",


      //error
      300 : "User already exists",
      301 :"Error in creating user" ,
      302 : "Invalid user credentials",
      303 : "Unauthorized user" ,
      304 : "User not found",

      400:'Please finish the interview session before generating new questions',

      // 401 : 'Error in fetching question'
      500 : "Error in processing request",
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