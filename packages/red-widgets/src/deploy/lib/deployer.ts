import {
  Deploy
} from './'

import {
  Context,
  log,
  delegateTarget,
  container,
  DeploymentsApi
} from './_base'

@delegateTarget({
  container,
  // key: 'Deployer'
})
export class Deployer extends Context {
  protected deployApi: DeploymentsApi

  constructor(public deploy: Deploy) {
    super()
  }

  async deployNodes(nodes) {
    const {
    onDeployError,
      onDeploySuccess,
      onDeployFinally
  } = this

    const data = {
      project: 'my-project',
      environments: ['dev', 'test'],
      user: {
        'email': 'javier@gmail.com'
      },
      nodes
    }

    try {
      const result = await this.deployApi.create.one(data)
      this.onDeploySuccess(result)
    } catch (error) {
      onDeployError(error)
    } finally {
      onDeployFinally()
    }
  }

  /**
   *
   * @param data
   */
  onDeploySuccess(data) {
  }

  /**
   *
   * @param error
   */
  onDeployError(error) {
  }

  /**
   *
   */
  onDeployFinally() {

  }
}
