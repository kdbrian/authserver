# Authentication server

Supports basic authentication functions for now, including:
 - user registration 
 - logging in
 - refreshing an login info
 - delete an account
 - logging out/ terminatting a user session

Requirements for integration

## The API uses Json for communication with clients

- ## Registration
    - username, password. All fields are required
        ```json 
        {
             "username":"john doe",
             "password":"12345678"
        }
        ```
    - response 
        ```json
        
            {
                "success": true,
                "user": {
                    "username": "john doe",
                    "dateJoined": "2024-05-07T23:04:43.338Z",
                    "_id": "663ab3932570d1b7742cceae",
                    "__v": 0
                }
            }
        ```

- ## Logging in 
    - username, password. All fields are required
        ```json 
        {
             "username":"john doe",
             "password":"12345678"
        }
        ```
    - response
        - success
            ```json 
            {
            "success": true,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2FhYWMwOThmMWU1NjZlZDRmNDFkYyIsImlhdCI6MTcxNTEyMjI0NSwiZXhwIjoxNzE1MjA4NjQ1fQ.DCUTs3YI0lnR8rdSs1HVNtHn8-yfICrosCCylhH_yFw",
            "username": "nakamura"
            }
            ```

        - failure
            ```json 
                {
                    "success": false,
                    "message": "Invalid username or password"
                }
             ``` 
- ## RefreshSession
    - User should already have an existing session with the current token used for validation
        - Request ```GET``` /refreshSession

        - Success response
        ```json 
            {
                "success": true,
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2FhYWMwOThmMWU1NjZlZDRmNDFkYyIsImlhdCI6MTcxNTEyMjQ1MywiZXhwIjoxNzE1MjA4ODUzfQ.ZuhSXU6WV4VnEd1xkY8NItTwzQ0eWpOY169494fNJl4"
            }
        ```

        - Failure, cause might be passing an invalid existing token

        ```json
            {
                "status": 401,
                "message": "Please Login with a valid account."
            }
        ```

