function Response() {
    this.status = 200;
    this.data = {
        message: '',
        status: '',
        data: ''
    };
}
const successResponse = (message, data) => {
    let res = new Response();
    res.data.status = true;
    res.data.message = message;
    res.data.data = data;
    return res;
}

const failResponse = (message, data) => {
    let res = new Response();
    res.data.status = false;
    res.data.message = message;
    res.data.data = data;
    return res;
}

module.exports = {
    successResponse,
    failResponse,
}