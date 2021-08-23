const getters = {
  sidebar: state => state.system_app.sidebar,
  language: state => state.system_app.language,
  size: state => state.system_app.size,
  visitedViews: state => state.system_tagsView.visitedViews,
  cachedViews: state => state.system_tagsView.cachedViews,
  device: state => state.system_app.device,
  token: state => state.system_user.token,
  avatar: state => state.system_user.avatar,
  name: state => state.system_user.name,
  roles: state => state.system_user.roles,
  permission_routes: state => state.system_permission.routes
}
export default getters
