import {
  Context,
  log,
  delegate,
  container,
} from './_base'

import {
  Deploy
} from './'

import { FlowsPoster } from './flows-poster';

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

@delegate({
  container,
})

export class FlowsSaver extends Context {
  protected flowsPoster: FlowsPoster
  protected flowsSaver: FlowsSaver

  constructor(public deploy: Deploy) {
    super()
  }

  async saveFlows(skipValidation, force) {
    let {
      RED,
      deployInflight,
      lastDeployAttemptTime,
      deploymentType,
      ignoreDeployWarnings,
    } = this.deploy

    const {
      getNodeInfo,
      sortNodeInfo,
      resolveConflict
    } = this.rebind([
        'getNodeInfo',
        'sortNodeInfo',
        'resolveConflict'
      ])

    if (!$("#btn-deploy").hasClass("disabled")) {
      log({
        skipValidation,
        force
      })

      this.deploy.lastDeployAttemptTime = new Date()

      log({
        lastDeployAttemptTime: this.deploy.lastDeployAttemptTime
      })

      if (!skipValidation) {
        log('deploy validation')
        var hasUnknown = false;
        var hasInvalid = false;
        var hasUnusedConfig = false;

        var unknownNodes = [];
        var invalidNodes = [];

        RED.nodes.eachNode(function (node) {
          hasInvalid = hasInvalid || !node.valid;
          if (!node.valid) {
            invalidNodes.push(getNodeInfo(node));
          }
          if (node.type === "unknown") {
            if (unknownNodes.indexOf(node.name) == -1) {
              unknownNodes.push(node.name);
            }
          }
        });
        log('iterated nodes')

        hasUnknown = unknownNodes.length > 0;

        var unusedConfigNodes = [];
        RED.nodes.eachConfig(function (node) {
          if (!node.users || node.users.length === 0 && (node._def.hasUsers !== false)) {
            unusedConfigNodes.push(getNodeInfo(node));
            hasUnusedConfig = true;
          }
        });
        log('iterated configs')

        $("#node-dialog-confirm-deploy-config").hide();
        $("#node-dialog-confirm-deploy-unknown").hide();
        $("#node-dialog-confirm-deploy-unused").hide();
        $("#node-dialog-confirm-deploy-conflict").hide();

        var showWarning = false;

        if (hasUnknown && !ignoreDeployWarnings.unknown) {
          log('show unknown', {
            hasUnknown,
            ignoreDeployWarnings
          })

          showWarning = true;
          $("#node-dialog-confirm-deploy-type").val("unknown");
          $("#node-dialog-confirm-deploy-unknown").show();
          $("#node-dialog-confirm-deploy-unknown-list")
            .html("<li>" + unknownNodes.join("</li><li>") + "</li>");
        } else if (hasInvalid && !ignoreDeployWarnings.invalid) {
          log('show invalid')
          showWarning = true;
          $("#node-dialog-confirm-deploy-type").val("invalid");
          $("#node-dialog-confirm-deploy-config").show();
          invalidNodes.sort(sortNodeInfo);
          $("#node-dialog-confirm-deploy-invalid-list")
            .html("<li>" + invalidNodes.map(function (A) {
              return (A.tab ? "[" + A.tab + "] " : "") + A.label + " (" + A.type + ")"
            }).join("</li><li>") + "</li>");

        } else if (hasUnusedConfig && !ignoreDeployWarnings.unusedConfig) {
          log('show unused config')
          // showWarning = true;
          // $( "#node-dialog-confirm-deploy-type" ).val("unusedConfig");
          // $( "#node-dialog-confirm-deploy-unused" ).show();
          //
          // unusedConfigNodes.sort(sortNodeInfo);
          // $( "#node-dialog-confirm-deploy-unused-list" )
          //     .html("<li>"+unusedConfigNodes.map(function(A) { return (A.tab?"["+A.tab+"] ":"")+A.label+" ("+A.type+")"}).join("</li><li>")+"</li>");
        }

        if (showWarning) {
          log('show warning')

          $("#node-dialog-confirm-deploy-hide").prop("checked", false);
          const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
          confirmDeployDialog.dialog("open");
          return;
        }

        log('deploy validation DONE')
      }

      var nns = RED.nodes.createCompleteNodeSet();

      var startTime = Date.now();
      $(".deploy-button-content").css('opacity', 0);
      $(".deploy-button-spinner").show();
      $("#btn-deploy").addClass("disabled");

      var data = {
        flows: nns,
        rev: null
      };

      if (!force) {
        log('not forced: use current version as revision number')
        data.rev = RED.nodes.version();
      }

      const deployer = this

      deployInflight = true;
      this.deploy.deployInflight = deployInflight

      $("#header-shade").show();
      $("#editor-shade").show();
      $("#palette-shade").show();
      $("#sidebar-shade").show();

      await this.postFlows(data, {
        nns,
        hasUnusedConfig
      })
    } else {
      this.logWarning('deploy-button disabled: not able to deploy via UI')
    }
  }

  async postFlows(data, opts) {
    return await this.flowsPoster.postFlows(data, opts)
  }

  sortNodeInfo(A, B) {
    if (A.tab < B.tab) {
      return -1;
    }
    if (A.tab > B.tab) {
      return 1;
    }
    if (A.type < B.type) {
      return -1;
    }
    if (A.type > B.type) {
      return 1;
    }
    if (A.name < B.name) {
      return -1;
    }
    if (A.name > B.name) {
      return 1;
    }
    return 0;
  }

}
