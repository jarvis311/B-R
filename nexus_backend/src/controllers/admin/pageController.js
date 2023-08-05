const db = require('../../models');
const fs = require('fs');
const { responseModel } = require('../../responses');
const Page = db.pages;
const Menu = db.menu;
const PageBanner = db.pages_banner;
           
exports.getAllPages = async (req, res) => {
  try {
    let { limit, page } = req.query

    limit = limit ? parseInt(limit) : null;
    page = page ? parseInt(page) : null;
    let getObject = {
      order: [
        ['id', 'DESC'],
      ],
      include: [
        {
          model: PageBanner,
          attributes: ["name", "id"]
        },
        {
          model: Menu,
          attributes: ["title", "id"]
        },
      ],
    }

    if (limit && page) {
      getObject.limit = limit;
      getObject.offset = limit * (page - 1);
    }

    let response = {};

    const pages = await Page.findAll(getObject);
    const count = await Page.count()

    response = responseModel.successResponse("Success", { pages, total: count })
    return res.status(response.status).send(response.data);

  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.getPage = async (req, res) => {
  try {
    let response = {};
    let page = await Page.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: PageBanner,
          attributes: ["name", "id"]
        },
        {
          model: Menu,
          attributes: ["title", "slug"]
        },
      ],
    });

    if (!page) {
      response = responseModel.failResponse("Page not found", {})
    }
    else {
      response = responseModel.successResponse("Success", page)
    }
    return res.status(response.status).send(response.data);
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.addPage = async (req, res) => {
  try {
    const { menu_id, title, short_description, long_description } = req.body;
    const files = req.files;
    const ifPageExist = await Page.findOne({ where: { menu_id } })

    if (ifPageExist) {
      let response = responseModel.failResponse("Page Already exist", {})
      return res.status(response.status).send(response.data);
    }
    return Page.create({ menu_id, title, short_description, long_description }).then(async resp => {
      if (files) {
        for (let i in files) {
          await PageBanner.create({ name: files[i].filename, page_id: resp.dataValues.id })
        }
      }
      let response = responseModel.successResponse("Success", {})
      res.status(response.status).send(response.data);
    }).catch(err => {
      let response = responseModel.failResponse(err.message, {})
      res.status(response.status).send(response.data);
    });
  }
  catch (err) {
    const response = responseModel.failResponse(err.message, {})
    return res.status(response.status).send(response.data);
  }
}

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_id, title, short_description, long_description } = req.body;
    const files = req.files;
    let updatedData = {
      menu_id: menu_id == 0 ? null : menu_id, title, short_description, long_description
    }
    await Page.update(updatedData, { where: { id } }).then(async () => {
      if (files) {
        for (let i in files) {
          await PageBanner.create({ name: files[i].filename, page_id: id })
        }
      }
      let response = responseModel.successResponse("Page updated successfully", {})
      return res.status(response.status).send(response.data);
    }).catch(err => {
      let response = responseModel.failResponse(err.message, {})
      return res.status(response.status).send(response.data);
    })
  }
  catch (err) {
    const response = responseModel.failResponse("Something went wrong", {})
    return res.status(response.status).send(response.data);
  }
}

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    let page = await Page.findOne({
      where: { id },
    });
    if (!page) {
      let response = responseModel.failResponse("Page not found", {})
      return res.status(response.status).send(response.data);
    } else {
      await Page.update({ is_deleted: 1 }, { where: { id } });
      const isDel = await Page.destroy({
        where: { id }
      });
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Page Deleted Successfully", {})
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

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    let banner = await PageBanner.findOne({
      where: { id },
    });

    if (!banner) {
      let response = responseModel.failResponse("Banner not found", {})
      return res.status(response.status).send(response.data);
    } else {
      fs.unlink(`public/uploads/banners/${banner.dataValues.name}`, (err => {
      }));
      const isDel = await PageBanner.destroy({ where: { id } })
      let response = {};
      if (isDel) {
        response = responseModel.successResponse("Banner Deleted Successfully", {})
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