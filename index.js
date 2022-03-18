/**
 *  LANNISTER PAY ALGORITHM
 * KEYS
 * 
 * FEE_ID = LNPY1221 || LNPY1222 || LNPY1223 || LNPY1224 || LNPY1225
 * 
 * FEE_CURRENCY = NGN || USD || .....
 * 
 * FEE_LOCALE = this is determined by the CURRENCY && the COUNTRY of FEE_ENTITY
 * 
 * 
 * FEE_ENTITY = CREDIT_CARD || MASTER_CARD || BANK_ACCOUNT || USSD || WALLET_ID
 * 
 * 
 * ENTITY_PROPERTY =  FOR specificity, Refers to any of the valid payment entity properties
 *            A value of (*) means its applicable to all.
 * 
 * 
 * FEE_TYPE = The type of FEE defines how its applied
 *            VALUES = FLAT || PERC || FLAT && PERC
 * 
 *            FLAT 50  =  50 NGN is applied as TRANSACTION FEE
 *            PERC = IS THE % OF TRANSACTION AMOUNT EG. PERC 1.5 = 1.5 * TRANSACTION AMOUNT / 100 = TRANSACTION FEE
 *            FLAT_PERC  =   Non-negative numeric 0 INCLUSIVE
 *            FLAT_PERC 20:0.5 = FLAT FEE OF 20 && 0.5% OF TRANSACTION AMOUNT = TRANSACTION FEE
 * 
 * 
 * FEE_CURRENCY & FEE_LOCALE & FEE_ENTITY can have there values as (*)
 *          EG. LNPY1224 * * CREDIT-CARD(*) : APPLY FLAT_PERC 20:0.5 
 *          Means that FEE should be applied to all CREDIT_CARD TRNASACTIONS in any CURRENCY || LOCALE
 * 
 * 
 * const isLocale
 * const isSpecified
 * 
    if(!FEE_CURRENCY) 
        THROW ERROR
    if(FEE_LOCALE !== [CREDIT_CARD, MASTER_CARD, BANK_ACCOUNT, USSD, WALLET_ID])
        THROW ERROR
    if(FEE_CURRENCY !== NGN)
        THROW ERROR CURRENCY CONFIGURATION NOT FOUND
    if(FEE_CURRENCY === FEE_ENTITY[COUNTRY]) 
        LOCL
    else INTL
    
    if(ENTITY_PROPERTY)
        isSpecified = True

    if(FEE_CURRENCY && isLocale && FEE_ENTITY && isSpecified)
        SELECT THE SPECIFIED CONFIGURATION APPLICABLE
    
    if(!FEE_CURRENCY && isLocale && FEE_ENTITY && isSpecified) 




    possible solution
    ==========================================================
    LNPY8222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8
    let LOCALE
    if(CurrencyCountry && PaymentEntity.Country) {
        if(CurrencyCountry === PaymentEntity.Country) {
           LOCALE =  LOCL
        } else {
            LOCALE = INTL
        }
    } Else {
         '*'
    }
    CONST ENTITY = PaymentEntity.type ? PaymentEntity.type : '*'
    let ENTITY_PROPERTY
    IF(IN_ARRAY[ID, Issuer, Brand, Number, SixID, Type, Country]) {
         ENTITY_PROPERTY = [] any one found in the array
    } ELSE {
        ENTITY_PROPERTY = '*'
    }

    const response = await lannisterpay.com/fee/?locale=locale?entity=ENTITY?entityProperty=ENTITY_PROPERTY


    let Data
    if(!Customer.Bears_Fee) {
            "AppliedFeeID": "NO FEE APPLIED",
            "AppliedFeeValue": 0,
            "ChargeAmount": 5230,
            "SettlementAmount": 5230

    } else {
        SWITCH (response.type) {
            case "PERC":
                CONST percentage = response.value


            case "FLAT":


            case "FLAT_PERC":



        }
    }

 *            
 *           
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
