export function delegateTarget(config: any) {
  const {
    container,
    bind,
    scope,
    key
  } = config

  return (target: Object) => {
    let className = target['name']

    if (bind) {
      Object.keys(bind).map(scope => {
        const key = bind[scope]
        let resolvedKey = key
        if (key === 'I') { // use interface convention
          resolvedKey = `I${className}`
        }
        const resolvedClassName = key === '*' ? className : resolvedKey
        container.getScopedEnv(scope).set(resolvedClassName, target)
      })
    } else {
      let resolvedKey = key
      if (key === 'I') { // use interface convention
        resolvedKey = `I${className}`
      }
      const resolvedClassName = resolvedKey ? resolvedKey : className
      container.getScopedEnv(scope).set(resolvedClassName, target)
    }
  }
}


