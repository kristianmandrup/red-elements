export class NodeCreator {
  async postNode(data, options: any = {}) {
    const {
        nodesApi,
      onNodePostSuccess,
      onNodePostError
      } = this

    this.nodesApi = new NodesApi()
    try {
      const result = await this.nodesApi.post(data)
      onNodePostSuccess(result, options)
    } catch (error) {
      onNodePostError(error)
    }
  }

  onNodePostSuccess(data, options: any = {}) {
    const {
      shade
    } = options
    shade.hide();
  }

  onNodePostError(error, options: any = {}) {
    const {
      shade
    } = options

    shade.hide();
  }
}

