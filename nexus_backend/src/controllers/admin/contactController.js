const db = require('../../models');
const { responseModel } = require('../../responses');
const Contacts = db.contacts;

exports.getAllContacts = async (req, res) => {
  try {
    let { limit, page } = req.query
    let getObject = {
      order: [
        ['id', 'DESC'],
      ],
    }

    limit = limit ? parseInt(limit) : null;
    page = page ? parseInt(page) : null;

    if (limit && page) {
      getObject.limit = limit;
      getObject.offset = limit * (page - 1);
    }

    let response = {};

    const contacts = await Contacts.findAll(getObject);
    const count = await Contacts.count()

    response = responseModel.successResponse("Success", { contacts, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}