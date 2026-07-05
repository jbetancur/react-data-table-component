# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 8.x     | Yes       |
| < 8.0   | No        |

## Reporting a vulnerability

Please do not open a public issue for security reports.

Report vulnerabilities privately using one of:

1. **GitHub private vulnerability reporting** (preferred): use the [Report a vulnerability](https://github.com/jbetancur/react-data-table-component/security/advisories/new) form on this repository.
2. **Email**: <security@reactdatatable.com>

You will receive an acknowledgment within 5 business days. Once the report is validated, a fix will be prioritized and released as a patch to the current major version, followed by a coordinated disclosure through a GitHub Security Advisory crediting the reporter.

## Scope

react-data-table-component is a client-side UI library. Reports most likely to qualify: XSS via table data or props, prototype pollution, and supply-chain issues in the published npm package. The library has zero runtime dependencies, which keeps the supply-chain surface small.
