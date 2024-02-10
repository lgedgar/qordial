# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## Added

- Show basic resource info in download modal.
- Add simply "retry" confirmation when fetching resource fails with 404.

## 0.1.8 - 2024-02-09

### Added

- Add `fetchResourceListing()` plugin method, for fetching basic info.

### Changed

- Use fallback `mimeType` if none can be derived, when saving resource as file.
- Use `<span>` instead of `<div>` for root tag of `PrettyTime` component.

## [0.1.7] - 2024-02-05

### Added

- New plguin methods:
  - `fetchResourceText()`

### Changed

- Improved display, error handling for ResourceDownloader component.
- Throw error if plugin method `fetchResourceBlob()` returns 404 response.
- Throw error if `ResourceDownloader` component receives a 404 response.

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
