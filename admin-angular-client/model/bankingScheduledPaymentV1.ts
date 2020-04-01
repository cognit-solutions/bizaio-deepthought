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
import { BankingScheduledPaymentFromV1 } from './bankingScheduledPaymentFromV1';
import { BankingScheduledPaymentRecurrenceV1 } from './bankingScheduledPaymentRecurrenceV1';
import { BankingScheduledPaymentSetV1 } from './bankingScheduledPaymentSetV1';
import { BankingScheduledPaymentStatus } from './bankingScheduledPaymentStatus';

/**
 * Describes a Scheduled Payment
 */
export interface BankingScheduledPaymentV1 { 
    /**
     * A unique ID of the scheduled payment adhering to the standards for ID permanence
     */
    scheduledPaymentId: string;
    /**
     * The short display name of the payee as provided by the customer
     */
    nickname?: string;
    /**
     * The reference for the transaction that will be used by the originating institution for the purposes of constructing a statement narrative on the payer’s account. Empty string if no data provided
     */
    payerReference: string;
    /**
     * The reference for the transaction that will be provided by the originating institution. Empty string if no data provided
     */
    payeeReference: string;
    status: BankingScheduledPaymentStatus;
    from: BankingScheduledPaymentFromV1;
    paymentSet: Array<BankingScheduledPaymentSetV1>;
    recurrence: BankingScheduledPaymentRecurrenceV1;
}