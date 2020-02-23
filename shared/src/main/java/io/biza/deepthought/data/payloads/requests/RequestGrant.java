package io.biza.deepthought.data.payloads.requests;

import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.biza.deepthought.data.enumerations.DioAccountStatus;
import io.biza.deepthought.data.enumerations.DioBankAccountType;
import io.biza.deepthought.data.enumerations.DioSchemeType;
import io.biza.deepthought.data.payloads.dio.banking.DioBankAccountCreditCard;
import io.biza.deepthought.data.payloads.dio.banking.DioBankAccountLoanAccount;
import io.biza.deepthought.data.payloads.dio.banking.DioBankAccountTermDeposit;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@Valid
@ToString
@EqualsAndHashCode
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request for create or update of Grant")
public class RequestGrant {

  @Schema(description = "Token Subject Identifier", required = true)
  @NotNull
  @JsonProperty(value = "subject")
  String subject;

  @Schema(
      description = "How long should the grant remain (in seconds), if supplied in update will extend by this length, if not supplied will default to 30 days",
      defaultValue = "2592000")
  @JsonProperty(value = "length")
  Integer length;

  @Schema(description = "Customer ID to Associate with Grant")
  @JsonProperty(value = "customer")
  UUID customer;

  @Schema(description = "List of Account IDs to Associate with Grant")
  @JsonProperty(value = "accounts")
  List<UUID> accounts;

}
