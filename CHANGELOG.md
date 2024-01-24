# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New components:
  - JsonModal
  - NameInput
  - PrettyBytes
  - PrettyIdentifier
  - PrettyTime
  - ResourceDownloader
- New methods on global $qordial plugin:
  - confirmPublish
  - fetchResourceBlob
  - fetchResourceJSON
  - fetchResourceMetadata
  - fileToBase64
  - formatBytes
  - resourceExists
- New dependencies:
  - @wdns/vue-code-block
  - moment
  - vue-clipboard3

## [0.1.3] - 2024-01-22

### Added

- Add plugin method for base64-encoding a string.

## [0.1.2] - 2024-01-21

### Added

- Add common "auth" store.
- Add plugin for Vue, with `authenticate()` method.

## [0.1.1] - 2024-01-21

### Added

- Initial release as library with just a ServicePicker component.

[unreleased]: https://github.com/lgedgar/qordial/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/lgedgar/qordial/compare/v0.1.3...v0.1.2
[0.1.2]: https://github.com/lgedgar/qordial/compare/v0.1.2...v0.1.1
[0.1.1]: https://github.com/lgedgar/qordial/releases/tag/v0.1.1
