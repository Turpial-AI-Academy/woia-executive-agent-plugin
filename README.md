# woia-executive

Portable Agent Plugin for Source-backed executive direction, bounded priorities and receiver-owned management contributions..

## Capability

~~~text
DISCOVER -> DECIDE -> IMPLEMENT -> VALIDATE -> REPORT
~~~

The plugin adapts to the repository it operates on without requiring the consumer to adopt WOIA's authoring toolchain.

## Portable package

~~~text
plugin.json
README.md
LICENSE
skills/**
# optional source diagnostic when retained by the repository
CHECKSUMS.sha256
~~~

`CHECKSUMS.sha256` is optional source evidence, not a required portable/release artifact.

Add `mcp.json` only if the capability genuinely requires MCP.

## Consumer requirements

Document only genuine capability/runtime requirements here. Do not list maintenance Node/pnpm/Mise/Docker unless the portable capability itself truly needs them.

## Development

~~~text
mise install
mise run bootstrap
mise run doctor
mise run ci:fast
mise run ci:extended
mise run release:check
~~~

## Executive methodology
The five-phase skill implements accepted direction, scoped visibility, owned exceptions, receiver-owned contributions and changed-decision follow-up. Core >= 0.5.6 is the sole hard plugin dependency. The planning helper is pure and cannot dispatch contacts or money. Host transport/authority qualification remains separate. See skills/woia-executive/references/contract.md. No Production Ready or Operator E2E claim.
