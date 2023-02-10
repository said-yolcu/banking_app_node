import * as http from "http"


function send_request(cookie) {

    // console.log("Cookie is :", cookie, " : Cookie ends")

    // Create request json
    let options = {
        "method": "GET",
        "hostname": "localhost",
        "port": 8000,
        "path": "/user/my_transactions",
        "headers": {
            "content-type": "application/json",
            "cookie": cookie,
            "connection": "keep-alive"
        }

    }

    // Make the request in a promise
    return new Promise((resolve, reject) => {
        console.log('% Making a new request')
        var req = http.request(options, res => {

            let chunks = []

            res.on("data", (chunk) => {
                chunks.push(chunk)
            })

            // console.log('@ my transactions 47')

            res.on('end', () => {
                // console.log('@ my transactions 51')

                // Concatenate the chunks array into an object
                let body = Buffer.concat(chunks)
                body = JSON.parse(body)

                // Check if the response is successful
                if (res.statusCode === 200) {
                    console.log("% Transactions are retrieved successfully")
                    resolve([res.statusCode, body])
                } else {
                    console.log("% Returned with status code", res.statusCode)
                    resolve([res.statusCode, null])
                }

                // console.log('@ my transactions 61')
            })

            // console.log('@ my transactions 64')

            res.on('error', e => {
                console.log('% My transactions service error')
                reject(e)
            })
        })

        // console.log('@ my transactions 72')

        // console.log('@ my transactions 77')
        // End the request
        req.end()

    }).catch(e => console.log('% Catched error ' + e))
}

export default { send_request }