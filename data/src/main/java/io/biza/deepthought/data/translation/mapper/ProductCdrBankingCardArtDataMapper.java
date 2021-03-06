package io.biza.deepthought.data.translation.mapper;

import io.biza.babelfish.cdr.models.payloads.banking.product.BankingProductCardArtV1;
import io.biza.deepthought.data.OrikaFactoryConfigurerInterface;
import io.biza.deepthought.data.payloads.DioProductCardArt;
import ma.glasnost.orika.MapperFactory;

public class ProductCdrBankingCardArtDataMapper implements OrikaFactoryConfigurerInterface {

  @Override
  public void configure(MapperFactory orikaMapperFactory) {
    orikaMapperFactory
        .classMap(io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingCardArtData.class,
            DioProductCardArt.class)
        .fieldAToB("id", "id").field("", "cdrBanking").byDefault().register();

    orikaMapperFactory
        .classMap(io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingCardArtData.class,
            BankingProductCardArtV1.class)
        .byDefault().register();

  }

}
