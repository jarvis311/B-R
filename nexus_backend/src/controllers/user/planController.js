const db = require("../../models");
const { responseModel } = require("../../responses");
const Plan = db.plan;

exports.getPlan = async (req, res) => {
  try {
    let response = {};
    let plan = await Plan.findOne({});
    if (!plan) {
      response = responseModel.failResponse("Page not found", {});
    } else {
      response = responseModel.successResponse("Success", plan);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};
