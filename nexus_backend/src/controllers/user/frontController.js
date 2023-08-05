const { responseModel } = require('../../responses');
const db = require('../../models');
const Contacts = db.contacts;
const NewsLetter = db.news_letters;

exports.addContacts = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, message } = req.body;

    let data = {
      first_name, last_name, email, phone, message
    }

    let response = {};

    return Contacts.create(data).then(async resp => {
      response = responseModel.successResponse("Success", resp)
      res.status(response.status).send(response.data);
    }).catch(err => {
      response = responseModel.failResponse(err.message, {})
      res.status(response.status).send(response.data);
    })
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.addNewsLetter = async (req, res) => {
  try {
    const { name, email } = req.body;
    const ifExist = await NewsLetter.findOne({ where: { email } })

    if (ifExist) {
      let response = responseModel.failResponse("User Already exist", {})
      return res.status(response.status).send(response.data);
    }

    let response = {};
    
    return NewsLetter.create({ name, email }).then(async resp => {
      response = responseModel.successResponse("Success", resp)
      res.status(response.status).send(response.data);
    }).catch(err => {
      response = responseModel.failResponse(err.message, {})
      res.status(response.status).send(response.data);
    })
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}