import sign_up from './sign_up.js'

import rl from 'readline-promise'
const readline = rl.default
const read_line = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

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

    switch (service) {
        case 'signup': {

            // Enter Name, Surname, State id, Email, Phone, Password, Balance
            let name = await enter_input("Enter your name: ")
            let surname = await enter_input("Enter your surname: ")
            let state_id = await enter_input("Enter your state id: ")
            let email = await enter_input("Enter your email: ")
            let phone = await enter_input("Enter your phone number: ")
            let password = await enter_input("Enter your password: ")
            let balance = await enter_input("Enter your initial balance: ")

            sign_up
                .send_request([name, surname, state_id, email, phone, password, balance])
                .then((resWord) => {
                    if (resWord === "success") {
                        console.log("Returned with success")
                    }
                })
                .catch(e => console.error("Warning! Error: " + e))
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
Write one of these: log in, sign up\n\
If you want to quit, type quit any time ', serve)
}

registration_page()