import {
    Context
} from '../../../../red-runtime/src/context'

import { Main } from "./index";
import { NodesApi } from '@tecla5/red-runtime/src/api/nodes-api';
import { FlowsApi } from '@tecla5/red-runtime/src/api/flows-api';
import { RedApi } from '@tecla5/red-runtime/src/api/red-api';

interface IBody extends JQuery<HTMLElement> {
    i18n: Function
}

export class loadNode extends Context {
    loaded: any = {}

    // TODO: perhaps just use generic redApi for each?
    protected nodesApi: NodesApi
    protected flowsApi: FlowsApi
    protected api: RedApi

    constructor(public main: Main) {
        super()
    }

    /**
   * Load nodes list
   */
    async loadNodeList() {
        let {
            nodesApi,
            onLoadNodeListSuccess,
            onLoadNodeListError
            } = this.rebind(['nodesApi'], this)

        nodesApi = new NodesApi()

        try {
            const result = await nodesApi.load()
            onLoadNodeListSuccess(result)
        } catch (error) {
            onLoadNodeListError(error)
        }
    }

    /**
     * Update nodea and node catalogs with loaded nodes
     * @param data { Array } the list of nodes loaded
     */
    onLoadNodeListSuccess(data) {
        const { RED, loadNodes } = this

        RED.nodes.setNodeList(data);
        RED.i18n.loadNodeCatalogs(loadNodes);
        this.loaded.nodeList = {
            time: new Date()
        }
    }

    /**
     * Handle error on loading nodes list
     * @param error
     */
    onLoadNodeListError(error) {
        this.handleError('loadNodeList', {
            error
        })
    }

    async loadNodes() {
        const {
            nodesApi,
            onLoadNodesSuccess,
            onLoadNodesError
            } = this

        this.nodesApi = new NodesApi()

        try {
            const result = await nodesApi.load()
            onLoadNodesSuccess(result)
        } catch (error) {
            onLoadNodesError(error)
        }
    }

    onLoadNodesSuccess(data) {
        let body = <IBody>$('body').append(data);
        body.i18n();
        $('#palette > .palette-spinner').hide();
        $('.palette-scroll').removeClass('hide');
        $('#palette-search').removeClass('hide');
        this.loadFlows();
        this.loaded.nodes = {
            time: new Date()
        }
    }
    onLoadNodesError(error) {
        this.handleError('loadNodes', {
            error
        })
    }

    async loadFlows() {
        const {
          RED
        } = this.main
        const { nodes } = RED

        const {
          flowsApi,
            onLoadFlowsSuccess,
            onLoadFlowsError
        } = this

        this.flowsApi = new FlowsApi()

        try {
            const result = await flowsApi.load()
            onLoadFlowsSuccess(result)
        } catch (error) {
            onLoadFlowsError(error)
        }
    }

    onLoadFlowsError(error) {
    }

    onLoadFlowsSuccess(nodes) {
        const {
        RED
      } = this.main

        var currentHash = window.location.hash;
        nodes.version(nodes.rev);
        nodes.import(nodes.flows);
        nodes.dirty(false);
        RED.view.redraw(true);
        if (/^#flow\/.+$/.test(currentHash)) {
            RED.workspaces.show(currentHash.substring(6));
        }

        this.loaded.flows = {
            time: new Date()
        }

        var persistentNotifications = {};
        RED.comms.subscribe('notification/#', function (topic, msg) {
            var parts = topic.split('/');
            var notificationId = parts[1];
            if (notificationId === 'runtime-deploy') {
                // handled in ui/deploy.js
                return;
            }
            if (notificationId === 'node') {
                // handled below
                return;
            }
            if (msg.text) {
                var text = RED._(msg.text, {
                    default: msg.text
                });
                if (!persistentNotifications.hasOwnProperty(notificationId)) {
                    persistentNotifications[notificationId] = RED.notify(text, msg.type, msg.timeout === undefined, msg.timeout);
                } else {
                    persistentNotifications[notificationId].update(text, msg.timeout);
                }
            } else if (persistentNotifications.hasOwnProperty(notificationId)) {
                persistentNotifications[notificationId].close();
                delete persistentNotifications[notificationId];
            }
        });
        RED.comms.subscribe('status/#', function (topic, msg) {
            var parts = topic.split('/');
            var node = RED.nodes.node(parts[1]);
            if (node) {
                if (msg.hasOwnProperty('text')) {
                    if (msg.text[0] !== '.') {
                        msg.text = node._(msg.text.toString(), {
                            defaultValue: msg.text.toString()
                        });
                    }
                }
                node.status = msg;
                node.dirty = true;
                RED.view.redraw();
            }
        });
        RED.comms.subscribe('notification/node/#', function (topic, msg) {
            var i, m;
            var typeList;
            var info;
            if (topic == 'notification/node/added') {
                var addedTypes = [];
                msg.forEach(function (m) {
                    var id = m.id;
                    RED.nodes.addNodeSet(m);
                    addedTypes = addedTypes.concat(m.types);
                    RED.i18n.loadCatalog(id, function () {
                        $.get('nodes/' + id, function (data) {
                            $('body').append(data);
                        });
                    });
                });
                if (addedTypes.length) {
                    typeList = '<ul><li>' + addedTypes.join('</li><li>') + '</li></ul>';
                    RED.notify(RED._('palette.event.nodeAdded', {
                        count: addedTypes.length
                    }) + typeList, 'success');
                }
            } else if (topic == 'notification/node/removed') {
                for (i = 0; i < msg.length; i++) {
                    m = msg[i];
                    info = RED.nodes.removeNodeSet(m.id);
                    if (info.added) {
                        typeList = '<ul><li>' + m.types.join('</li><li>') + '</li></ul>';
                        RED.notify(RED._('palette.event.nodeRemoved', {
                            count: m.types.length
                        }) + typeList, 'success');
                    }
                }
            } else if (topic == 'notification/node/enabled') {
                if (msg.types) {
                    info = RED.nodes.getNodeSet(msg.id);
                    if (info.added) {
                        RED.nodes.enableNodeSet(msg.id);
                        typeList = '<ul><li>' + msg.types.join('</li><li>') + '</li></ul>';
                        RED.notify(RED._('palette.event.nodeEnabled', {
                            count: msg.types.length
                        }) + typeList, 'success');
                    } else {
                        $.get('nodes/' + msg.id, function (data) {
                            $('body').append(data);
                            typeList = '<ul><li>' + msg.types.join('</li><li>') + '</li></ul>';
                            RED.notify(RED._('palette.event.nodeAdded', {
                                count: msg.types.length
                            }) + typeList, 'success');
                        });
                    }
                }
            } else if (topic == 'notification/node/disabled') {
                if (msg.types) {
                    RED.nodes.disableNodeSet(msg.id);
                    typeList = '<ul><li>' + msg.types.join('</li><li>') + '</li></ul>';
                    RED.notify(RED._('palette.event.nodeDisabled', {
                        count: msg.types.length
                    }) + typeList, 'success');
                }
            } else if (topic == 'node/upgraded') {
                RED.notify(RED._('palette.event.nodeUpgraded', {
                    module: msg.module,
                    version: msg.version
                }), 'success');
                RED.nodes.registry.setModulePendingUpdated(msg.module, msg.version);
            }
            // Refresh flow library to ensure any examples are updated
            RED.library.loadFlowLibrary();
        });
    }
}