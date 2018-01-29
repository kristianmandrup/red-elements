# Node RED v2

## UI/UX feature requirements

## Main models

- user sessions
- projects
- environments
- workspaces
- flows
- nodes
- teams
- users

### Settings

- project settings
- environment settings
- workspace settings

Each settings level will inherit settings from more general level, that it can then override

## Main UI elements

- Canvas
- Palette (of elements to add to canvas: typically nodes or flows)
- Node Editor
- Run Display (console) (show results from running a flow)
- Libraries (of reusable palette elements)

### User sessions

- User sessions via social login using [0Auth](https://oauth.io/)
  - Github
  - Google
  - Facebook
  - Twitter

### Projects

- New project
- Edit project
- Delete project
- Share project

#### Project

- name
- version
- description
- ...

A project can contain one or more environments.
A new project contains a default environment:

- name: `default`
- type: `development`

### Environments

- New environment
- Edit environment
- Delete environment
- Share environment

#### Environment

- name
- type
- version
- description
- ...

An environment can contain one or more workspaces.
A new environment contains one default workspace:

- name: `my workspace`

### Workspaces

- New workspace
- Edit workspace
- Delete workspace
- Share workspace

Workspaces are (traditionally) shown as tabs on the canvas. We need to change this to be more scalable and flexible.

operations:

- Add/remove flow
- Add/remove node

#### Workspace

- name
- version
- description
- ...

### Teams

- New team
- Edit team
- Delete team

Operations:

- Add user to team
- Remove user from team
- Add team to team
- Remove team from team
- Add team to project, environment or workspace
- Remove team from project, environment or workspace

#### Team

- name
- main role (from set of roles)
- version
- description
- ...
- users: User[]

### Users

- New user
- Edit user
- Delete user

#### User

- name
- role (default role from set of roles)
- version
- description
- ...
- users: User[]

A user can be added to one or more containers such as a team, project etc.
The user is added as a new instance and can change his role for that instance.

### Flows

#### Flow

- name
- version
- description

Do we still need the concept of subflows? A flow is a Node, and can always be reused as such

### Nodes

- Add node to flow (canvas)
- Remove node from flow (canvas)
- Edit node (via Node Editor)

#### Node

- name
- version
- description

