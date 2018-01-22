export class NodeUpdater {
  updateNode(state, id) {
    const {
    nodesApi,
      onNodeUpdateError,
      onNodeUpdateSuccess
  } = this
    const url = 'nodes/' + id
    const data = {
      enabled: state
    }
    try {
      const result = this.nodesApi.put(data)
      onNodeUpdateSuccess(result)
    } catch (error) {
      onNodeUpdateError(error)
    }

  }

  onNodeUpdateSuccess(data, options: any = {}) {
    const {
    shade
  } = options
    shade.hide();
  }

  onNodeUpdateError(error, options: any = {}) {
    const {
    shade
  } = options
    shade.hide();
  }
}
