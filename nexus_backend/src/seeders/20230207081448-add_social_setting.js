'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const Settings = [
      { key: "fb_link",type:"social" },
      { key: "insta_link" ,type:"social" },
      { key: "twitter_link" ,type:"social" },
      { key: "youtube_link",type:"social"  },
    ];
    await queryInterface.bulkInsert('system_settings', Settings, {});
  },

  async down (queryInterface, Sequelize) {
  }
};
