const nodemailer = require("nodemailer");
require("dotenv").config();
const db = require('../models');
const Templates = db.email_templates;
const EmailSetting = db.email_settings;

exports.sendMail = async (subject, body, to) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: body,
    });
    return 1;
  }
  catch (err) {
    return 0;
  }
}

exports.sendCustomEmail = async (name, email, replacements = {}) => {
  try {
    let templateData = await Templates.findOne({
      where: { name }
    })

    if (templateData) {
      let headerData = await this.getHeaderFooter();
      let body = headerData.header;
      body += templateData.body.replace(/#([^#]+)#/g, (match, key) => {
        return replacements[key] !== undefined
          ? "" + replacements[key]
          : "";
      });

      body += headerData.footer;

      let send = await this.sendMail(templateData.subject, body, email)
      return send;
    }
    else {
      return 0;
    }
  }
  catch (err) {
    return 0;
  }
}

exports.getHeaderFooter = async () => {
  let setting = await EmailSetting.findAll({
    where: { key: ["header", "footer"] },
    attributes: ["value", "key"]
  })
  let header = setting.find(row => row.key === "header");
  let footer = setting.find(row => row.key === "footer");
  let data = {
    header: header?.value,
    footer: footer?.value
  }
  return data;
}