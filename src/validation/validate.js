import { ResponseError } from "../error/response-error.js";

const validate = (shema, request) => {
    const result = shema.validate(request, {
        abortEarly : false,
        allowUnknown : false // jika ada field yang tidak diketahui gagal /reject
    });

    if (result.error) {
        // throw result.error; //cumment js
        throw new ResponseError(400, result.error.message)
    }else {
        return result.value;
    }
};

export {
    validate
}