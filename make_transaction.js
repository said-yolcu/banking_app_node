import * as http from "http"


function send_request(par_list, cookie) {
    let [user_id, other_id, amount] = par_list

    // console.log("Cookie is :", cookie, " : Cookie ends")

    // Data to be posted
    let post_data = JSON.stringify({

        "user_id": user_id,
        "other_id": other_id,
        "amount": parseInt(amount)

    })

    // Create request json
    let options = {
        "method": "POST",
        "hostname": "localhost",
        "port": 8000,
        "path": "/user/new_transaction",
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

            // There is no return value we wait for, thus we do not take in chunks
            // and concatenate them. We do nothing on res.on('data') listener
            res.on("data", () => { })

            // console.log('@ make transaction 47')

            res.on('end', () => {
                // console.log('@ make transaction 51')

                // Check if the response is successful
                if (res.statusCode === 200) {
                    console.log("% Transaction is made successfully")
                    resolve(res.statusCode)
                } else {
                    console.log("% Returned with status code", res.statusCode)
                    resolve(res.statusCode)
                }

                // console.log('@ make transaction 61')
            })

            // console.log('@ make transaction 64')

            res.on('error', e => {
                console.log('% Make transaction service error')
                reject(e)
            })
        })

        // console.log('@ make transaction 72')
        // Write the post data
        req.write(post_data)

        // console.log('@ make transaction 77')
        // End the request
        req.end()

    }).catch(e => console.log('% Catched error ' + e))
}

export default { send_request }