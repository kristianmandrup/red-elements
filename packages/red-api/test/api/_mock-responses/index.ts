export const mockResponses = {
  settings: {
    _200() {
      return {
        user: {
          anonymous: false
        },
        'auth-tokens': {
          accessToken: 'abc123'
        },
        editorTheme: {

        }
      }
    }
  }
}
