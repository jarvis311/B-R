const db = require("../../models/index");
const { responseModel } = require("../../responses");
const Settings = db.system_settings;
const EmailSettings = db.email_settings;
const SocialLinks = db.social_links;
const fs = require("fs");
const { Op } = require("sequelize");

exports.getAllSettings = async (req, res) => {
  try {
    let response = {};

    const settings = await Settings.findAll({ where: { type: "general" } });
    const socialSettings = await Settings.findAll({
      where: { type: "social" },
    });
    const count = await Settings.count();

    response = responseModel.successResponse("Success", {
      settings,
      socialSettings,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.getSetting = async (req, res) => {
  try {
    let response = {};
    let setting = await Settings.findOne({
      where: { id: req.params.id },
    });

    if (!setting) {
      response = responseModel.failResponse("Setting not found", {});
    } else {
      response = responseModel.successResponse("Success", setting);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.addSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    const ifSettingExist = await Settings.findOne({ where: { key } });

    if (ifSettingExist) {
      let response = responseModel.failResponse("Setting Already exist", {});
      return res.status(response.status).send(response.data);
    }

    let setting = {
      key,
      value,
    };

    let response = {};

    return Settings.create(setting)
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

exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;
    let setting = await Settings.findOne({
      where: { id },
    });

    if (!setting) {
      let response = responseModel.failResponse("Setting not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        key,
        value,
      };
      await Settings.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Setting updated successfully",
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

exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    let setting = await Settings.findOne({
      where: { id },
    });
    if (!setting) {
      let response = responseModel.failResponse("Setting not found", {});
      return res.status(response.status).send(response.data);
    } else {
      await Settings.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Settings.destroy({
        where: { id },
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse(
          "Settings Deleted Successfully",
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

exports.getEmailSettings = async (req, res) => {
  try {
    let { limit, page } = req.query;

    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;

    let response = {};

    const settings = await EmailSettings.findAll({
      limit: limit,
      offset: limit * (page - 1),
    });
    const count = await EmailSettings.count();

    response = responseModel.successResponse("Success", {
      settings,
      total: count,
    });
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};
exports.updateEmailSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;
    let setting = await EmailSettings.findOne({
      where: { id },
    });

    if (!setting) {
      let response = responseModel.failResponse("Setting not found", {});
      return res.status(response.status).send(response.data);
    } else {
      let updatedData = {
        value,
      };
      await EmailSettings.update(updatedData, { where: { id } })
        .then(() => {
          let response = responseModel.successResponse(
            "Setting updated successfully",
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

exports.getEmailSetting = async (req, res) => {
  try {
    let response = {};
    let setting = await EmailSettings.findOne({
      where: { id: req.params.id },
    });

    if (!setting) {
      response = responseModel.failResponse("Setting not found", {});
    } else {
      response = responseModel.successResponse("Success", setting);
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

// exports.getSocialLinks = async (req, res) => {
//   try {
//     let setting = await SocialLinks.findAll({
//       order: [["id", "DESC"]],
//     });
//     let response = responseModel.successResponse("Success", setting);

//     return res.status(response.status).send(response.data);
//   } catch (err) {
//     const response = responseModel.failResponse(err.message, {});
//     return res.status(response.status).send(response.data);
//   }
// };

exports.getSocialMediaLink = async (req, res) => {
  try {
    let socialLink = await Settings.findAll({
      where: {
        key: {
          [Op.in]: ["fb_link", "insta_link", "twitter_link", "youtube_link"],
        },
      },
    });
    const withoutNull = socialLink.filter(item => item.value !== null)
    let response = responseModel.successResponse("Success", withoutNull);
    return res.status(response.status).send(response.data);
  } catch (error) {
    const response = responseModel.failResponse(error.message, {});
    return res.status(response.status).send(response.data);
  }
};
exports.createSocialLinks = async (req, res) => {
  try {
    const { url, status } = req.body;

    let setting = {
      url,
      status,
    };
    let response = {};
    if (req.file) {
      setting.icon = req.file.filename;
    }
    return SocialLinks.create(setting)
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

exports.updateSocialLinks = async (req, res) => {
  try {
    const { fb_link, insta_link, twitter_link, youtube_link } = req.body;
    await Settings.update({ value: fb_link }, { where: { key: "fb_link" } });
    await Settings.update(
      { value: insta_link },
      { where: { key: "insta_link" } }
    );
    await Settings.update(
      { value: twitter_link },
      { where: { key: "twitter_link" } }
    );
    await Settings.update(
      { value: youtube_link },
      { where: { key: "youtube_link" } }
    );

    let response = responseModel.successResponse(
      "Setting updated successfully",
      {}
    );
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse(err.message, {});
    return res.status(response.status).send(response.data);
  }
};

exports.deleteSocialLinks = async (req, res) => {
  try {
    let response = {};
    const { id } = req.params;
    const setting = await SocialLinks.findOne({
      where: { id: id },
    });

    if (!setting) {
      response = responseModel.failResponse("Setting not found", {});
    } else {
      if (setting.icon) {
        fs.unlink(
          `public/uploads/icons/${setting.dataValues.icon}`,
          (err) => {}
        );
      }
      const isDel = await SocialLinks.destroy({
        where: { id },
      });
      if (isDel) {
        response = responseModel.successResponse(
          "Settings Deleted Successfully",
          {}
        );
      } else {
        response = responseModel.failResponse("Something went wrong", {});
      }
    }
    return res.status(response.status).send(response.data);
  } catch (err) {
    const response = responseModel.failResponse("Something went wrong", {});
    return res.status(response.status).send(response.data);
  }
};
