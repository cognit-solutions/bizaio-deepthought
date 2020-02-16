package io.biza.deepthought.data.persistence.model.transaction;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Type;
import io.biza.babelfish.cdr.enumerations.BankingTransactionService;
import io.biza.deepthought.data.enumerations.DioSchemeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Valid
@Table(name = "TRANSACTION_NPP")
public class TransactionNPPData {

  @Id
  @Type(type = "uuid-char")
  UUID id;
  
  @Builder.Default
  private DioSchemeType schemeType = DioSchemeType.DIO_BANKING;
  
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TRANSACTION_ID")
  @MapsId
  @ToString.Exclude
  TransactionData transaction;

  @Column(name = "PAYER")
  String payer;

  @Column(name = "PAYEE")
  String payee;
  
  @Column(name = "END_TO_END_ID")
  String endToEndId;
  
  @Column(name = "PURPOSE")
  String purposeCode;
  
  @Column(name = "SERVICE")
  @Enumerated(EnumType.STRING)
  @NotNull
  @Builder.Default
  BankingTransactionService service = BankingTransactionService.X2P101;
  
}
