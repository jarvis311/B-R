const db = require('../../models');
const { responseModel } = require('../../responses');
const Templates = db.email_templates;
const { mailService } = require('../../services');

exports.getAllTemplates = async (req, res) => {
  try {
    let { limit, page } = req.query

    limit = limit ? parseInt(limit) : null;
    page = page ? parseInt(page) : null;
    let getObject = {}

    if (limit && page) {
      getObject.limit = limit;
      getObject.offset = limit * (page - 1);
    }

    let response = {};

    const templates = await Templates.findAll(getObject);
    const count = await Templates.count()

    response = responseModel.successResponse("Success", { templates, total: count })
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.addTemplate = async (req, res) => {
  try {
    const { name, body, subject } = req.body;
    const ifTemplateExist = await Templates.findOne({ where: { name } })

    if (ifTemplateExist) {
      let response = responseModel.failResponse("Template Already exist", {})
      return res.status(response.status).send(response.data);
    }

    let data = {
      name, body, subject
    }

    let response = {};

    return Templates.create(data).then(async resp => {
      response = responseModel.successResponse("Success", resp)
      res.status(response.status).send(response.data);
    }).catch(err => {
      response = responseModel.failResponse(err.message, {})
      res.status(response.status).send(response.data);
    })
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.testTemplate = async (req, res) => {
  try {
    const {name, email,user}=req.body;
    let replacements={
      name:user,email
    }
    const emailSent = await mailService.sendCustomEmail(name,email,replacements);
    let response={};
    if(emailSent){
      response = responseModel.successResponse("Success", {})
    }
    else{
      response = responseModel.failResponse("Could not send email", {})
    }
    console.log({response})
    return res.status(response.status).send({emailSent});
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, body, subject } = req.body;

    let templateData = await Templates.findOne({
      where: { id },
    });

    if (!templateData) {
      let response = responseModel.failResponse("Template not found", {})
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        name, body, subject
      }
      await Templates.update(updatedData, { where: { id } }).then(() => {
        let response = responseModel.successResponse("Template updated successfully", {})
        return res.status(response.status).send(response.data);
      }).catch(err => {
        let response = responseModel.failResponse(err.message, {})
        return res.status(response.status).send(response.data);
      })
    }
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.getTemplate = async (req, res) => {
  try {
    let response = {};
    let template = await Templates.findOne({
      where: { id: req.params.id },
    });

    if (!template) {
      response = responseModel.failResponse("Template not found", {})
    }
    else {
      response = responseModel.successResponse("Success", template)
    }
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    let template = await Templates.findOne({
      where: { id },
    });
    if (!template) {
      let response = responseModel.failResponse("Template not found", {})
      return res.status(response.status).send(response.data);
    } else {
      const isDel = await Templates.destroy({
        where: { id }
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Template Deleted Successfully", {})
      }
      else {
        response = responseModel.failResponse("Something went wrong", {})
      }
      return res.status(response.status).send(response.data);
    }
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}