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
      'PpobTypes',
      [
        {
          "id": "data",
          "name": "Paket Data",
          "postpaid": false
        },
        {
          "id": "etoll",
          "name": "E-Tol",
          "postpaid": false
        },
        {
          "id": "game",
          "name": "Voucher Game",
          "postpaid": false
        },
        {
          "id": "pln",
          "name": "PLN",
          "postpaid": false
        },
        {
          "id": "bangladesh",
          "name": "Bangladesh",
          "postpaid": false
        },
        {
          "id": "china",
          "name": "China",
          "postpaid": false
        },
        {
          "id": "malaysia",
          "name": "Malaysia",
          "postpaid": false
        },
        {
          "id": "philipines",
          "name": "Philipines",
          "postpaid": false
        },
        {
          "id": "pulsa",
          "name": "Pulsa",
          "postpaid": false
        },
        {
          "id": "singapore",
          "name": "Singapore",
          "postpaid": false
        },
        {
          "id": "taiwan",
          "name": "Taiwan",
          "postpaid": false
        },
        {
          "id": "thailand",
          "name": "Thailand",
          "postpaid": false
        },
        {
          "id": "vietnam",
          "name": "Vietnam",
          "postpaid": false
        },
        {
          "id": "pdam",
          "name": "PDAM",
          "postpaid": true
        },
        {
          "id": "bpjs",
          "name": "BPJS",
          "postpaid": true
        },
        {
          "id": "internet",
          "name": "Internet",
          "postpaid": true
        },
        {
          "id": "pajak-kendaraan",
          "name": "Pajak Kendaraan",
          "postpaid": true
        },
        {
          "id": "finance",
          "name": "Finance",
          "postpaid": true
        },
        {
          "id": "hp",
          "name": "HP",
          "postpaid": true
        },
        {
          "id": "estate",
          "name": "Estate",
          "postpaid": true
        },
        {
          "id": "emoney",
          "name": "E-Money",
          "postpaid": true
        },
        {
          "id": "kereta",
          "name": "Kereta",
          "postpaid": true
        },
        {
          "id": "tv",
          "name": "TV",
          "postpaid": true
        },
        {
          "id": "airline",
          "name": "Airline",
          "postpaid": true
        },
        {
          "id": "o2o",
          "name": "O2O",
          "postpaid": true
        },
        {
          "id": "pbb",
          "name": "PBB",
          "postpaid": true
        },
        {
          "id": "gas",
          "name": "Gas",
          "postpaid": true
        },
        {
          "id": "pajak-daerah",
          "name": "Pajak Daerah",
          "postpaid": true
        },
        {
          "id": "pln",
          "name": "PLN Pascabayar",
          "postpaid": true
        },
        {
          "id": "pasar",
          "name": "Pasar",
          "postpaid": true
        },
        {
          "id": "retribusi",
          "name": "Retribusi",
          "postpaid": true
        },
        {
          "id": "pendidikan",
          "name": "Pendidikan",
          "postpaid": true
        },
        {
          "id": "asuransi",
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
