# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Roadmap
- Diagrams inside notes (water logic)

## Version 0.3.2

### Added
- Infomap section with no ending markers will last till the last line of a note

### Fixed
- Infomap section beginning in the first line of a note couldn't get rendered (Issue #1)
- README.md - Example code illustrating `infomap`'s usage was replaced by an image, because all of the links inside were processed by the Visual Studio Code publish tool

## Version 0.3.0

### Added
- The ability to include other notes into the current one and to preview the result inside VS Code
- The use of sections inside the document:
  - `meta` section can contain information about the note itself (author, tags and so on) and it's not rendered in the Markdown preview;
  - `infomap` section should contain other notes inclusions and is rendered as a table with titles in the left column (label) and included content in the right column

### Changed
- `README.md` now includes additional `markdown-it` plugins list and gives credit to [Sergey Kryukov](http://www.sakryukov.org/)

## Version 0.2.1

### Changed
- `documentLinkProvider` became a class, all the initialization and registratrion of this component moved to its file
- `README.md` updated to include detailed information about logo picture
- Link to github repository included in extension description

### Fixed
- File ID recognition in links, which led to creation of new files with wrong ID


## Version 0.2.0
- Initial release