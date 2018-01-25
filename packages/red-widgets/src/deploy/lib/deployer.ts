import {
  Context
} from '../../context'
import {
  Deploy
} from './'

import { DeploymentsApi } from '@tecla5/red-runtime';

export class Deployer extends Context {
  protected deploymentsApi: DeploymentsApi

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
      const result = await this.deploymentsApi.create.one(data)
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
