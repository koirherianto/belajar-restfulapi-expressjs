# User API SPEC

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "koir",
    "password" : "123456",
    "name" : "koir herianto" 
}
```

Response Body Success :
```json
{
    "success" : true,
    "data" : {
        "username" : "koir",
        "name" : "koir herianto" 
    }
}
```

Response Body Error :
```json
{
    "success" : false,
    "errors" : "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "koir",
    "password" : "123456"
}
```

Respone Success
```json
{
    "success" : true,
    "token" : "token disini",
    "data" : {
        "name" : "koir herianto",
        "username" : "koir",
    }
}
```

response body failed
```json
{
    "success" : false,
    "errors" : "passowrd salah"
}
```


## Update User API

Endpoint : PATCH /api/users/current

Headers :
- Authorization : token 

Request Body:

```json
{
    "username" : "koir2", //optional
    "name" : "koir herianto 2" //optional
}
```

Response Success Body
```json
{
    "success" : true,
    "data" : {
        "username" : "koir2",
        "name" : "koir herianto 2"
    }
}
```

Response Succes error

```json
{
    "success" : false,
    "errors" : "name max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token 

Request Body
```json
{
    //kosong
}
```

Response Success Body
```json
{
    "success" : true,
    "data" : {
        "username" : "koir2",
        "name" : "koir herianto 2"
    }
}
```

Response Succes error

```json
{
    "success" : false,
    "errors" : "Unauthorize"
}


## Logout User API

Endpoint : DELETE /api/users/logout

Headers :
- Authorization : token 

Request Body
```json
{
    //kosong
}
```

Response Success Body
```json
{
    "success" : true,
}
```

Response Succes error

```json
{
    "success" : false,
    "errors" : "Unathorized"
}

