import {
  Deploy,
  IDeploy,
  autobind,
  Context,
  log,
  delegator,
  delegateTarget,
  container,
  IDeploymentsApi,
  DeploymentsApi
} from '../_base'

export interface IDeployer {
  /**
   * Deploy nodes
   * @param nodes
   */
  deployNodes(nodes): Promise<any>
}

@delegateTarget()
@delegator({
  bind: {
    deployApi: 'IDeploymentsApi'
  }
})
export class Deployer extends Context implements IDeployer {
  protected deployApi: IDeploymentsApi // TODO: replace with interface!

  constructor(public deploy: IDeploy) {
    super()
  }

  /**
   *
   * @param nodes
   */
  async deployNodes(nodes) {
    const {
      _onDeployError,
      _onDeploySuccess,
      _onDeployFinally
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
      _onDeploySuccess(result)
    } catch (error) {
      _onDeployError(error)
    } finally {
      _onDeployFinally()
    }
  }

  /**
   *
   * @param data
   */
  @autobind
  protected _onDeploySuccess(data) {
  }

  /**
   *
   * @param error
   */
  @autobind
  protected _onDeployError(error) {
  }

  /**
   *
   */
  @autobind
  protected _onDeployFinally() {

  }
}
