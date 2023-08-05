const db = require('../../models');
const { responseModel } = require('../../responses');
const Menu = db.menu;
const Page = db.pages;
const PageBanner = db.pages_banner;

exports.getPage = async (req, res) => {
  try {
    let response = {};
    let page = await Page.findOne({
      include: [
        {
          model: Menu,
          where: { slug: req.params.slug },
          attributes: ["slug", "title"],
          required:true
        },
        {
          model: PageBanner,
          attributes: ["name", "id"]
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