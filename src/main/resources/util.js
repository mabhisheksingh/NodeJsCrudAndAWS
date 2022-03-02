//HTTP Response code 
class ResponseCode{
    static OK= 200;
    static CREATED = 201;
    static NO_CONTENT = 204;
    static NOT_MODIFIED  = 304;
    static BAD_REQUEST = 400;
    static NOT_FOUND = 404;
    static REQUEST_TIMEOUT = 408;
    static UNSUPPORTED_MEDIA_TYPE = 415;
    static METHOD_FAILURE = 420;
    static LOCKED = 423;
    static TOO_MANY_REQUESTS = 429;
    static NOT_IMPLEMENTED = 501;
    static BAD_GATEWAY = 502;
    static INTERNAL_SERVER_ERROR = 500;
}
export default  ResponseCode;
//