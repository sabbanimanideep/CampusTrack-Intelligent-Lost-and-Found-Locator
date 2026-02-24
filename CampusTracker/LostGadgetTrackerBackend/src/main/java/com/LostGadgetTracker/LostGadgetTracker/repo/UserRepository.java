package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.rollNoOrEmpId = :val")
    Optional<User> findByRollNoOrEmpId(@Param("val") String val);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.rollNoOrEmpId = :val")
    boolean existsByRollNoOrEmpId(@Param("val") String val);
}