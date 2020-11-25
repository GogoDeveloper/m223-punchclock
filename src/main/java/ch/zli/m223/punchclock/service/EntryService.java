package ch.zli.m223.punchclock.service;

import ch.zli.m223.punchclock.domain.Entry;
import ch.zli.m223.punchclock.repository.EntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EntryService {
    private EntryRepository entryRepository;

    public EntryService(EntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public Entry createEntry(Entry entry) {
        return entryRepository.saveAndFlush(entry);
    }

    public List<Entry> findAll() {
        return entryRepository.findAll();
    }

    public void deleteEntry(Long id){
        entryRepository.deleteById(id);
    }
    public void editEntry(Long id, LocalDateTime checkIn, LocalDateTime checkOut){
        Optional<Entry> findEntry = entryRepository.findById(id);
        if (findEntry.isPresent()){
            Entry currentEntry = findEntry.get();
            currentEntry.setCheckIn(checkIn);
            currentEntry.setCheckOut(checkOut);
            entryRepository.save(currentEntry);
        }else {
            throw new NullPointerException("This Entry doesn't exist!");
        }


    }
}
