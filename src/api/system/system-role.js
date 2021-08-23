import request from '@/utils/request'

export function editRole(data) {
  return request({
    url: '/operation/system-role/update',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/operation/system-role/create',
    method: 'post',
    data
  })
}

export function deleteRoles(roleIds) {
  return request({
    url: '/operation/system-role/delete',
    method: 'post',
    data: roleIds
  })
}

export function fetchList(query) {
  return request({
    url: '/operation/system-role/retrieve',
    method: 'post',
    data: query
  })
}

export function fetchUserRoleList(query) {
  return request({
    url: '/operation/system-user-role/retrieve',
    method: 'post',
    data: query
  })
}

export function deleteUserRoles(data) {
  return request({
    url: '/operation/system-user-role/delete',
    method: 'post',
    data: data
  })
}

export function addUserRoles(data) {
  return request({
    url: '/operation/system-user-role/create',
    method: 'post',
    data: data
  })
}
