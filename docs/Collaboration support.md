# Collaboration

[automerge](https://github.com/automerge)

Automerge is a library of data structures for building collaborative applications in JavaScript.

Automerge supports *automatic syncing and merging*:

You can have a copy of the application state locally on several devices (which may belong to the same user, or to different users). Each user can independently update the application state on their local device, even while offline, and save the state to local disk.

(Similar to git, which allows you to edit files and commit changes offline.)

When a network connection is available, Automerge figures out which changes need to be synced from one device to another, and brings them into the same state.

(Similar to git, which lets you push your own changes, and pull changes from other developers, when you are online.)

If the state was concurrently changed on different devices, Automerge automatically merges the changes together cleanly, so that everybody ends up in the same state, and no changes are lost.

*Different from git: no merge conflicts to resolve!*
