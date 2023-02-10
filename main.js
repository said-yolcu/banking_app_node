import sign_up from './sign_up.js'
import log_in from './log_in.js'
import my_transactions from './my_transactions.js'

import rl from 'readline-promise'
import make_transaction from './make_transaction.js'
const readline = rl.default
const read_line = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

let globalCookie;

async function serve(service) {
    // Standardize the writing of service
    service = service.toString().replace(/\s+/g, '').toLowerCase()
    want_to_quit(service)

    // Take input from the user
    async function enter_input(question) {
        let input = await read_line.questionAsync(question)
        want_to_quit(input)
        input = input.trim().toLowerCase()
        return input
    }

    // Return success message if successful
    async function success_message(resWord) {
        if (resWord === "success") {
            console.log("Returned with success")
        }
    }

    // Process the response's status code
    function response_processer(phraseArray) {
        return function (statusCode) {
            switch (statusCode) {
                // Status ok
                case 200: {
                    console.log(phraseArray[0])
                } break;

                // Successfully created
                case 201: {
                    console.log(phraseArray[1])
                } break;

                // Unauthorized
                case 401: {
                    console.log(phraseArray[2])
                } break;

                // Record not found
                case 404: {
                    console.log(phraseArray[3])
                } break;

                case 500: {
                    console.log(phraseArray[4])
                } break;
            }
            return
        }
    }

    switch (service) {
        // Sign up
        case "signup": {

            // Enter Name, Surname, State id, Email, Phone, Password, Balance
            let name = await enter_input("Enter your name: ")
            let surname = await enter_input("Enter your surname: ")
            let state_id = await enter_input("Enter your state id: ")
            let email = await enter_input("Enter your email: ")
            let phone = await enter_input("Enter your phone number: ")
            let password = await enter_input("Enter your password: ")
            let balance = await enter_input("Enter your initial balance: ")

            let phraseArray = [
                "Status code: 200", // 200
                // 201
                "You have successfully signed up, now please log in to continue",
                "Status code: 401", // 401
                "Status code: 404", // 404
                // 500
                "Sorry, we are experiencing an internal error, please try again"
            ]

            sign_up
                .send_request([name, surname, state_id, email, phone, password, balance])
                .then(response_processer(phraseArray))
                .then(registration_page)
                .catch(e => console.error("Warning! Error: " + e))
        } break;

        // Log in
        case "login": {
            let state_id = await enter_input("Enter your state id: ")
            let password = await enter_input("Enter your password: ")

            let phraseArray = [
                "You have successfully logged in", // 200
                "Status code: 201", // 201
                "Wrong password", // 401
                "No such user", // 404
                // 500
                "Sorry, we are experiencing an internal error, please try again"
            ]

            // Receive the cookie
            function get_cookie(arg) {
                let [statusCode, cookie] = arg

                if (statusCode === 200) {
                    globalCookie = cookie
                    // console.log("Writing cookie: ", globalCookie, " : Wrote cookie")
                }

                return statusCode
            }

            log_in
                .send_request([state_id, password])
                .then(get_cookie)
                .then(response_processer(phraseArray))
                .then(registration_page)
                .catch(e => console.error("Warning! Error: " + e))

        } break;

        // See my transactions
        case "seemytransactions": {
            let phraseArray = [
                "This is all your transactions", // 200
                "Status code: 201", // 201
                "You should first log in", // 401
                "Status code: 404", // 404
                // 500
                "Sorry, we are experiencing an internal error, please try again"
            ]

            function print_transactions(arg) {
                let [statusCode, body] = arg

                if (statusCode === 200) {
                    console.log(body)
                }

                return statusCode
            }

            my_transactions
                .send_request(globalCookie)
                .then(print_transactions)
                .then(response_processer(phraseArray))
                .then(registration_page)
                .catch(e => console.error("Warning! Error: " + e))

        } break;

        // Make a new transaction
        case "maketransaction": {

            // Enter User id, other user id,  Balance
            let user_id = await enter_input("Enter your user_id: ")
            let other_id = await enter_input("Enter other account's user id: ")
            let balance = await enter_input("Enter the amount you want to transfer: ")

            let phraseArray = [
                "Status code: 200", // 200
                "Successfully made a new transaction", // 201
                "You should first log in", // 401
                "Status code: 404", // 404
                // 500
                "Sorry, we are experiencing an internal error, please try again"
            ]

            function print_transactions(arg) {
                let [statusCode, body] = arg

                if (statusCode === 201) {
                    console.log(body)
                }

                return statusCode
            }

            make_transaction
                .send_request([user_id, other_id, balance],globalCookie)
                //.then(print_transactions)
                .then(response_processer(phraseArray))
                .then(registration_page)
                .catch(e => console.error("Warning! Error: " + e))

        } break;

        default: {
            console.log("You've made an invalid choice")
            registration_page()
        }

    }
}

// Check if user wants to quit
function want_to_quit(word) {
    if (word.toLowerCase().trim() === 'quit') {
        console.log('You chose to quit. Bye bye!')
        read_line.close()
        process.exit()
    }
}

// This function is used to direct to user either to sign-up or log-in
function registration_page() {
    read_line.question('What would you like to do?\n\
Write one of these: log in, sign up, see my transactions, make transaction\n\
If you want to quit, type quit any time ', serve)
}

registration_page()