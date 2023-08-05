const { Op } = require("sequelize");
const db = require("../../models/index");
const { responseModel } = require("../../responses");
const ManageClasses = db.manageClasses;
const Plan = db.plan;

exports.getAllClasses = async (req, res) => {
  try {
    let { limit, page } = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};
    const classesData = await ManageClasses.findAll({
      limit: limit,
      offset: limit * (page - 1),
      include: [
        {
          model: Plan,
        },
      ],
    });
    const count = await ManageClasses.count();
    response = responseModel.successResponse("Success", {
      classesData,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.getManageClasses = async (req, res) => {
  try {
    let response = {};
    let getClasses = await ManageClasses.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Plan,
        },
      ],
    });
    if (!getClasses) {
      response = responseModel.failResponse("Classes not found", {});
    } else {
      response = responseModel.successResponse("Success", getClasses);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addClasses = async (req, res) => {
  try {
    const { eventName, Description, type, isplan, planId } = req.body;

    const ifClassesExist = await ManageClasses.findOne({
      where: { eventName },
    });

    if (ifClassesExist) {
      let response = responseModel.failResponse("Classes is Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let classes = {
      eventName,
      Description,
      type,
      isplan,
      planId,
    };

    let response = {};

    return ManageClasses.create(classes)
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

exports.updateClasses = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, Description, type, isplan, planId } = req.body;

    let classes = await ManageClasses.findOne({
      where: { id },
    });

    if (!classes) {
      let response = responseModel.failResponse("Classes not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        eventName,
        Description,
        type,
        isplan,
        planId,
      };
      await ManageClasses.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Classes updated successfully",
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

exports.deleteClasses = async (req, res) => {
  try {
    const { id } = req.params;
    let classes = await ManageClasses.findOne({
      where: { id },
    });
    if (!classes) {
      let response = responseModel.failResponse("Classes not found", {});
      return res.status(response.status).send(response.data);
    } else {
      await ManageClasses.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await ManageClasses.destroy({
        where: { id },
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse(
          "Classes Deleted Successfully",
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

// Consider fields Event name, description, type(Special,Regular), Is plan mandatory(Yes/No), Plan name or id
