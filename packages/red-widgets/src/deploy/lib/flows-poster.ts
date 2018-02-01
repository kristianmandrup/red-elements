import {
  Deploy
} from './'

import {
  Context,
  log,
  delegateTarget,
  delegator,
  container,
  FlowsApi
} from './_base'

export interface IFlowsPoster {
  /**
   *
   * @param data
   * @param opts
   */
  postFlows(data, opts): Promise<any>

}

@delegateTarget({
  container,
})
@delegator({
  container,
  map: {
    flowsApi: FlowsApi,
  }
})
export class FlowsPoster extends Context implements IFlowsPoster {
  protected flowsApi: FlowsApi

  constructor(public deploy: Deploy) {
    super()
  }

  /**
   *
   * @param data
   * @param opts
   */
  async postFlows(data, opts: any = {}) {
    const {
      rebind,
      nns,
      hasUnusedConfig
    } = opts

    const {
      flowsApi,
      headers,
    } = this

    const {
      onFlowsPostSuccess,
      onFlowsPostError,
      onFlowsPostFinally
    } = rebind([
        'onFlowsPostSuccess',
        'onFlowsPostError',
        'onFlowsPostFinally'
      ])

    flowsApi.configure({
      headers
    })

    try {
      const result = await flowsApi.create.one(data)
      onFlowsPostSuccess(result, {
        nns,
        hasUnusedConfig
      })
    } catch (error) {
      onFlowsPostError(error, {
        nns
      })
    } finally {
      onFlowsPostFinally()
    }
  }

  protected get headers() {
    return {
      'Node-RED-Deployment-Type': this.deploymentType
    }
  }

  get deploymentType() {
    return this.deploy.deploymentType
  }

  get deployInflight() {
    return this.deploy.deployInflight
  }

  set deployInflight(deployInflight) {
    this.deploy.deployInflight = deployInflight
  }


  protected onFlowsPostFinally(options: any = {}) {
    let {
    deployInflight
  } = this.deploy

    this.logInfo('Ajax always: cleanup')

    deployInflight = false;
    this.deployInflight = deployInflight

    $(".deploy-button-content").css('opacity', 1);
    $(".deploy-button-spinner").hide();
    $("#header-shade").hide();
    $("#editor-shade").hide();
    $("#palette-shade").hide();
    $("#sidebar-shade").hide();
  }

  protected onFlowsPostError(error, options: any = {}) {
    const {
    ctx
  } = this
    const {
    nns
  } = options

    const {
    resolveConflict
  } = this.rebind([
        'resolveConflict'
      ])

    const { xhr, textStatus, err } = error
    ctx.nodes.dirty(true);
    $("#btn-deploy").removeClass("disabled");
    if (xhr.status === 401) {
      ctx.notify(ctx._("deploy.deployFailed", {
        message: ctx._("user.notAuthorized")
      }), "error");
    } else if (xhr.status === 409) {
      resolveConflict(nns, true);
    } else if (xhr.responseText) {
      ctx.notify(ctx._("deploy.deployFailed", {
        message: xhr.responseText
      }), "error");
    } else {
      ctx.notify(ctx._("deploy.deployFailed", {
        message: ctx._("deploy.errors.noResponse")
      }), "error");
    }
  }

  protected onFlowsPostSuccess(data, options: any = {}) {
    const {
    ctx
  } = this
    const {
    nns,
      hasUnusedConfig
  } = options

    ctx.nodes.dirty(false);
    ctx.nodes.version(data.rev);
    ctx.nodes.originalFlow(nns);
    if (hasUnusedConfig) {
      ctx.notify(
        '<p>' + ctx._("deploy.successfulDeploy") + '</p>' +
        '<p>' + ctx._("deploy.unusedConfigNodes") + ' <a href="#" onclick="ctx.sidebar.config.show(true); return false;">' + ctx._("deploy.unusedConfigNodesLink") + '</a></p>', "success", false, 6000);
    } else {
      ctx.notify(ctx._("deploy.successfulDeploy"), "success");
    }
    ctx.nodes.eachNode(function (node) {
      if (node.changed) {
        node.dirty = true;
        node.changed = false;
      }
      if (node.moved) {
        node.dirty = true;
        node.moved = false;
      }
      if (node.credentials) {
        delete node.credentials;
      }
    });
    ctx.nodes.eachConfig(function (confNode) {
      confNode.changed = false;
      if (confNode.credentials) {
        delete confNode.credentials;
      }
    });
    ctx.nodes.eachWorkspace(function (ws) {
      ws.changed = false;
    })
    // Once deployed, cannot undo back to a clean state
    ctx.history.markAllDirty();
    ctx.view.redraw();
    ctx.events.emit("deploy");
  }
}
