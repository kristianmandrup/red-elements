export class NodeDeleter {

  async deleteNode(id: string) {
    const url = 'nodes/' + id

    this.nodesApi = new NodesApi().configure({
      url
    })

    const {
    nodesApi,
      onNodeDeleteSuccess,
      onNodeDeleteError
  } = this

    this.nodesApi = new NodesApi()
    try {
      const result = await this.nodesApi.delete()
      onNodeDeleteSuccess(result)
    } catch (error) {
      onNodeDeleteError(error)
    }
  }

  onNodeDeleteSuccess(result) {

  }

  onNodeDeleteError(error) {

  }
}
