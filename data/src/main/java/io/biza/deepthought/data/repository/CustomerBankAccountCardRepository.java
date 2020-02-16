package io.biza.deepthought.data.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import io.biza.deepthought.data.persistence.model.customer.bank.CustomerBankAccountCardData;

@Repository
public interface CustomerBankAccountCardRepository extends JpaRepository<CustomerBankAccountCardData, UUID> {
  
}
