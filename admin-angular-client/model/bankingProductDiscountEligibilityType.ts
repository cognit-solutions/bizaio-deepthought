/**
 * Deep Thought Administration API
 * This is the Deep Thought Administration API. You can find out more about Deep Thought at [https://github.com/bizaio/deepthought](https://github.com/bizaio/deepthought) or on the [DataRight.io Slack, #oss](https://join.slack.com/t/datarightio/shared_invite/enQtNzAyNTI2MjA2MzU1LTU1NGE4MmQ2N2JiZWI2ODA5MTQ2N2Q0NTRmYmM0OWRlM2U5YzA3NzU5NDYyODlhNjRmNzU3ZDZmNTI0MDE3NjY).
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

/**
 * Banking Product Discount Eligibility Type
 */
export type BankingProductDiscountEligibilityType = 'BUSINESS' | 'PENSION_RECIPIENT' | 'MIN_AGE' | 'MAX_AGE' | 'MIN_INCOME' | 'MIN_TURNOVER' | 'STAFF' | 'STUDENT' | 'EMPLOYMENT_STATUS' | 'RESIDENCY_STATUS' | 'NATURAL_PERSON' | 'INTRODUCTORY' | 'OTHER';

export const BankingProductDiscountEligibilityType = {
    BUSINESS: 'BUSINESS' as BankingProductDiscountEligibilityType,
    PENSIONRECIPIENT: 'PENSION_RECIPIENT' as BankingProductDiscountEligibilityType,
    MINAGE: 'MIN_AGE' as BankingProductDiscountEligibilityType,
    MAXAGE: 'MAX_AGE' as BankingProductDiscountEligibilityType,
    MININCOME: 'MIN_INCOME' as BankingProductDiscountEligibilityType,
    MINTURNOVER: 'MIN_TURNOVER' as BankingProductDiscountEligibilityType,
    STAFF: 'STAFF' as BankingProductDiscountEligibilityType,
    STUDENT: 'STUDENT' as BankingProductDiscountEligibilityType,
    EMPLOYMENTSTATUS: 'EMPLOYMENT_STATUS' as BankingProductDiscountEligibilityType,
    RESIDENCYSTATUS: 'RESIDENCY_STATUS' as BankingProductDiscountEligibilityType,
    NATURALPERSON: 'NATURAL_PERSON' as BankingProductDiscountEligibilityType,
    INTRODUCTORY: 'INTRODUCTORY' as BankingProductDiscountEligibilityType,
    OTHER: 'OTHER' as BankingProductDiscountEligibilityType
};