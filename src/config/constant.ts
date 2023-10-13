import dotenv from 'dotenv';
dotenv.config();

export default {
    baseUrl: process.env.BASEURL,
    // baseUrl: 'https://api-kmp.superteam.web.id',
    userImagePath: 'public/uploads/user',
    storeImagePath: 'public/uploads/store',
    productImagePath: 'public/uploads/product',
    nftImagePath: 'public/uploads/nft',
    ktpImagePath: 'public/uploads/ktp',
    appInfoImagePath: 'public/uploads/appinfo',

    // key-value pair
    KMPBrankas: 'brankas',
    KMPNettRevenue: 'revenue',
    gasFeeTokenValue: 'gasFeeTokenValue',
    gasFeeCoinValue: 'gasFeeCoinValue',
    storeOrderPrcntFee: 'storeOrderPrcntFee',
    nftBuybackPrcntFee: 'nftBuybackPrcntFee',
    depositAdmPrcntValue: 'depositAdmPrcntValue',
    marketplaceAdmPrcntValue: 'marketplaceAdmPrcntValue',
    nftAdmPrcntValue: 'nftAdmPrcntValue',
    PPOBPrepaidPrcntValue: 'PPOBPrepaidPrcntValue',
    PPOBPostpaidPrcntValue: 'PPOBPostpaidPrcntValue',

    // app info
    appAboutUs: 'aboutUs',
    appPrivacyPolicy: 'privacyPolicy'
}