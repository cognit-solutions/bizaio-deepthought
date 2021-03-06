package io.biza.deepthought.data.translation.mapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import io.biza.babelfish.cdr.models.payloads.banking.product.BankingProductDepositRateV1;
import io.biza.babelfish.cdr.models.payloads.banking.product.BankingProductRateTierV1;
import io.biza.babelfish.cdr.models.payloads.banking.product.BankingProductRateTierApplicabilityV1;
import io.biza.deepthought.data.OrikaFactoryConfigurerInterface;
import io.biza.deepthought.data.payloads.DioProductRateDeposit;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingRateDepositData;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingRateDepositTierApplicabilityData;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingRateDepositTierData;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.MappingContext;

public class ProductCdrBankingRateDepositDataMapper implements OrikaFactoryConfigurerInterface {

  @Override
  public void configure(MapperFactory orikaMapperFactory) {

    orikaMapperFactory
        .classMap(ProductCdrBankingRateDepositData.class, BankingProductDepositRateV1.class)
        .exclude("tiers").byDefault()
        .customize(new CustomMapper<ProductCdrBankingRateDepositData, BankingProductDepositRateV1>() {
          @Override
          public void mapAtoB(ProductCdrBankingRateDepositData from, BankingProductDepositRateV1 to,
              MappingContext context) {

            List<BankingProductRateTierV1> tierList =
                new ArrayList<BankingProductRateTierV1>();

            if (from.tiers() != null) {
              for (ProductCdrBankingRateDepositTierData tierData : from.tiers()) {
                BankingProductRateTierV1 rateTier = new BankingProductRateTierV1();
                rateTier.maximumValue(tierData.maximumValue());
                rateTier.minimumValue(tierData.minimumValue());
                rateTier.name(tierData.name());
                rateTier.rateApplicationMethod(tierData.rateApplicationMethod());
                rateTier.unitOfMeasure(tierData.unitOfMeasure());
                if (tierData.applicabilityConditions() != null) {
                  rateTier.applicabilityConditions(new BankingProductRateTierApplicabilityV1()
                      .additionalInfo(tierData.applicabilityConditions().additionalInfo())
                      .additionalInfoUri(tierData.applicabilityConditions().additionalInfoUri()));
                }

                tierList.add(rateTier);
              }
            }
            to.tiers(tierList);
          }
        }).register();

    orikaMapperFactory.classMap(ProductCdrBankingRateDepositData.class, DioProductRateDeposit.class)
        .fieldAToB("id", "id").field("schemeType", "schemeType")
        .field("depositRateType", "cdrBanking.depositRateType").field("rate", "cdrBanking.rate")
        .field("applicationFrequency", "cdrBanking.applicationFrequency")
        .field("calculationFrequency", "cdrBanking.calculationFrequency")
        .field("additionalValue", "cdrBanking.additionalValue")
        .field("additionalInfo", "cdrBanking.additionalInfo")
        .field("additionalInfoUri", "cdrBanking.additionalInfoUri")
        .customize(new CustomMapper<ProductCdrBankingRateDepositData, DioProductRateDeposit>() {
          @Override
          public void mapAtoB(ProductCdrBankingRateDepositData from, DioProductRateDeposit to,
              MappingContext context) {

            List<BankingProductRateTierV1> tierList =
                new ArrayList<BankingProductRateTierV1>();

            if (from.tiers() != null) {
              for (ProductCdrBankingRateDepositTierData tierData : from.tiers()) {
                BankingProductRateTierV1 rateTier = new BankingProductRateTierV1();
                rateTier.maximumValue(tierData.maximumValue());
                rateTier.minimumValue(tierData.minimumValue());
                rateTier.name(tierData.name());
                rateTier.rateApplicationMethod(tierData.rateApplicationMethod());
                rateTier.unitOfMeasure(tierData.unitOfMeasure());
                if (tierData.applicabilityConditions() != null) {
                  rateTier.applicabilityConditions(new BankingProductRateTierApplicabilityV1()
                      .additionalInfo(tierData.applicabilityConditions().additionalInfo())
                      .additionalInfoUri(tierData.applicabilityConditions().additionalInfoUri()));
                }

                tierList.add(rateTier);
              }
            }
            to.cdrBanking().tiers(tierList);
          }

          @Override
          public void mapBtoA(DioProductRateDeposit from, ProductCdrBankingRateDepositData to,
              MappingContext context) {

            Set<ProductCdrBankingRateDepositTierData> tierList =
                new HashSet<ProductCdrBankingRateDepositTierData>();

            if (from.cdrBanking().tiers() != null) {
              for (BankingProductRateTierV1 rateTier : from
                  .cdrBanking().tiers()) {
                ProductCdrBankingRateDepositTierData tierData =
                    new ProductCdrBankingRateDepositTierData();
                tierData.maximumValue(rateTier.maximumValue());
                tierData.minimumValue(rateTier.minimumValue());
                tierData.name(rateTier.name());
                tierData.rateApplicationMethod(rateTier.rateApplicationMethod());
                tierData.unitOfMeasure(rateTier.unitOfMeasure());
                if (rateTier.applicabilityConditions() != null) {
                  tierData.applicabilityConditions(
                      new ProductCdrBankingRateDepositTierApplicabilityData()
                          .additionalInfo(rateTier.applicabilityConditions().additionalInfo())
                          .additionalInfoUri(
                              rateTier.applicabilityConditions().additionalInfoUri()));
                }
                tierList.add(tierData);
              }
            }
            to.tiers(tierList);
          }
        }).register();
  }

}
