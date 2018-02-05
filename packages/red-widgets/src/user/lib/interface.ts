export interface IUser {
  configure()
  updateUserMenu()
  loginDialog(opts): Promise<any>
}
