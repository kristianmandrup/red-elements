/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Logger
} from '../../log'

import {
  Settings
} from '../../settings'

import {
  Context
} from '../../context'

import {
  crypto
} from '../../_libs'

import { NodeCredentialsLoader } from './loader';
import { NodeCredentialsExporter } from './exporter';

export interface INodeCredentials {
  encryptedCredentials: any
  credentialCache: any
  credentialsDef: any
  removeDefaultKey: boolean
  encryptionEnabled: boolean
  encryptionAlgorithm: string
  encryptionKey: any
  log: Logger
  settings: Settings

  load(credentials: any): Promise<any>
  add(id: string, creds: any): INodeCredentials
  get(id: string): any
  delete(id: string): INodeCredentials
  clean(config: any): INodeCredentials
  register(type: string, definition: any): INodeCredentials
  export(): Promise<any>
  dirty: boolean
}

export class NodeCredentials extends Context implements INodeCredentials {
  protected _dirty = false;

  encryptedCredentials = null;
  credentialCache = {};
  credentialsDef = {};
  removeDefaultKey = false;
  encryptionEnabled = null;
  encryptionAlgorithm = "aes-256-ctr";
  encryptionKey;

  // TOODO: Fix - use service injection instead
  log: Logger = new Logger()
  settings: Settings = new Settings()

  protected loader: NodeCredentialsLoader = new NodeCredentialsLoader(this)
  protected exporter: NodeCredentialsExporter = new NodeCredentialsExporter(this)

  // use service injection instead
  constructor(runtime?: any) {
    super()
    let {
      dirty,
      credentialCache,
      credentialsDef,
      encryptionEnabled
    } = this

    dirty = false;
    credentialCache = {};
    credentialsDef = {};
    encryptionEnabled = null;

    this.setInstanceVars({
      dirty,
      credentialCache,
      credentialsDef,
      encryptionEnabled
    })
  }

  /**
   * Export credentials
   */
  async export(): Promise<any> {
    return await this.exporter.export()
  }

  /**
   * Adds a set of credentials for the given node id.
   * @param id the node id for the credentials
   * @param creds an object of credential key/value pairs
   */
  add(id: string, creds: any): INodeCredentials {
    const {
      credentialCache
    } = this
    let {
      _dirty
    } = this

    if (!credentialCache.hasOwnProperty(id) || JSON.stringify(creds) !== JSON.stringify(credentialCache[id])) {
      credentialCache[id] = creds;
      _dirty = true;
    }

    this.setInstanceVars({
      _dirty
    })
    return this
  }

  /**
   * Gets the credentials for the given node id.
   * @param id the node id for the credentials
   * @return the credentials
   */
  get(id: string): any {
    return this.credentialCache[id];
  }

  /**
   * Deletes the credentials for the given node id.
   * @param id the node id for the credentials
   * @return a promise for the deletion of credentials to storage ??
   */
  delete(id: string): INodeCredentials {
    delete this.credentialCache[id];
    this._dirty = true;
    return this
  }

  /**
   * Deletes any credentials for nodes that no longer exist
   * @param config a flow config
   * @return a promise for the saving of credentials to storage
   */
  clean(config: any): INodeCredentials {
    const {
      credentialCache,
    } = this
    let {
      dirty
    } = this
    const {
      markDirty,
      extract
    } = this.rebind([
        'markDirty',
        'extract'
      ])

    var existingIds = {};
    config.forEach((n) => {
      existingIds[n.id] = true;
      if (n.credentials) {
        extract(n);
      }
    });
    var deletedCredentials = false;
    for (var c in credentialCache) {
      if (credentialCache.hasOwnProperty(c)) {
        if (!existingIds[c]) {
          deletedCredentials = true;
          delete credentialCache[c];
        }
      }
    }
    if (deletedCredentials) {
      markDirty()
    }
    return this
  }

  /**
   * Registers a node credential definition.
   * @param type the node type
   * @param definition the credential definition
   */
  register(type: string, definition: any): INodeCredentials {
    const {
      credentialsDef
    } = this

    var dashedType = type.replace(/\s+/g, '-');
    credentialsDef[dashedType] = definition;
    return this
  }

  /**
   * Extracts and stores any credential updates in the provided node.
   * The provided node may have a .credentials property that contains
   * new credentials for the node.
   * This function loops through the credentials in the definition for
   * the node-type and applies any of the updates provided in the node.
   *
   * This function does not save the credentials to disk as it is expected
   * to be called multiple times when a new flow is deployed.
   *
   * @param node the node to extract credentials from
   */
  extract(node) {
    const {
      credentialsDef,
      credentialCache,
      log
    } = this

    const {
      markDirty
    } = this.rebind([
        'markDirty'
      ])

    var nodeID = node.id;
    var nodeType = node.type;
    var newCreds = node.credentials;
    if (newCreds) {
      delete node.credentials;
      var savedCredentials = credentialCache[nodeID] || {};
      var dashedType = nodeType.replace(/\s+/g, '-');
      var definition = credentialsDef[dashedType];
      if (!definition) {
        log.warn(log._("nodes.credentials.not-registered", {
          type: nodeType
        }));
        return;
      }

      for (var cred in definition) {
        if (definition.hasOwnProperty(cred)) {
          if (newCreds[cred] === undefined) {
            continue;
          }
          if (definition[cred].type == "password" && newCreds[cred] == '__PWRD__') {
            continue;
          }
          if (0 === newCreds[cred].length || /^\s*$/.test(newCreds[cred])) {
            delete savedCredentials[cred];
            markDirty()
            continue;
          }
          if (!savedCredentials.hasOwnProperty(cred) || JSON.stringify(savedCredentials[cred]) !== JSON.stringify(newCreds[cred])) {
            savedCredentials[cred] = newCreds[cred];
            markDirty()
          }
        }
      }
      credentialCache[nodeID] = savedCredentials;
    }
  }

  /**
   * Sets the credentials from storage.
   * Loads asynchronously
   */
  async load(credentials: any): Promise<any> {
    this.loader.load(credentials)
  }

  /**
   * Gets the credential definition for the given node type
   * @param type the node type
   * @return the credential definition
   */
  getDefinition(type) {
    return this.credentialsDef[type];
  }

  get dirty(): boolean {
    return this._dirty;
  }

  protected markDirty() {
    this._dirty = true
  }

  protected markClean() {
    this._dirty = false
  }

}
