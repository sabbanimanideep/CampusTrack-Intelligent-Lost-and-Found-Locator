package com.LostGadgetTracker.LostGadgetTracker.Services;



import com.LostGadgetTracker.LostGadgetTracker.entities.LostItem;
import com.LostGadgetTracker.LostGadgetTracker.repo.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LostItemService {

    @Autowired
    private LostItemRepository repository;

    public LostItem save(LostItem item) {
        return repository.save(item);
    }

    public LostItem getById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
