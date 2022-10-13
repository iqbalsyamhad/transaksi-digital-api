'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert(
      'MobileOperators',
      [
        {
          "id": "axis",
          "name": "Axis"
        },
        {
          "id": "indosat",
          "name": "Indosat"
        },
        {
          "id": "smart",
          "name": "Smartfren"
        },
        {
          "id": "telkomsel",
          "name": "Telkomsel"
        },
        {
          "id": "three",
          "name": "3"
        },
        {
          "id": "xixi_games",
          "name": "Xixi Games"
        },
        {
          "id": "xl",
          "name": "XL"
        },
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
