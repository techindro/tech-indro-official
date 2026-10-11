Created 0 of 4 detected sources in PostHog. The PostgreSQL and MongoDB credential prompts were cancelled, and after two consecutive cancellations Groq and Razorpay were handed off for browser setup.

# PostHog Data Warehouse Setup Report

## Changes made

- No PostHog data warehouse sources were created.
- No application source code or configuration was changed.
- Added this report with browser setup links for all four detected sources.

## Files created

- `posthog-warehouse-report.md`

## Manual steps

Open each applicable link and finish entering its credentials in PostHog:

- [PostgreSQL setup](https://us.i.posthog.com/project/657689/data-warehouse/new-source?kind=Postgres&utm_source=wizard&utm_campaign=warehouse-source)
- [MongoDB setup](https://us.i.posthog.com/project/657689/data-warehouse/new-source?kind=MongoDB&utm_source=wizard&utm_campaign=warehouse-source)
- [Groq setup](https://us.i.posthog.com/project/657689/data-warehouse/new-source?kind=Groq&utm_source=wizard&utm_campaign=warehouse-source)
- [Razorpay setup](https://us.i.posthog.com/project/657689/data-warehouse/new-source?kind=Razorpay&utm_source=wizard&utm_campaign=warehouse-source)

For PostgreSQL, use a public IPv4-reachable, TLS-enabled host and allowlist PostHog's US egress IP addresses (`44.205.89.55`, `52.4.194.122`, and `44.208.188.173`) if required by the database firewall. For MongoDB, use a publicly reachable TLS connection string.
