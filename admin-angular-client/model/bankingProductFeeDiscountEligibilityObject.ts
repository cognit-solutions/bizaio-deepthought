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
import { BankingProductDiscountEligibilityType } from './bankingProductDiscountEligibilityType';

/**
 * Banking Product Discount Eligibility Details
 */
export interface BankingProductFeeDiscountEligibilityObject { 
    discountEligibilityType: BankingProductDiscountEligibilityType;
    /**
     * Additional Value for Eligibility Constraint related to Discount
     */
    additionalValue?: string;
    /**
     * Display text providing more information on this eligibility constraint
     */
    additionalInfo?: string;
    /**
     * Link to a web page with more information on this eligibility constraint
     */
    additionalInfoUri?: string;
}