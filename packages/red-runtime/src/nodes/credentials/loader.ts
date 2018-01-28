import {
  Context
} from '../../context'

import {
  crypto
} from '../../_libs'

import {
  NodeCredentials,
  INodeCredentials
} from './'

export interface INodeCredentialsLoader {
  /**
   * Sets the credentials from storage.
   * Loads asynchronously
   */
  load(credentials: any): Promise<any>
}

export class NodeCredentialsLoader extends Context implements INodeCredentialsLoader {
  constructor(public nodeCredentials: INodeCredentials) {
    super()
  }

  /**
   * Sets the credentials from storage.
   * Loads asynchronously
   */
  async load(credentials: any): Promise<any> {
    const {
      nodeCredentials,
      rebind,
      _decryptCredentials
    } = this
    const {
      log,
      settings,
    } = nodeCredentials
    let {
      encryptedCredentials,
      encryptionKey,
      removeDefaultKey,
      encryptionEnabled,
      dirty,
      credentialCache
    } = nodeCredentials

    const {
      markClean,
      markDirty,
      decryptCredentials
    } = rebind([
        'markClean',
        'markDirty',
        'decryptCredentials'
      ], nodeCredentials)

    markClean()
    /*
      - if encryptionEnabled === null, check the current configuration
    */
    var credentialsEncrypted = credentials.hasOwnProperty("$") && Object.keys(credentials).length === 1;

    // TODO: use native Promise via async/await instead!
    let setupEncryption = null

    if (encryptionEnabled === null) {
      var defaultKey;
      try {
        defaultKey = settings.get('_credentialSecret');
      } catch (err) { }
      if (defaultKey) {
        defaultKey = crypto.createHash('sha256').update(defaultKey).digest();
      }
      var userKey;
      try {
        userKey = settings.get('credentialSecret');
      } catch (err) {
        userKey = false;
      }
      if (userKey === false) {
        log.debug("red/runtime/nodes/credentials.load : user disabled encryption");
        // User has disabled encryption
        encryptionEnabled = false;
        // Check if we have a generated _credSecret to decrypt with and remove
        if (defaultKey) {
          log.debug("red/runtime/nodes/credentials.load : default key present. Will migrate");
          if (credentialsEncrypted) {
            try {
              credentials = _decryptCredentials(defaultKey, credentials)
            } catch (err) {
              credentials = {};
              log.warn(log._("nodes.credentials.error", {
                message: err.toString()
              }))
            }
          }
          markDirty()
          removeDefaultKey = true;
        }
      } else if (typeof userKey === 'string') {
        log.debug("red/runtime/nodes/credentials.load : user provided key");
        // User has provided own encryption key, get the 32-byte hash of it
        encryptionKey = crypto.createHash('sha256').update(userKey).digest();
        encryptionEnabled = true;

        if (defaultKey) {
          log.debug("red/runtime/nodes/credentials.load : default key present. Will migrate");
          // User has provided their own key, but we already have a default key
          // Decrypt using default key
          if (credentialsEncrypted) {
            try {
              credentials = _decryptCredentials(defaultKey, credentials)
            } catch (err) {
              credentials = {};
              log.warn(log._("nodes.credentials.error", {
                message: err.toString()
              }))
            }
          }
          dirty = true;
          removeDefaultKey = true;
        }
      } else {
        log.debug("red/runtime/nodes/credentials.load : no user key present");
        // User has not provide their own key
        encryptionKey = defaultKey;
        encryptionEnabled = true;
        if (encryptionKey === undefined) {
          log.debug("red/runtime/nodes/credentials.load : no default key present - generating one");
          // No user-provided key, no generated key
          // Generate a new key
          defaultKey = crypto.randomBytes(32).toString('hex');
          try {
            setupEncryption = settings.set('_credentialSecret', defaultKey);
            encryptionKey = crypto.createHash('sha256').update(defaultKey).digest();
          } catch (err) {
            log.debug("red/runtime/nodes/credentials.load : settings unavailable - disabling encryption");
            // Settings unavailable
            encryptionEnabled = false;
            encryptionKey = null;
          }
          dirty = true;
        } else {
          log.debug("red/runtime/nodes/credentials.load : using default key");
        }
      }
    }
    if (encryptionEnabled && !dirty) {
      encryptedCredentials = credentials;
    }

    await setupEncryption()

    if (credentials.hasOwnProperty("$")) {
      // These are encrypted credentials
      try {
        credentialCache = decryptCredentials(encryptionKey, credentials)
      } catch (err) {
        credentialCache = {};
        markDirty();
        log.warn(log._("nodes.credentials.error", {
          message: err.toString()
        }))

      }
    } else {
      credentialCache = credentials;
    }
  }

  protected _decryptCredentials(key, credentials) {
    const {
      encryptionAlgorithm
    } = this.nodeCredentials

    var creds = credentials["$"];
    var initVector = new Buffer(creds.substring(0, 32), 'hex');
    creds = creds.substring(32);
    var decipher = crypto.createDecipheriv(encryptionAlgorithm, key, initVector);
    var decrypted = decipher.update(creds, 'base64', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
