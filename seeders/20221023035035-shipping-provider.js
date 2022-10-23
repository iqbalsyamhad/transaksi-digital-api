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
      'ShippingProviders',
      [
        {
          "code": "pos",
          "name": "POS Indonesia"
        },
        {
          "code": "lion",
          "name": "Lion Parcel"
        },
        {
          "code": "ninja",
          "name": "Ninja Xpress"
        },
        {
          "code": "ide",
          "name": "ID Express"
        },
        {
          "code": "sicepat",
          "name": "SiCepat Express"
        },
        {
          "code": "sap",
          "name": "SAP Express"
        },
        {
          "code": "ncs",
          "name": "Nusantara Card Semesta"
        },
        {
          "code": "anteraja",
          "name": "AnterAja"
        },
        {
          "code": "rex",
          "name": "Royal Express Indonesia"
        },
        {
          "code": "jtl",
          "name": "JTL Express"
        },
        {
          "code": "sentral",
          "name": "Sentral Cargo"
        },
        {
          "code": "jne",
          "name": "Jalur Nugraha Ekakurir (JNE)"
        },
        {
          "code": "tiki",
          "name": "Citra Van Titipan Kilat (TIKI)"
        },
        {
          "code": "rpx",
          "name": "RPX Holding"
        },
        {
          "code": "pandu",
          "name": "Pandu Logistics"
        },
        {
          "code": "wahana",
          "name": "Wahana Prestasi Logistik"
        },
        {
          "code": "jnt",
          "name": "J&T Express"
        },
        {
          "code": "pahala",
          "name": "Pahala Kencana Express"
        },
        {
          "code": "jet",
          "name": "JET Express"
        },
        {
          "code": "slis",
          "name": "Solusi Ekspres"
        },
        {
          "code": "EXPEDITO",
          "name": "Expedito"
        },
        {
          "code": "RAY",
          "name": "Ray Speed"
        },
        {
          "code": "dse",
          "name": "21 Express"
        },
        {
          "code": "first",
          "name": "First Logistics"
        },
        {
          "code": "star",
          "name": "Star Cargo"
        },
        {
          "code": "idl",
          "name": "IDL Cargo"
        },
        {
          "code": "indah",
          "name": "Indah Cargo"
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
