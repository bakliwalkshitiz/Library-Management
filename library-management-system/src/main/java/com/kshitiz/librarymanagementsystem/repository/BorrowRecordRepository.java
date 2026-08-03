package com.kshitiz.librarymanagementsystem.repository;

import com.kshitiz.librarymanagementsystem.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowRecordRepository
        extends JpaRepository<BorrowRecord, Integer> {

}