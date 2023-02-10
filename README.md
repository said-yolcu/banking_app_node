# banking_app_node

This is the front-end part of my banking app project. The back-end part is implemented with Golang in banking_app repository. You can check it out here: https://github.com/said-yolcu/go_banking_app .

1. Requester files
    Each requester file has a single function: send_request. And each of these send_request files has the same form. 

    Firstly, parameter is dearrayed if it has arrived in arrayed form. Then the json body of the request is formed, if the request needs a body. Then the request options are specified. At last the request is made in a encompassing promise.

    In the promise, request body is written to request if any, then response is received and evaluated depending on the status code. Any error within the promise is catched at the end.

2. main.js
    First, registration_page() function is called. This function prompts the user to choose a service. Then according to the service chosen, a switch block directs the user to the according requester function. In a promise-then-catch block, the response is evaluated and user is prompted to choose another service. 