const $log = console.log

export function delegateTo(delegateName: any) {
  return function (target, name, descriptor) {
    // obtain the original function
    let fn = descriptor.value;

    $log({
      target,
      delegateName,
    })

    let newFn = function () {
      const $context = this
      const $delegate = $context[delegateName]

      // $log({
      //   delegateName,
      //   target,
      //   $this: $context,
      //   name,
      //   $delegate
      // })

      if (!$delegate) {
        console.error('no delegate', {
          delegateName,
          $context
        })
        return fn.apply(target, arguments)
      }

      const delegateFun = $delegate[name]

      if (!delegateFun) {
        console.error('no such delegate function in delegate', {
          name,
          $delegate
        })
        return fn.apply(target, arguments)
      }

      const boundDelegateFun = delegateFun // delegateFun.bind($delegate)

      // console.log('call delegate', {
      //   boundDelegateFun,
      //   $delegate,
      //   ok: $delegate.ok
      // });

      return boundDelegateFun.apply($delegate, arguments);
    };

    // we then overwrite the origin descriptor value
    // and return the new descriptor
    descriptor.value = newFn;
    return descriptor;
  }
}
