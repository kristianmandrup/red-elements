# Roadmap

Based on 1.0 road map and extended to suit our own visions.

## Themes

### Extensibility

Ensure both the runtime and editor have necessary extension points to be customised and built upon.

### Workflow

Support modern development practices, incl. Continuous Integration/Delivery (CI/CD) pipelines.

### Collaboration

Working within a team of developers. Sharing reusable assets.
Working collaboratively, real time on same project.

### Scaling

Support both horizontal and vertical scaling.
Provide the tools to manage a system at scale.

## Usage scenarios

- Single user on a device
- Team collaborating on single instance
- Team collaborating but developing locally
- Deploy to multiple devices or targets of different types
- Cloud hosted editor, multiple runtimes
- Hit deploy, test locally, push to remote git when ready
- Hit deploy, straight to running in production
- Push to remote, trigger CI that pushes to runtimes
- Push to remote, trigger CI that pushes to testing environment
- Promote flows from testing to production

## Feature: Projects

- A project is a set of files that represent a complete redistributable Node-RED app.

- The runtime runs a single project at any one time, but the editor proides a way to switch between projects

- A project exists locally on disk, but can be linked to a remote git repo

### Structure

A default project consists of:

- `flow.json`
- `package.json`
- `README.md`
- `settings.json`

Editor will provide facilities to edit each of these files in the right context

NOTE: Tecla5 will likely not use this approach, we don't want to be file centric, we use templates to generate end-user files from generic structures (nodes/flows) instead!

## Feature: Version control

- Allow a developer to take regular snapshots of their work and to revert back to previous versions

- Allow a team of developers to collaborate on a single set of flows in a controlled manner; each developing locally, but sharing changes and maintaining a history

### Issues

Node RED doesn't provide any integration with version control.
Manually merging Flow JSON output is not really an option.
A local developer's user data directory can quickly become litered with flow files
as they switch between projects

### Use cases

A developer wants to develop flows under proper version control and to commit versions of the flows and rollback to previous versions

A team of devs want to collaborate on a set of flows - each developing locally, using a shared git repo.

A developer wants to quickly switch between different sets of flows (projects)

## Feature: Library redesign

- Provide a more flexible library system within editor
- Allow different library sources to be added; from local file system, remote git repo etc.
- Allow a team of devs to share reusable assets, provide a common set of flows

### Issues

Current Library UX is limited. Stores flows on disk but cannot (easily) be shared.
Flow JSON can be imported/exported via clipboard manually.

## Feature: Split Editor/Runtime packaging

Split the packaging of node-red into:

- runtime
- editor
- nodes

## Feature: Subflow instance properties

- Enable the customisation of individual instances of a subflow, whilst retaining the common subflow template
- Building on that, a subflow can be saved to a library and can be versioned.
If the library copy is updated, the editor notifies the user and lets them substitute the updated version into their flow - with their customisations preserved

## Feature: Persistable context

- Provide an esternal API to enable external key/value store to be used to persist context variables withing a flow

- The current get/set context API is synchronous. Needs to map to an async API
- The get/set context API may need to be extended to support set of core atomic actions such as "increment value"

## Feature: Node messaging

- Currently if a node is passed a message, the runtime has no way to know when the node has finished processing the message
- We need to have better message handling, to let systems be assured message has been handled and not lost
- Update Node API so that it can notify that a message has been handled

## Feature: Pluggable routing

Mechanism by which messages are passed from one node to the next should be pluggable and enable the following:

- Flow Debugger: a router that allows break points to be set
- Custom low level logging
- Distributing flows across multiple runtimes
