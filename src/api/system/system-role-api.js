import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/operation/system-role-api/retrieve',
    method: 'post',
    data: query
  })
}

export function deleteRoleApis(data) {
  return request({
    url: '/operation/system-role-api/delete',
    method: 'post',
    data: data
  })
}

export function addRoleApis(data) {
  return request({
    url: '/operation/system-role-api/create',
    method: 'post',
    data: data
  })
}
