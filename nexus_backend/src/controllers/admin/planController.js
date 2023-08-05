const { Op } = require("sequelize");
const db = require("../../models/index");
const { responseModel } = require("../../responses");
const Plan = db.plan;
const CustomerPurchasedPlan = db.customer_purchased_plan;
const Customer = db.customer;

exports.getAllPlans = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};
    const plan = await Plan.findAll({
      limit: limit,
      offset: limit * (page - 1),
    });

    const count = await Plan.count();

    response = responseModel.successResponse("Success", {
      plan,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};
exports.getPlanOption = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    let response = {};

    const { customerId } = req.body;
    const plan = await Plan.findAll({
      limit: limit,
      offset: limit * (page - 1),
      where: {
        [Op.and]: [
          { credits: { [Op.gt]: 0 } },
          // {"$customer_purchased_plans.customer_id$": customerId },
          // {"$customer_purchased_plans.remaining_credits$": { [Op.ne]: 0 } },
        ],
      },
      include: [
        {
          model: CustomerPurchasedPlan,
          as: "customer_purchased_plans",
          required: false,
          //  where: {
          //     remaining_credits: { [Op.ne]: 0}
          //  },
        },
      ],
    });

    const count = await Plan.count();
    response = responseModel.successResponse("Success", {
      plan,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (error) {}
};

exports.getPlan = async (req, res) => {
  try {
    let response = {};
    let plan = await Plan.findOne({
      where: { id: req.params.id },
    });
    if (!plan) {
      response = responseModel.failResponse("Plan not found", {});
    } else {
      response = responseModel.successResponse("Success", plan);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addPlan = async (req, res) => {
  try {
    const {
      planName,
      planPrice,
      description,
      features,
      offerBy,
      credits,
      startingDate,
      endingDate,
    } = req.body;
    const ifPlanExist = await Plan.findOne({ where: { planName } });

    if (ifPlanExist) {
      let response = responseModel.failResponse("Plan Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let plan = {
      planName,
      planPrice,
      description,
      features,
      offerBy,
      credits,
      startingDate,
      endingDate,
    };
    let response = {};

    return Plan.create(plan)
      .then(async (response) => {
        response = responseModel.successResponse("Success", response);
        res.status(response.status).send(response.data);
      })
      .catch((err) => {
        response = responseModel.failResponse("Something went wrong", {});
        res.status(response.status).send(response.data);
      });
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      planName,
      planPrice,
      description,
      features,
      offerBy,
      credits,
      startingDate,
      endingDate,
    } = req.body;
    let plan = await Plan.findOne({
      where: { id },
    });

    if (!plan) {
      let response = responseModel.failResponse("Plan not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        planName,
        planPrice,
        description,
        features,
        offerBy,
        credits,
        startingDate,
        endingDate,
      };
      await Plan.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Plan updated successfully",
            {}
          );
          return res.status(response.status).send(response.data);
        })
        .catch((err) => {
          let response = responseModel.failResponse(err.message, {});
          return res.status(response.status).send(response.data);
        });
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    let plan = await Plan.findOne({
      where: { id },
    });
    if (!plan) {
      let response = responseModel.failResponse("Plan not found", {});
      return res.status(response.status).send(response.data);
    } else {
      await Plan.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Plan.destroy({
        where: { id },
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse(
          "Plan Deleted Successfully",
          {}
        );
      } else {
        response = responseModel.failResponse("Something went wrong", {});
      }
      return res.status(response.status).send(response.data);
    }
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};


// SELECT * FROM `plans` AS p
// LEFT JOIN customer_purchased_plans AS cpp ON p.id = cpp.plan_id
// WHERE (cpp.remaining_credits <> 0)

