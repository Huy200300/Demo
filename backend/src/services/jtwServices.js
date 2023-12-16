const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

 const genneralAccesstoken = async (payload) => {
   const access_token = jwt.sign({
    ...payload
   },process.env.ACCESS_TOKEN,{expiresIn: '30s'});

   return access_token;
};

 const genneralRefreshtoken = async (payload) => {
    const refresh_token = jwt.sign({
     ...payload
    },process.env.REFRESH_TOKEN,{expiresIn: '365d'})
 
    return refresh_token;
    
 };

 const refreshTokenJwt = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token,process.env.REFRESH_TOKEN,async function(err,user){
                if(err){
                    resolve({
                        status: "error",
                        message: "The authenticated User"
                    })
                }
                const access_token = await genneralAccesstoken({
                id: user?.id,
                isAdmin: user?.isAdmin})
                resolve({
                    status: "success",
                    message: "refresh token",
                    access_token
                });
            })   
        } catch (error) {
            reject(error);
        }
    })
 };

module.exports = {
    genneralAccesstoken,
    genneralRefreshtoken,
    refreshTokenJwt
}