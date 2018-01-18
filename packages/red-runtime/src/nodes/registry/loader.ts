/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import * as path from 'path'
import * as fs from 'fs'

import * as semver from 'semver'
import { Context } from '../../context/index';

import {
  Settings
} from '../../settings'

import {
  LocalFilesystem
} from './local-filesystem'

import {
  NodesRegistry
} from './nodes-registry'

/**
 * Loader to load Nodes
 */
export class Loader extends Context {

  // TODO: FIX - use service injection for Settings,
  protected runtime: any // don't rely on runtime
  protected settings: any = new Settings() // ISettings - inject as service
  protected registry: any = new NodesRegistry() // INodesRegistry - inject as service
  protected localfilesystem: any = new LocalFilesystem()
  protected events: any // TODO: - inject as service
  protected util: any // TODO: - inject as service
  protected version: any // TODO: - inject as service?
  protected nodes: any

  constructor() {
    super()
    this.runtime = this
  }

  /**
   * Loads node files with:
   * - node help ??
   * - node set lists
   * - ...
   *
   * @param defaultNodesDir
   * @param disableNodePathScan
   */
  load(defaultNodesDir, disableNodePathScan) {
    const {
      localfilesystem
    } = this
    const {
      loadNodeFiles,
      log
    } = this.rebind([
        'log',
        'loadNodeFiles'
      ])
    // To skip node scan, the following line will use the stored node list.
    // We should expose that as an option at some point, although the
    // performance gains are minimal.
    //return loadNodeFiles(registry.getModuleList());
    log.info(log._('server.loading'));

    var nodeFiles = localfilesystem.getNodeFiles(defaultNodesDir, disableNodePathScan);
    return loadNodeFiles(nodeFiles);
  }

  /**
   * Adds a module
   * @param module
   */
  async addModule(module): Promise<any> {
    const {
      localfilesystem
    } = this
    const {
      loadNodeFiles,
      log
    } = this.rebind([
        'log',
        'loadNodeFiles'
      ])

    if (!settings.available()) {
      throw new Error('Settings unavailable');
    }
    var nodes = [];
    if (registry.getModuleInfo(module)) {
      // TODO: nls
      const e: any = new Error('module_already_loaded');
      e.code = 'module_already_loaded';
      return Promise.reject(e);
    }
    try {
      var moduleFiles = localfilesystem.getModuleFiles(module);
      return loadNodeFiles(moduleFiles);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Loads the specified node into the runtime
   * @param node a node info object - see loadNodeConfig
   * @return a promise that resolves to an update node info object. The object
   *         has the following properties added:
   *            err: any error encountered whilst loading the node
   *
   */
  async loadNodeSet(node) {
    const {
      createNodeApi
    } = this.rebind([
        'createNodeApi'
      ])

    var nodeDir = path.dirname(node.file);
    var nodeFn = path.basename(node.file);
    if (!node.enabled) {
      return when.resolve(node);
    } else {
    }
    try {
      var loadPromise = null;
      var r = require(node.file);
      if (typeof r === 'function') {

        var red = createNodeApi(node);
        var promise = r(red);
        if (promise != null && typeof promise.then === 'function') {
          loadPromise = promise.then(function () {
            node.enabled = true;
            node.loaded = true;
            return node;
          }).otherwise(function (err) {
            node.err = err;
            return node;
          });
        }
      }
      if (loadPromise == null) {
        node.enabled = true;
        node.loaded = true;
        loadPromise = Promise.resolve(node);
      }
      return loadPromise;
    } catch (err) {
      node.err = err;
      var stack = err.stack;
      var message;
      if (stack) {
        var i = stack.indexOf(node.file);
        if (i > -1) {
          var excerpt = stack.substring(i + node.file.length + 1, i + node.file.length + 20);
          var m = /^(\d+):(\d+)/.exec(excerpt);
          if (m) {
            node.err = err + ' (line:' + m[1] + ')';
          }
        }
      }
      return Promise.resolve(node);
    }
  }

  /**
   * Retrieve node help
   * @param node
   * @param lang
   */
  getNodeHelp(node, lang) {
    const {
      loadNodeHelp,
      getNodeHelp
    } = this.rebind([
        'loadNodeHelp',
        'getNodeHelp'
      ])

    if (!node.help[lang]) {
      var help = loadNodeHelp(node, lang);
      if (help == null) {
        var langParts = lang.split('-');
        if (langParts.length == 2) {
          help = loadNodeHelp(node, langParts[0]);
        }
      }
      if (help) {
        node.help[lang] = help;
      } else if (lang === i18n.defaultLang) {
        return null;
      } else {
        node.help[lang] = getNodeHelp(node, i18n.defaultLang);
      }
    }
    return node.help[lang];
  }

  // protected

  /**
   * Loads node files
   * @param nodeFiles
   */
  protected async loadNodeFiles(nodeFiles) {
    const {
      runtime
    } = this

    const {
      loadNodeSetList,
      loadNodeConfig
    } = this.rebind([
        'loadNodeSetList',
        'loadNodeConfig'
      ])

    var promises = [];
    for (var module in nodeFiles) {
      /* istanbul ignore else */
      if (nodeFiles.hasOwnProperty(module)) {
        if (nodeFiles[module].redVersion &&
          !semver.satisfies(runtime.version().replace('-git', ''), nodeFiles[module].redVersion)) {
          //TODO: log it
          runtime.log.warn('[' + module + '] ' + runtime.log._('server.node-version-mismatch', { version: nodeFiles[module].redVersion }));
          continue;
        }
        if (module == 'node-red' || !registry.getModuleInfo(module)) {
          var first = true;
          for (var node in nodeFiles[module].nodes) {
            /* istanbul ignore else */
            if (nodeFiles[module].nodes.hasOwnProperty(node)) {
              if (module != 'node-red' && first) {
                // Check the module directory exists
                first = false;
                var fn = nodeFiles[module].nodes[node].file;
                var parts = fn.split('/');
                var i = parts.length - 1;
                for (; i >= 0; i--) {
                  if (parts[i] == 'node_modules') {
                    break;
                  }
                }
                var moduleFn = parts.slice(0, i + 2).join('/');

                try {
                  var stat = fs.statSync(moduleFn);
                } catch (err) {
                  // Module not found, don't attempt to load its nodes
                  break;
                }
              }

              try {
                promises.push(loadNodeConfig(nodeFiles[module].nodes[node]))
              } catch (err) {
                //
              }
            }
          }
        }
      }
    }
    return Promise.all(promises).then(function (results) {
      var nodes = results.map(function (r) {
        registry.addNodeSet(r.value.id, r.value, r.value.version);
        return r.value;
      });
      return loadNodeSetList(nodes);
    });
  }

  protected copyObjectProperties(src, dst, copyList, blockList) {
    if (!src) {
      return;
    }
    if (copyList && !blockList) {
      copyList.forEach(function (i) {
        if (src.hasOwnProperty(i)) {
          var propDescriptor = Object.getOwnPropertyDescriptor(src, i);
          Object.defineProperty(dst, i, propDescriptor);
        }
      });
    } else if (!copyList && blockList) {
      for (var i in src) {
        if (src.hasOwnProperty(i) && blockList.indexOf(i) === -1) {
          var propDescriptor = Object.getOwnPropertyDescriptor(src, i);
          Object.defineProperty(dst, i, propDescriptor);
        }
      }
    }
  }

  /**
   *
   * @param node Creates the Node API
   */
  protected createNodeApi(node) {
    const {
      nodes,
      events,
      util,
      version,
      runtime
    } = this
    const {
      copyObjectProperties
    } = this.rebind([
        'copyObjectProperties'
      ])

    const red: any = {
      nodes: {},
      log: {},
      settings: {},
      events,
      util,
      version,
    }
    copyObjectProperties(nodes, red.nodes, ['createNode', 'getNode', 'eachNode', 'addCredentials', 'getCredentials', 'deleteCredentials']);

    red.nodes.registerType = function (type, constructor, opts) {
      nodes.registerType(node.id, type, constructor, opts);
    }
    copyObjectProperties(log, red.log, null, ['init']);
    copyObjectProperties(settings, red.settings, null, ['init', 'load', 'reset']);
    if (runtime.adminApi) {
      red.comms = runtime.adminApi.comms;
      red.library = runtime.adminApi.library;
      red.auth = runtime.adminApi.auth;
      red.httpAdmin = runtime.adminApi.adminApp;
      red.httpNode = runtime.nodeApp;
      red.server = runtime.adminApi.server;
    } else {
      //TODO: runtime.adminApi is always stubbed if not enabled, so this block
      // is unused - but may be needed for the unit tests
      red.comms = {
        publish: function () { }
      };
      red.library = {
        register: function () { }
      };
      red.auth = {
        needsPermission: function () { }
      };
      // TODO: stub out httpAdmin/httpNode/server
    }
    red['_'] = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      if (args[0].indexOf(':') === -1) {
        args[0] = node.namespace + ':' + args[0];
      }
      return runtime.i18n._.apply(null, args);
    }
    return red;
  }

  /**
   * Loads a Noce configuration
   * @param fileInfo
   */
  async loadNodeConfig(fileInfo) {
    const {
      runtime
    } = this

    return when.promise(function (resolve) {
      var file = fileInfo.file;
      var module = fileInfo.module;
      var name = fileInfo.name;
      var version = fileInfo.version;

      var id = module + '/' + name;
      var info = registry.getNodeInfo(id);
      var isEnabled = true;
      if (info) {
        if (info.hasOwnProperty('loaded')) {
          throw new Error(file + ' already loaded');
        }
        isEnabled = info.enabled;
      }

      const node: any = {
        id: id,
        module: module,
        name: name,
        file: file,
        template: file.replace(/\.js$/, '.html'),
        enabled: isEnabled,
        loaded: false,
        version: version,
        local: fileInfo.local
      };
      if (fileInfo.hasOwnProperty('types')) {
        node.types = fileInfo.types;
      }

      fs.readFile(node.template, 'utf8', function (err, content) {
        if (err) {
          node.types = [];
          if (err.code === 'ENOENT') {
            if (!node.types) {
              node.types = [];
            }
            node.err = 'Error: ' + node.template + ' does not exist';
          } else {
            node.types = [];
            node.err = err.toString();
          }
          resolve(node);
        } else {
          var types = [];

          var regExp = /<script ([^>]*)data-template-name=['']([^'']*)['']/gi;
          var match = null;

          while ((match = regExp.exec(content)) !== null) {
            types.push(match[2]);
          }
          node.types = types;

          var langRegExp = /^<script[^>]* data-lang=[''](.+?)['']/i;
          regExp = /(<script[^>]* data-help-name=[\s\S]*?<\/script>)/gi;
          match = null;
          var mainContent = '';
          var helpContent = {};
          var index = 0;
          while ((match = regExp.exec(content)) !== null) {
            mainContent += content.substring(index, regExp.lastIndex - match[1].length);
            index = regExp.lastIndex;
            var help = content.substring(regExp.lastIndex - match[1].length, regExp.lastIndex);

            var lang = runtime.i18n.defaultLang;
            if ((match = langRegExp.exec(help)) !== null) {
              lang = match[1];
            }
            if (!helpContent.hasOwnProperty(lang)) {
              helpContent[lang] = '';
            }

            helpContent[lang] += help;
          }
          mainContent += content.substring(index);

          node.config = mainContent;
          node.help = helpContent;
          // TODO: parse out the javascript portion of the template
          //node.script = '';
          for (var i = 0; i < node.types.length; i++) {
            if (registry.getTypeId(node.types[i])) {
              node.err = node.types[i] + ' already registered';
              break;
            }
          }
          fs.stat(path.join(path.dirname(file), 'locales'), function (err, stat) {
            if (!err) {
              node.namespace = node.id;
              runtime.i18n.registerMessageCatalog(node.id,
                path.join(path.dirname(file), 'locales'),
                path.basename(file, '.js') + '.json')
                .then(function () {
                  resolve(node);
                });
            } else {
              node.namespace = node.module;
              resolve(node);
            }
          });
        }
      });
    });
  }


  /**
   * Loads a NodeSet list
   * @param nodes
   */
  protected loadNodeSetList(nodes) {
    const {
      loadNodeSet
    } = this.rebind([
        'loadNodeSet'
      ])

    var promises = [];
    nodes.forEach(function (node) {
      if (!node.err) {
        promises.push(loadNodeSet(node));
      } else {
        promises.push(node);
      }
    });

    return when.settle(promises).then(function () {
      if (settings.available()) {
        return registry.saveNodeList();
      } else {
        return;
      }
    });
  }



  protected loadNodeHelp(node, lang) {
    var dir = path.dirname(node.template);
    var base = path.basename(node.template);
    var localePath = path.join(dir, 'locales', lang, base);
    try {
      // TODO: make this async
      var content = fs.readFileSync(localePath, 'utf8')
      return content;
    } catch (err) {
      return null;
    }
  }
}
