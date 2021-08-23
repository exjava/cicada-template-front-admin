import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/operation/system-role-user/retrieve',
    method: 'post',
    data: query
  })
}

export function deleteRoleUsers(data) {
  return request({
    url: '/operation/system-role-user/delete',
    method: 'post',
    data: data
  })
}

export function addRoleUsers(data) {
  return request({
    url: '/operation/system-role-user/create',
    method: 'post',
    data: data
  })
}
