package com.LostGadgetTracker.LostGadgetTracker.Services;



import com.LostGadgetTracker.LostGadgetTracker.entities.FoundItem;
import com.LostGadgetTracker.LostGadgetTracker.repo.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FoundItemService {

    @Autowired
    private FoundItemRepository repository;

    public FoundItem save(FoundItem item) {
        return repository.save(item);
    }

    public FoundItem getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<FoundItem> getAllItems() {
        return repository.findAll();
    }
}
