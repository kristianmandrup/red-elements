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
  Context,
  $
} from '../../context'

const { log } = console
interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

import * as path from 'path'
import { DeployConfiguration } from './configuration';
import {
  FlowsSaver
} from './flows-saver'
import { Deployer } from './deployer';

const iconsPath = 'red/images/'

const icons = {
  deployFull: 'deploy-full-o.png',
  deployNodes: 'deploy-nodes-o.png',
  deployFlows: 'deploy-flows-o.png'
}

import {
  delegates,
  container,
  callDelegate
} from './container'

@delegates({
  container,
  map: {
    configuration: DeployConfiguration,
    flowsSaver: FlowsSaver,
    deployer: Deployer
  }
})
export class Deploy extends Context {
  /**
   * options:
   *   type: "default" - Button with drop-down options - no further customisation available
   *   type: "simple"  - Button without dropdown. Customisations:
   *      label: the text to display - default: "Deploy"
   *      icon : the icon to use. Null removes the icon. default: "red/images/deploy-full-o.png"
   */
  public type = 'default'
  public deploymentTypes = {
    full: {
      img: path.join(iconsPath, icons.deployFull)
    },
    nodes: {
      img: path.join(iconsPath, icons.deployNodes)
    },
    flows: {
      img: path.join(iconsPath, icons.deployFlows)
    }
  }
  public deploymentType = 'full'
  public deployInflight = false
  public currentDiff = null
  public lastDeployAttemptTime: Date = null
  public ignoreDeployWarnings = {
    unknown: false,
    unusedConfig: false,
    invalid: false
  }

  // injected services via delegates container!
  protected configuration: DeployConfiguration // = new DeployConfiguration(this)
  protected flowsSaver // = new FlowsSaver(this)
  protected deployer // = new Deployer(this)

  constructor(options: any = {}) {
    super()
    this.configure(options)
  }

  @callDelegate('configuration')
  configure(options) {
    // this.configuration.configure(options)
    // return this
  }

  changeDeploymentType(type) {
    let {
      deploymentType,
      deploymentTypes
    } = this

    const {
      setInstanceVars,
      handleError
    } = this.rebind([
        'setInstanceVars',
        'handleError'
      ], this)

    deploymentType = type;
    setInstanceVars({
      deploymentType
    })

    const $deploymentType = deploymentTypes[type]
    if (!$deploymentType) {
      handleError('no such deploymentType registered with image for icon', {
        deploymentTypes,
        type
      })
    }
    $("#btn-deploy-icon").attr("src", $deploymentType.img);
  }

  async saveFlows(skipValidation, force) {
    return await this.flowsSaver.saveFlows(skipValidation, force)
  }

  async deployNodes(nodes) {
    return await this.deployer.deployNodes(nodes)
  }

  getNodeInfo(node) {
    const {
      ctx
    } = this

    var tabLabel = "";
    if (node.z) {
      var tab = ctx.nodes.workspace(node.z);
      if (!tab) {
        tab = ctx.nodes.subflow(node.z);
        tabLabel = tab.name;
      } else {
        tabLabel = tab.label;
      }
    }
    var label = ctx.utils.getNodeLabel(node, node.id);
    return {
      tab: tabLabel,
      type: node.type,
      label: label
    };
  }

  /**
   * Resolve deploy conflict
   * @param currentNodes
   * @param activeDeploy
   */
  // TODO: handle error if any element required is not found on page
  resolveConflict(currentNodes, activeDeploy) {
    $("#node-dialog-confirm-deploy-config").hide();
    $("#node-dialog-confirm-deploy-unknown").hide();
    $("#node-dialog-confirm-deploy-unused").hide();
    $("#node-dialog-confirm-deploy-conflict").show();
    $("#node-dialog-confirm-deploy-type").val(activeDeploy ? "deploy-conflict" : "background-conflict");
    const confirmDeployDialog = <IDialog>$("#node-dialog-confirm-deploy")
    confirmDeployDialog.dialog("open");
    return this
  }
}
