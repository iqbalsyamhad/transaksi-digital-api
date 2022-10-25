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
      'PPOBTypes',
      [
        {
          "key": "data",
          "name": "Paket Data",
          "postpaid": false
        },
        {
          "key": "etoll",
          "name": "E-Tol",
          "postpaid": false
        },
        {
          "key": "game",
          "name": "Voucher Game",
          "postpaid": false
        },
        {
          "key": "pln",
          "name": "PLN",
          "postpaid": null
        },
        {
          "key": "bangladesh",
          "name": "Bangladesh",
          "postpaid": false
        },
        {
          "key": "china",
          "name": "China",
          "postpaid": false
        },
        {
          "key": "malaysia",
          "name": "Malaysia",
          "postpaid": false
        },
        {
          "key": "philipines",
          "name": "Philipines",
          "postpaid": false
        },
        {
          "key": "pulsa",
          "name": "Pulsa",
          "postpaid": false
        },
        {
          "key": "singapore",
          "name": "Singapore",
          "postpaid": false
        },
        {
          "key": "taiwan",
          "name": "Taiwan",
          "postpaid": false
        },
        {
          "key": "thailand",
          "name": "Thailand",
          "postpaid": false
        },
        {
          "key": "vietnam",
          "name": "Vietnam",
          "postpaid": false
        },
        {
          "key": "pdam",
          "name": "PDAM",
          "postpaid": true
        },
        {
          "key": "bpjs",
          "name": "BPJS",
          "postpaid": true
        },
        {
          "key": "internet",
          "name": "Internet",
          "postpaid": true
        },
        {
          "key": "pajak-kendaraan",
          "name": "Pajak Kendaraan",
          "postpaid": true
        },
        {
          "key": "finance",
          "name": "Finance",
          "postpaid": true
        },
        {
          "key": "hp",
          "name": "HP",
          "postpaid": true
        },
        {
          "key": "estate",
          "name": "Estate",
          "postpaid": true
        },
        {
          "key": "emoney",
          "name": "E-Money",
          "postpaid": true
        },
        {
          "key": "kereta",
          "name": "Kereta",
          "postpaid": true
        },
        {
          "key": "tv",
          "name": "TV",
          "postpaid": true
        },
        {
          "key": "airline",
          "name": "Airline",
          "postpaid": true
        },
        {
          "key": "o2o",
          "name": "O2O",
          "postpaid": true
        },
        {
          "key": "pbb",
          "name": "PBB",
          "postpaid": true
        },
        {
          "key": "gas",
          "name": "Gas",
          "postpaid": true
        },
        {
          "key": "pajak-daerah",
          "name": "Pajak Daerah",
          "postpaid": true
        },
        {
          "key": "pasar",
          "name": "Pasar",
          "postpaid": true
        },
        {
          "key": "retribusi",
          "name": "Retribusi",
          "postpaid": true
        },
        {
          "key": "pendidikan",
          "name": "Pendidikan",
          "postpaid": true
        },
        {
          "key": "asuransi",
          "name": "Asuransi",
          "postpaid": true
        }
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
