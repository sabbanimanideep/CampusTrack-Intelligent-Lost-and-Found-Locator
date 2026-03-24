package com.LostGadgetTracker.LostGadgetTracker.repo;

import com.LostGadgetTracker.LostGadgetTracker.entities.Role;
import com.LostGadgetTracker.LostGadgetTracker.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.rollNoOrEmpId = :value")
    Optional<User> findByRoll(@Param("value") String value);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.rollNoOrEmpId = :value")
    boolean existsByRoll(@Param("value") String value);

    long countByRole(Role role);

}