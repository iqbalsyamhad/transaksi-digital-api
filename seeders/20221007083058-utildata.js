'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const storeOrderPrcntFee = await queryInterface.rawSelect('Utils', {
      where: {
        key: 'storeOrderPrcntFee',
      },
    }, ['key']);

    if (!storeOrderPrcntFee) {
      return queryInterface.bulkInsert(
        'Utils',
        [
          {
            "key": "storeOrderPrcntFee",
            "value": "10",
            "createdAt": new Date(),
            "updatedAt": new Date(),
          },
        ]
      )
    }

    const nftBuybackPrcntFee = await queryInterface.rawSelect('Utils', {
      where: {
        key: 'nftBuybackPrcntFee',
      },
    }, ['key']);

    if (!nftBuybackPrcntFee) {
      return queryInterface.bulkInsert(
        'Utils',
        [
          {
            "key": "nftBuybackPrcntFee",
            "value": "20",
            "createdAt": new Date(),
            "updatedAt": new Date(),
          },
        ]
      )
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
