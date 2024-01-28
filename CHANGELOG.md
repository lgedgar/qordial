# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Improved display, error handling for ResourceDownloader component.

## [0.1.6] - 2024-01-27

### Added

- New components:
  - CopyableText

### Changed

- PrettyIdentifier component refactored to use CopyableText.

## [0.1.5] - 2024-01-25

### Added

- New plugin methods:
  - `objectToBase64()`

### Changed

- Deprecated `fetchResourceJSON()` method for plugin; renamed it to
  `fetchResourceObject()` instead.

## [0.1.4] - 2024-01-23

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

[unreleased]: https://github.com/lgedgar/qordial/compare/v0.1.6...HEAD
[0.1.6]: https://github.com/lgedgar/qordial/compare/v0.1.6...v0.1.5
[0.1.5]: https://github.com/lgedgar/qordial/compare/v0.1.5...v0.1.4
[0.1.4]: https://github.com/lgedgar/qordial/compare/v0.1.4...v0.1.3
[0.1.3]: https://github.com/lgedgar/qordial/compare/v0.1.3...v0.1.2
[0.1.2]: https://github.com/lgedgar/qordial/compare/v0.1.2...v0.1.1
[0.1.1]: https://github.com/lgedgar/qordial/releases/tag/v0.1.1
