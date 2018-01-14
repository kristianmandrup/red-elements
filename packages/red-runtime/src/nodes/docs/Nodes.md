# Nodes

The `Nodes` class is in need of heavy duty refactoring.
It contains too many functions and some functions are way too large and need to be broken down, either into smaller private/protectd functions or via dedicated helper classes.

Reading the `Nodes` class should be easy to understand what it does and what functionality it includes. It is a core class of `node-red` so super important it is well designed!

The `Nodes` class should use injection using `@injectable` decorator for each of the helper classes below. This way we can easily mock/stub functionality when testing ;)

## Serialize

Import/Export Nodes using:

- `Importer` - import nodes (from string or JSON representation)
- `Exporter` - create exportable set of nodes

## Convert

Conversion of Nodes

## Iterator

Functions for iterating lists such as workspace, subflows etc.

## Workspace

Functionality related to Nodes workspace

## Subflow

Functionality related to Nodes subflow

## Link

Functionality related to Nodes link

## Match

Functionality to test for matching Nodes