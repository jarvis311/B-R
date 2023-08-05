const { responseModel } = require('../../responses');
const db = require('../../models');
const { mailService } = require('../../services');
const NewsLetter = db.news_letters;

exports.getAllNewsLetters = async (req, res) => {
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

    const newsletters = await NewsLetter.findAll(getObject);
    const count = await NewsLetter.count()

    response = responseModel.successResponse("Success", { newsletters, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.sendNewsLetter = async (req, res) => {
  try {
    let { subject, body, users } = req.body;
    let whereClause = {};
    if (users && users.length > 0) {
      whereClause.id = users
    }
    const news_letters = await NewsLetter.findAll({ where: whereClause })

    let headerFooter = await mailService.getHeaderFooter();

    let bodyData = headerFooter.header;
    bodyData += body;
    bodyData += headerFooter.footer;

    for (let i in news_letters) {
      await mailService.sendMail(subject, bodyData, news_letters[i].email)
    }

    let response = responseModel.successResponse("Success", {})
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}