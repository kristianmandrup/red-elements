import {
  Deploy,
  Context,
  log,
  delegateTarget,
  container,

  lazyInject,
  $TYPES
} from '../_base'

import {
  IActions,
  INodeDiff,
  I18n,
  // IMenu,
  // IEvents,
  // IKeyboard,
  // ICanvas
} from '../../_interfaces'

import {
  INodes
} from '@tecla5/red-runtime'

const TYPES = $TYPES.all

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export interface IDeployConfiguration {
  configure(options: any)
}

@delegateTarget()
export class DeployConfiguration extends Context implements IDeployConfiguration {
  @lazyInject(TYPES.nodes) nodes: INodes
  @lazyInject(TYPES.actions) actions: IActions
  @lazyInject(TYPES.nodeDiff) diff: INodeDiff
  @lazyInject(TYPES.i18n) i18n: I18n

  constructor(public deploy: Deploy) {
    super()
  }

  configure(options: any = {}) {
    // the reference to injected Nodes service instance (singleton)
    const {
      rebind,
      deploy,

      // services injected
      nodes,
      actions,
      diff
    } = this

    const {
      changeDeploymentType,
      save,
      resolveConflict
  } = rebind([
        'changeDeploymentType',
        'save',
        'resolveConflict'
      ], deploy)

    let {
      type,
      currentDiff,
      deployInflight,
      ignoreDeployWarnings,
      RED
    } = this.deploy

    options = options || {};
    type = options.type || type

    // TODO: use setInstanceVars
    this.deploy.type = type

    if (type == 'default') {
      this.configureDefault()
    } else if (type == "simple") {
      this.configureSimple(options)
    }

    $('#btn-deploy').click(function (event) {
      event.preventDefault();
      save();
    });

    actions.add("core:deploy-flows", save);

    const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
    confirmDeployDialog.dialog({
      title: i18n.t'deploy.confirm.button.confirm'),
      modal: true,
        autoOpen: false,
          width: 550,
            height: "auto",
              buttons: [{
                text: i18n.t"common.label.cancel"),
                click: function () {
                  confirmDeployDialog.dialog("close");
                }
      },
      {
  id: "node-dialog-confirm-deploy-review",
    text: i18n.t"deploy.confirm.button.review"),
  class: "primary disabled",
    click: function () {
      if (!$("#node-dialog-confirm-deploy-review").hasClass('disabled')) {
        diff.showRemoteDiff();
        confirmDeployDialog.dialog("close");
      }
    }
},
{
  id: "node-dialog-confirm-deploy-merge",
    text: i18n.t"deploy.confirm.button.merge"),
  class: "primary disabled",
    click: function () {
      diff.mergeDiff(currentDiff);
      confirmDeployDialog.dialog("close");
    }
},
{
  id: "node-dialog-confirm-deploy-deploy",
    text: i18n.t"deploy.confirm.button.confirm"),
  class: "primary",
    click: function () {
      const deployType = <string>$("#node-dialog-confirm-deploy-type").val()
      var ignoreChecked = $("#node-dialog-confirm-deploy-hide").prop("checked");
      if (ignoreChecked) {
        ignoreDeployWarnings[deployType] = true;
      }
      save(true, /conflict/.test(deployType));
      confirmDeployDialog.dialog("close");
    }
},
{
  id: "node-dialog-confirm-deploy-overwrite",
    text: i18n.t"deploy.confirm.button.overwrite"),
  class: "primary",
    click: function () {
      const deployType = <string>$("#node-dialog-confirm-deploy-type").val()
      save(true, /conflict/.test(deployType));
      confirmDeployDialog.dialog("close");
    }
}
      ],
create: () => {
  log('confirmDeployDialog: create')
  this.createConfirmDeployDialog()
},
  open: () => {
    log('confirmDeployDialog: open')

    const deployType = <string>$("#node-dialog-confirm-deploy-type").val();
    if (/conflict/.test(deployType)) {
      this.openDeploymentConflictDialog(deployType, currentDiff)

    } else {
      this.openDeploymentDialog()
    }
  }
    });

events.on('nodes:change', function (state) {
  if (state.dirty) {
    window.onbeforeunload = function () {
      return i18n.t"deploy.confirm.undeployedChanges");
        }
$("#btn-deploy").removeClass("disabled");
      } else {
  window.onbeforeunload = null;
  $("#btn-deploy").addClass("disabled");
}
    });

var activeNotifyMessage;
comms.subscribe("notification/runtime-deploy", function (topic, msg) {
  if (!activeNotifyMessage) {
    var currentRev = nodes.version
    if (currentRev === null || deployInflight || currentRev === msg.revision) {
      return;
    }
    var message = $('<div>' + i18n.t'deploy.confirm.backgroundUpdate') +
      '<br><br><div class="ui-dialog-buttonset">' +
      '<button>' + i18n.t'deploy.confirm.button.ignore') + '</button>' +
  '<button class="primary">' + i18n.t'deploy.confirm.button.review') + '</button>' +
    '</div></div>');
$(message.find('button')[0]).click(function (evt) {
  evt.preventDefault();
  activeNotifyMessage.close();
  activeNotifyMessage = null;
})
$(message.find('button')[1]).click(function (evt) {
  evt.preventDefault();
  activeNotifyMessage.close();
  var nns = nodes.createCompleteNodeSet();
  resolveConflict(nns, false);
  activeNotifyMessage = null;
})
activeNotifyMessage = notify(message, null, true);
      }
    });
  }

// protected ?

openDeploymentDialog() {
  const {
      RED
    } = this

  const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
  confirmDeployDialog.dialog('option', 'title', i18n.t'deploy.confirm.button.confirm'));

  $("#node-dialog-confirm-deploy-deploy").show();
  $("#node-dialog-confirm-deploy-overwrite").hide();
  $("#node-dialog-confirm-deploy-review").hide();
  $("#node-dialog-confirm-deploy-merge").hide();
  $("#node-dialog-confirm-deploy-hide").parent().show();
}

openDeploymentConflictDialog(deployType, currentDiff) {
  const {
      RED
    } = this

  this.openConfirmDeployDialog(deployType)
  currentDiff = null;

  var now = Date.now();
  diff.getRemoteDiff(function (diff) {
    var ellapsed = Math.max(1000 - (Date.now() - now), 0);
    currentDiff = diff;
    setTimeout(function () {
      $("#node-dialog-confirm-deploy-conflict-checking").hide();
      var d = Object.keys(diff.conflicts);
      if (d.length === 0) {
        $("#node-dialog-confirm-deploy-conflict-auto-merge").show();
        $("#node-dialog-confirm-deploy-merge").removeClass('disabled')
      } else {
        $("#node-dialog-confirm-deploy-conflict-manual-merge").show();
      }
      $("#node-dialog-confirm-deploy-review").removeClass('disabled')
    }, ellapsed);
  })


  $("#node-dialog-confirm-deploy-hide").parent().hide()
}

configureSimple(options) {
  const {
    RED
  } = this

  var label = options.label || i18n.t"deploy.deploy");
  var icon = 'red/images/deploy-full-o.png';
  if (options.hasOwnProperty('icon')) {
    icon = options.icon;
  }

  this.addDeployButtonsToToolbar(icon, label)
}

openConfirmDeployDialog(deployType) {
  const {
      RED
    } = this

  const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
  confirmDeployDialog.dialog('option', 'title', i18n.t'deploy.confirm.button.review'));
  $("#node-dialog-confirm-deploy-deploy").hide();
  $("#node-dialog-confirm-deploy-review").addClass('disabled').show();
  $("#node-dialog-confirm-deploy-merge").addClass('disabled').show();
  $("#node-dialog-confirm-deploy-overwrite").toggle(deployType === "deploy-conflict");
  $("#node-dialog-confirm-deploy-conflict-checking").show();
  $("#node-dialog-confirm-deploy-conflict-auto-merge").hide();
  $("#node-dialog-confirm-deploy-conflict-manual-merge").hide();
}

createConfirmDeployDialog() {
  return $("#node-dialog-confirm-deploy").parent().find("div.ui-dialog-buttonpane")
    .prepend('<div style="height:0; vertical-align: middle; display:inline-block; margin-top: 13px; float:left;">' +
    '<input style="vertical-align:top;" type="checkbox" id="node-dialog-confirm-deploy-hide"> ' +
    '<label style="display:inline;" for="node-dialog-confirm-deploy-hide" data-i18n="deploy.confirm.doNotWarn"></label>' +
    '<input type="hidden" id="node-dialog-confirm-deploy-type">' +
    '</div>');
}

addDeployButtonsToToolbar(icon, label) {
  $('<li><span class="deploy-button-group button-group">' +
    '<a id="btn-deploy" class="deploy-button disabled" href="#">' +
    '<span class="deploy-button-content">' +
    (icon ? '<img id="btn-deploy-icon" src="' + icon + '"> ' : '') +
    '<span>' + label + '</span>' +
    '</span>' +
    '<span class="deploy-button-spinner hide">' +
    '<img src="red/images/spin.svg"/>' +
    '</span>' +
    '</a>' +
    '</span></li>').prependTo(".header-toolbar");
}


configureDefault() {
  const {
    RED
  } = this
  const {
    changeDeploymentType
  } = this.rebind([
      'changeDeploymentType'
    ])

  this.createHeaderToolbar()

  menu.init({
    id: "btn-deploy-options",
    options: [{
      id: "deploymenu-item-full",
      toggle: "deploy-type",
      icon: "red/images/deploy-full.png",
      label: i18n.t"deploy.full"),
    sublabel: i18n.t"deploy.fullDesc"),
  selected: true,
    onselect: function (s) {
      if (s) {
        changeDeploymentType("full")
      }
    }
},
{
  id: "deploymenu-item-flow",
    toggle: "deploy-type",
      icon: "red/images/deploy-flows.png",
        label: i18n.t"deploy.modifiedFlows"),
  sublabel: i18n.t"deploy.modifiedFlowsDesc"),
  onselect: function (s) {
    if (s) {
      changeDeploymentType("flows")
    }
  }
},
{
  id: "deploymenu-item-node",
    toggle: "deploy-type",
      icon: "red/images/deploy-nodes.png",
        label: i18n.t"deploy.modifiedNodes"),
  sublabel: i18n.t"deploy.modifiedNodesDesc"),
  onselect: function (s) {
    if (s) {
      changeDeploymentType("nodes")
    }
  }
}
      ]
    });
  }

createHeaderToolbar() {
  const {
    RED
  } = this
  $('<li><span class="deploy-button-group button-group">' +
    '<a id="btn-deploy" class="deploy-button disabled" href="#">' +
    '<span class="deploy-button-content">' +
    '<img id="btn-deploy-icon" src="red/images/deploy-full-o.png"> ' +
    '<span>' + i18n.t"deploy.deploy") + '</span>' +
    '</span>' +
    '<span class="deploy-button-spinner hide">' +
    '<img src="red/images/spin.svg"/>' +
    '</span>' +
    '</a>' +
    '<a id="btn-deploy-options" data-toggle="dropdown" class="deploy-button" href="#"><i class="fa fa-caret-down"></i></a>' +
    '</span></li>').prependTo(".header-toolbar");
}
}
