package io.biza.deepthought.data.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import io.biza.deepthought.data.persistence.model.ProductData;

@Repository
public interface ProductRepository extends JpaRepository<ProductData, UUID>, JpaSpecificationExecutor<ProductData> {
  public List<ProductData> findAllByBrandId(UUID brandId);
  public Optional<ProductData> findByIdAndBrandId(UUID id, UUID brandId);

}
