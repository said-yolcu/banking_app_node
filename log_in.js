import * as http from "http"
import * as cookie from "cookie"


function send_request(par_list) {
    let [state_id, password] = par_list

    // Data to be posted
    let post_data = JSON.stringify({
        "state_id": state_id,
        "password": password
    })

    // Create request json
    let options = {
        "method": "POST",
        "hostname": "localhost",
        "port": 8000,
        "path": "/user/log_in",
        "headers": {
            "content-type": "application/json",
            "content-length": Buffer.byteLength(post_data)
        }
    }

    // Make the request in a promise
    return new Promise((resolve, reject) => {
        console.log('% Making a new request')
        var req = http.request(options, res => {

            res.on("data", () => { })

            // console.log('login 47')
            res.on('end', () => {


                // console.log('login 51')
                // Check if the response is successful
                if (res.statusCode === 200) {
                    console.log("% You have logged in successfully")
                    let cookie = res.headers["set-cookie"]
                    // console.log(res.headers)
                    resolve([res.statusCode, cookie])
                } else {
                    console.log("% Returned with status code", res.statusCode)
                    resolve([res.statusCode, null])
                }

                // console.log('login 61')

            })


            // console.log('login 64')

            res.on('error', e => {
                console.log('% Log-in service error')
                reject(e)
            })
        })

        // console.log('login 72')

        // Write the request body
        req.write(post_data)

        // console.log('login 77')
        // End the request
        req.end()

    }).catch(e => console.log('% Catched error ' + e))
}

export default { send_request }