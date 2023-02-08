import * as http from "http"


function send_request(par_list) {
    let [name, surname, state_id, email, phone, password, balance] = par_list

    // POST    http://localhost:8000/user/sign_up

    // {
    //     "name": "Mahmut",
    //     "surname":"Atlı",
    //     "state_id": "12312312312",
    //     "email":"mahmut.atli@gmail.com",
    //     "phone":"05455454544",
    //     "password": "vaveyla2",
    //     "balance":1000
    // }

    // Data to be posted
    let post_data = JSON.stringify({
        "name": name,
        "surname": surname,
        "state_id": state_id,
        "email": email,
        "phone": phone,
        "password": password,
        "balance": parseInt(balance)
    })

    // Create request json
    let options = {
        "method": "POST",
        "hostname": "localhost",
        "port": 8000,
        "path": "/user/sign_up",
        "headers": {
            "content-type": "application/json",
            "content-length": Buffer.byteLength(post_data)
        }
    }

    // Make the request in a promise
    return new Promise((resolve, reject) => {
        console.log('Making a new request')
        var req = http.request(options, res => {

            res.on("data", () => { })

            console.log('signup 47')
            res.on('end', () => {


                console.log('signup 51')
                // Check if the response is successful
                if (res.statusCode === 201) {
                    console.log("User is created successfully")
                    resolve()
                } else {
                    console.log("Returned with status code", res.statusCode)
                    reject()
                }

                console.log('signup 61')
            })

            console.log('signup 64')

            res.on('error', e => {
                console.log('Exchange service error')
                reject(e)
            })
        })

        console.log('signup 72')

        // Write the request body
        req.write(post_data)

        console.log('signup 77')
        // End the request
        req.end()

    }).catch(e => console.log('Catched error ' + e))
}

export default { send_request }