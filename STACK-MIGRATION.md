# Spring 7 migration (depends on PR #28)

| Component | Before | After |
|---|---|---|
| Java | 21 | 21 |
| Spring Boot parent/BOM | 3.5.16 | 4.1.2 |
| Spring Framework | 6.2.19 | 7.0.10 (Boot BOM) |
| Spring Security | Boot 3.5 BOM | 7.1.2 (Boot BOM) |
| Vaadin BOM/plugin | 24.9.4 | 25.3.4 |
| Tomcat / Netty | explicit overrides | Boot BOM: 11.0.27 / 4.2.19.Final |

All selected versions are stable releases from Maven Central. No commercial repository,
license purchase, per-module Spring override, CVE suppression or security gate change.

## Compatibility evidence

- [Vaadin 25.3 supported technologies](https://vaadin.com/docs/latest/compatibility):
  Java 21+, Boot 4.1+, Node 24+, Servlet 6.1+. Vaadin plugin installs Node when needed.
- [Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html).
- [Boot 4.1.2 BOM](https://repo.maven.apache.org/maven2/org/springframework/boot/spring-boot-dependencies/4.1.2/spring-boot-dependencies-4.1.2.pom):
  manages Framework 7.0.10 and Security 7.1.2 together.
- [CVE-2026-47884](https://github.com/advisories/GHSA-pc63-qcmh-9cmg) and
  [CVE-2026-47890](https://github.com/advisories/GHSA-j9f9-w8pj-32f8):
  first patched Framework 7 release is 7.0.9; selected 7.0.10 is outside affected range.

## Minimal compatibility changes

- Replace removed `VaadinWebSecurity` with `SecurityFilterChain` and
  `VaadinSecurityConfigurer`; retain public health and protected application routes.
- Add Boot 4 Flyway starter for modular auto-configuration.
- Use Testcontainers 2 artifact names/package and Boot 4 test REST client modules.
- Add optional Vaadin development module required by Vaadin 25 development/test mode.
- Ignore generated production frontend bundles, not source files.

## Validation

Local Java 21 `mvn verify`: three integration tests pass (context/Flyway V1,
anonymous health 200/UP, protected root). Compose build/wait: app and PostgreSQL healthy.
Local Trivy CRITICAL scan: zero findings in OS and application JAR.
CI remains authoritative for ARM64 build, secret scan, SBOM/digest evidence and all gates.
Do not merge until `verify`, `compose`, `security` pass for the migration head commit.
