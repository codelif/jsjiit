
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
        headers = { "LocalName": generateLocalName() }; // Assuming generateLocalName is defined elsewhere
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
let endpoint  = "/token/pretoken-check"
let payload = "E/36gm1xclGgS/frDjzAM7J53ktoc7uo3Btt1b3hKTMleKWUcg8B6n9Hb+qN7jVM1XCqB8izfQkmgZvm6UKzjPQJmUILm+BGyzf1MNXi6qpWAAesCSd1UYLZwrbVW63a";
console.log(__hit("POST", API+endpoint, {body: payload}));

