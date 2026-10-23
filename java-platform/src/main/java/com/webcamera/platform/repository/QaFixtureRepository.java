package com.webcamera.platform.repository;

import com.webcamera.platform.domain.QaFixture;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QaFixtureRepository extends JpaRepository<QaFixture, UUID> {
    List<QaFixture> findByExpiresAtBefore(Instant cutoff);
}
