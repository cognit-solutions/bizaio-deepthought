package io.biza.deepthought.admin.api.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import io.biza.deepthought.admin.Labels;
import io.biza.deepthought.admin.api.delegate.ProductFeeAdminApiDelegate;
import io.biza.deepthought.admin.exceptions.ValidationListException;
import io.biza.deepthought.admin.support.DeepThoughtValidator;
import io.biza.deepthought.data.component.DeepThoughtMapper;
import io.biza.deepthought.data.enumerations.DioExceptionType;
import io.biza.deepthought.data.enumerations.DioSchemeType;
import io.biza.deepthought.data.payloads.DioProductFee;
import io.biza.deepthought.data.persistence.model.ProductData;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingFeeData;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingFeeDiscountData;
import io.biza.deepthought.data.persistence.model.cdr.ProductCdrBankingFeeDiscountEligibilityData;
import io.biza.deepthought.data.repository.ProductFeeDiscountEligibilityRepository;
import io.biza.deepthought.data.repository.ProductFeeDiscountRepository;
import io.biza.deepthought.data.repository.ProductFeeRepository;
import io.biza.deepthought.data.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;

@Controller
@Validated
@Slf4j
public class ProductFeeAdminApiDelegateImpl implements ProductFeeAdminApiDelegate {

  @Autowired
  private DeepThoughtMapper mapper;

  @Autowired
  ProductFeeRepository feeRepository;

  @Autowired
  ProductFeeDiscountRepository discountRepository;
  
  @Autowired
  ProductFeeDiscountEligibilityRepository eligibilityRepository;


  @Autowired
  ProductRepository productRepository;

  @Autowired
  private Validator validator;
  
  @Override
  public ResponseEntity<List<DioProductFee>> listProductFees(UUID brandId, UUID productId) {

    List<ProductCdrBankingFeeData> feeList =
        feeRepository.findAllByProduct_Product_Brand_IdAndProduct_Product_Id(brandId, productId);
    LOG.debug("Listing fees and have database result of {}", feeList);
    return ResponseEntity.ok(mapper.mapAsList(feeList, DioProductFee.class));
  }

  @Override
  public ResponseEntity<DioProductFee> getProductFee(UUID brandId, UUID productId, UUID id) {
    Optional<ProductCdrBankingFeeData> data = feeRepository
        .findByIdAndProduct_Product_Brand_IdAndProduct_Product_Id(id, brandId, productId);

    if (data.isPresent()) {
      LOG.debug("Get Product Fee for brand {} and product {} returning: {}", brandId, productId,
          data.get());
      return ResponseEntity.ok(mapper.map(data.get(), DioProductFee.class));
    } else {
      LOG.warn("Get product fee for brand {} and product {} not found", brandId, productId);
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @Override
  public ResponseEntity<DioProductFee> createProductFee(UUID brandId, UUID productId,
      DioProductFee createData) throws ValidationListException {

    DeepThoughtValidator.validate(validator, createData);

    Optional<ProductData> product = productRepository.findByIdAndBrandId(productId, brandId);

    if (!product.isPresent()) {
      throw ValidationListException.builder().type(DioExceptionType.INVALID_BRAND_AND_PRODUCT)
          .explanation(Labels.ERROR_INVALID_BRAND_AND_PRODUCT).build();
    }

    ProductCdrBankingFeeData data = mapper.map(createData, ProductCdrBankingFeeData.class);

    if (data.discounts() != null) {
      for(ProductCdrBankingFeeDiscountData discount : data.discounts()) {
        if (discount.eligibility() != null) {
          for(ProductCdrBankingFeeDiscountEligibilityData eligibility : discount.eligibility()) {
            eligibility.discount(discount);
          }
        }
        discount.fee(data);
      }
    }

    LOG.debug("Attempting to save: {}", data);

    if (!product.get().schemeType().equals(createData.schemeType())) {
      throw ValidationListException.builder().type(DioExceptionType.UNSUPPORTED_PRODUCT_SCHEME_TYPE)
          .explanation(Labels.ERROR_UNSUPPORTED_PRODUCT_SCHEME_TYPE).build();

    }

    if (product.get().schemeType().equals(DioSchemeType.CDR_BANKING)) {
      data.product(product.get().cdrBanking());
    }

    data = feeRepository.save(data);
    LOG.debug("Create Product Fee for brand {} and product {} returning: {}", brandId, productId,
        data);
    return getProductFee(brandId, productId, data.id());
  }

  @Override
  public ResponseEntity<Void> deleteProductFee(UUID brandId, UUID productId, UUID id) {
    Optional<ProductCdrBankingFeeData> optionalData = feeRepository
        .findByIdAndProduct_Product_Brand_IdAndProduct_Product_Id(id, brandId, productId);

    if (optionalData.isPresent()) {
      LOG.debug("Deleting product fee with brand: {} productId: {} id: {}", brandId, productId, id);
      feeRepository.delete(optionalData.get());
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @Override
  public ResponseEntity<DioProductFee> updateProductFee(UUID brandId, UUID productId, UUID id,
      DioProductFee updateData) throws ValidationListException {

    DeepThoughtValidator.validate(validator, updateData);

    Optional<ProductCdrBankingFeeData> optionalData = feeRepository
        .findByIdAndProduct_Product_Brand_IdAndProduct_Product_Id(id, brandId, productId);

    if (optionalData.isPresent()) {
      ProductCdrBankingFeeData data = optionalData.get();
      
      if (data.discounts() != null) {
        for(ProductCdrBankingFeeDiscountData discount : data.discounts()) {
          if (discount.eligibility() != null) {
            for(ProductCdrBankingFeeDiscountEligibilityData eligibility : discount.eligibility()) {
              discount.eligibility().remove(eligibility);
              eligibilityRepository.deleteById(eligibility.id());
            }
          }
          data.discounts().remove(discount);
          discountRepository.deleteById(discount.id());
        }
      }

      data = feeRepository.save(data);

      LOG.debug("Fee data is now: {}", data);
      
      mapper.map(updateData, data);
      
      if (data.discounts() != null) {
        for(ProductCdrBankingFeeDiscountData discount : data.discounts()) {
          if (discount.eligibility() != null) {
            for(ProductCdrBankingFeeDiscountEligibilityData eligibility : discount.eligibility()) {
              eligibility.discount(discount);
            }
          }
          discount.fee(data);
        }
      }
      
      data = feeRepository.save(data);

      LOG.debug("Updated product fee for brand: {} productId: {} id: {} with data of {}", brandId,
          productId, id, data);
      return getProductFee(brandId, productId, data.id());
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

}
