# Snapshot notes

This repository contains an archived frontend snapshot of Photon. The original repository history, branches, issues, pull-request discussions, deployment secrets, and backend are not part of this archive.

Changes for this release:

- Removed original deployment workflows and internal development instructions.
- Replaced bundled fonts with system fonts.
- Removed original backend/CDN defaults and private invitation links; service configuration is explicit.
- Disabled analytics, error-reporting destinations, source-map uploads, and advertising scripts.
- Removed signed Telegram mock-data generation and the requirement for a bot credential during build.
- Rendered biographies and descriptions as text instead of executable HTML.
- Cleared persisted user data alongside tokens on logout.
- Added product previews and the hackathon context.

Wallet, referral, and external task integrations require explicit configuration for your own services. Backend authorization and financial/reward logic are not implemented or repaired in this frontend-only snapshot.

Dependency versions represent the historical application and include known advisory matches. Passing build or type checks is not a security certification. Do not connect this archive to real user accounts, private data, or funds without a new security review.
