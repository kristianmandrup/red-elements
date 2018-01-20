import {
  BaseApi
} from './base-api'

export class DeployApi extends BaseApi {
  basePath = 'deploy'

  constructor(config: any) {
    super(config)
  }

  post(data) {
    // TODO:
    // - add callback option to config for function to build Ajax object to override props on default for method
    // - also add option to take a headers argument (such as Deploy having a customHeaders getter)

    $.ajax(ajaxConfig).done(function (data, textStatus, xhr) {
      this.onSuccess(data)

    }).fail(function (xhr, textStatus, err) {
      // TODO: Handle by Deploy class
      this.onFail(err)

    }).always(function () {
      this.cleanup()
    });
  }

  // TODO: move to Deploy class
  cleanup() {
    log('Ajax always: cleanup')

    deployInflight = false;
    deployer.deployInflight = deployInflight
    var delta = Math.max(0, 300 - (Date.now() - startTime));
    setTimeout(function () {
      $('.deploy-button-content').css('opacity', 1);
      $('.deploy-button-spinner').hide();
      $('#header-shade').hide();
      $('#editor-shade').hide();
      $('#palette-shade').hide();
      $('#sidebar-shade').hide();
    }, delta);
  }

  // TODO: move to Deploy class
  onSuccess(data) {
    // TODO: Handle by Deploy class

    ctx.nodes.dirty(false);
    ctx.nodes.version(data.rev);
    ctx.nodes.originalFlow(nns);
    if (hasUnusedConfig) {
      ctx.notify(
        '<p>' + ctx._('deploy.successfulDeploy') + '</p>' +
        '<p>' + ctx._('deploy.unusedConfigNodes') + ' <a href="#" onclick="ctx.sidebar.config.show(true); return false;">' + ctx._('deploy.unusedConfigNodesLink') + '</a></p>', 'success', false, 6000);
    } else {
      ctx.notify(ctx._('deploy.successfulDeploy'), 'success');
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
    ctx.events.emit('deploy');
  }

  // TODO: move to Deploy class
  onFail(error) {
    log('Ajax fail', {
      err
    })
    ctx.nodes.dirty(true);
    $('#btn-deploy').removeClass('disabled');
    if (xhr.status === 401) {
      ctx.notify(ctx._('deploy.deployFailed', {
        message: ctx._('user.notAuthorized')
      }), 'error');
    } else if (xhr.status === 409) {
      resolveConflict(nns, true);
    } else if (xhr.responseText) {
      ctx.notify(ctx._('deploy.deployFailed', {
        message: xhr.responseText
      }), 'error');
    } else {
      ctx.notify(ctx._('deploy.deployFailed', {
        message: ctx._('deploy.errors.noResponse')
      }), 'error');
    }
  }
}

