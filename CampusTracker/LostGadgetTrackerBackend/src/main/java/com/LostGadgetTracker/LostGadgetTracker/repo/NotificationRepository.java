package com.LostGadgetTracker.LostGadgetTracker.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.LostGadgetTracker.LostGadgetTracker.entities.Notification;

import jakarta.transaction.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserEmail(String email);

    @Transactional
    @Modifying
    @Query("update Notification n set n.readStatus = true")
    void markAllRead();
}