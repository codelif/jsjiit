
class APIError extends Error {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }
}

async function __hit(method, url, options = {}) {
    let exception = APIError; // Default exception

    // If an exception is provided in options, use that
    if (options.exception) {
        exception = options.exception;
        delete options.exception;
    }

    let headers;

    // Check if authentication is required
    if (options.authenticated) {
        headers = this.session.getHeaders(); // Assuming session has getHeaders() method
        delete options.authenticated;
    } else {
        let localname = await generateLocalName();
        headers = { "LocalName": localname }; // Assuming generateLocalName is defined elsewhere
    }

    // Merge provided headers with default headers
    if (options.headers) {
        options.headers = { ...options.headers, ...headers };
    } else {
        options.headers = headers;
    }

    try {
        // Make the request using fetch
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...options.headers
            },
            body: JSON.stringify(options.body || {}),
        });

        // Convert the response to JSON
        const resp = await response.json();

        // Check for successful response status
        if (resp.status && resp.status.responseStatus !== "Success") {
            throw new exception(`status:\n${JSON.stringify(resp.status, null, 2)}`);
        }

        return resp;
    } catch (error) {
        // Handle error
        throw new exception(error.message || 'Unknown error');
    }
}
const API = "https://webportal.jiit.ac.in:6011/StudentPortalAPI";


const DEFCAPTCHA = {captcha: "phw5n", hidden: "gmBctEffdSg="};


async function student_login(username, password, captcha = DEFCAPTCHA){
  let pretoken_endpoint  = "/token/pretoken-check";  
  let token_endpoint = "/token/generate-token1";

  let payload = {username: username, usertype: "S", captcha: captcha};
  payload = serializePayload(payload);

  return __hit("POST", API+pretoken_endpoint, {data: payload})
}

