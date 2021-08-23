export default {
  confirm: {
    messageDelete: 'Are you sure you want delete the data?',
    title: 'Confirm',
    btnOk: 'OK',
    btnCancel: 'Cancel'
  },
  message: {
    validateErrorFieldNull: '%s is required.',
    validateErrorFieldLength: '%s must be exactly %s characters.',
    validateErrorFieldMin: '%s must be at least %s characters.',
    validateErrorFieldMax: '%s cannot be longer than %s characters.',

    dataEditSuccess: 'Data has been edited.',
    dataEditCancel: 'Data has been restored to the original value.',
    dataAddSuccess: 'Data has been created.',
    dataDeleteSuccess: 'Data has been deleted.',
    dataNotExist: 'Data does not exist.'
  },
  route: {
    dashboard: 'Dashboard',
    system: {
      user: 'Users',
      system: 'System',
      api: 'Apis',
      role: 'Roles'
    }
  },
  common: {
    button: {
      search: 'Search',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      ok: 'OK',
      submit: 'Confirm'
    },
    label: {
      action: 'Action'
    }
  },
  navbar: {
    dashboard: 'Dashboard',
    logOut: 'Log Out',
    profile: 'Profile',
    size: 'Global Size',
    exitfullscreen: 'Exit Fullscreen',
    fullscreen: 'Fullscreen',
    language: 'Select Languate'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password'
  },
  system: {
    user: {
      userName: 'Username',
      password: 'Password',
      userId: 'ID',
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      accountLock: 'Locked',
      accountExpired: 'Expired',
      registrationDatetime: 'Registration Time',
      formTitleAdd: 'Create User',
      formTitleEdit: 'Update User ID:',
      role: 'Role',
      userRole: 'User Role',
      userRoleAdd: 'Add User Role'
    },
    api: {
      apiName: 'Name',
      apiId: 'ID',
      requestUrl: 'URL',
      requestMethod: 'Method',
      apiType: 'Type',
      formTitleAdd: 'Create Api',
      formTitleEdit: 'Update Api ID:',
      formApiName: 'API Name',
      formRequestUrl: 'URL',
      formRequestMethod: 'Method',
      formApiType: 'Type',
      requestMethodOption: 'Please select',
      role: 'Role',
      apiRole: 'API Role',
      apiRoleAdd: 'Add API Role'
    },
    role: {
      rolePhysicalName: 'Physical Name',
      roleLogicalName: 'Logical Name',
      roleId: 'ID',
      formTitleAdd: 'Create Role',
      formTitleEdit: 'Update Role ID:',
      formRolePhysicalName: 'Physical Name',
      formRoleLogicalName: 'Logical Name',
      user: 'User',
      roleUser: 'Role User',
      roleUserAdd: 'Add Role User',
      api: 'API',
      roleApi: 'Role API',
      roleApiAdd: 'Add Role API'
    }
  }
}
