export function delegateTarget(config: any) {
  const {
    container,
    scope,
    key
  } = config

  return (target: Object) => {
    const className = key ? key : target['name']
    container.getScopedEnv(scope).set(className, target)
  }
}


