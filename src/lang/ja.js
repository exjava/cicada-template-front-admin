export default {
  confirm: {
    messageDelete: 'データを削除しますか。',
    title: '確認',
    btnOk: '確定',
    btnCancel: '取消'
  },
  message: {
    validateErrorFieldNull: '%sは必須です。',
    validateErrorFieldLength: '%sの長さは%sです。',
    validateErrorFieldMin: '%sの長さは%s以上でなければなりません。',
    validateErrorFieldMax: '%sの長さは%s以下でなければなりません。',

    dataEditSuccess: 'データが変更されました。',
    dataEditCancel: '変更前のデータに戻りました。',
    dataAddSuccess: 'データが追加されました。',
    dataDeleteSuccess: 'データが削除されました。',
    dataNotExist: 'データが存在しません。'
  },
  route: {
    dashboard: 'トップ',
    system: {
      user: 'ユーザ',
      system: 'システム管理',
      api: 'API',
      role: 'ロール'
    }
  },
  common: {
    button: {
      search: '検索',
      add: '追加',
      edit: '編集',
      delete: '削除',
      cancel: '取消',
      ok: '確定',
      submit: '確定'
    },
    label: {
      action: '操作'
    }
  },
  navbar: {
    dashboard: 'トップ',
    logOut: 'ログアウト',
    profile: 'プロフィール',
    size: '画面サイズ',
    exitfullscreen: '復旧',
    fullscreen: 'フルスクリーン',
    language: '言語'
  },
  login: {
    title: 'ユーザログイン',
    logIn: 'ログイン',
    username: 'ユーザ名',
    password: 'パスワード'
  },
  system: {
    user: {
      userName: 'ユーザ名',
      password: 'パスワード',
      userId: 'ID',
      email: 'Email',
      firstName: '名',
      lastName: '姓',
      accountLock: 'ロック',
      accountExpired: '期限切れ',
      registrationDatetime: '作成日時',
      formTitleAdd: 'ユーザ追加',
      formTitleEdit: 'ユーザ変更ID:',
      role: 'ロール',
      userRole: 'ユーザロール',
      userRoleAdd: 'ユーザロール追加'
    },
    api: {
      apiName: 'API名',
      apiId: 'ID',
      requestUrl: 'URL',
      requestMethod: 'メソッド',
      apiType: 'API種類',
      formTitleAdd: 'API追加',
      formTitleEdit: 'API更新ID:',
      formApiName: 'API名',
      formRequestUrl: 'URL',
      formRequestMethod: 'メソッド',
      formApiType: 'API種類',
      requestMethodOption: '選択してください',
      role: 'ロール',
      apiRole: 'APIロール',
      apiRoleAdd: 'APIロール追加'
    },
    role: {
      rolePhysicalName: '物理名',
      roleLogicalName: '表示名',
      roleId: 'ID',
      formTitleAdd: 'ロール追加',
      formTitleEdit: 'ロール更新ID:',
      formRolePhysicalName: '物理名',
      formRoleLogicalName: '表示名',
      user: 'ユーザ',
      roleUser: 'ロールユーザ',
      roleUserAdd: 'ロールユーザ追加',
      api: 'API',
      roleApi: 'ロールAPI',
      roleApiAdd: 'ロールAPI追加'
    }
  }
}
