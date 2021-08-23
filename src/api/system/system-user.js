import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/customer/system-user/retrieve',
    method: 'get'
  })
}

export function editUser(data) {
  return request({
    url: '/operation/system-user/update',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/operation/system-user/create',
    method: 'post',
    data
  })
}

export function deleteUsers(userIds) {
  return request({
    url: '/operation/system-user/delete',
    method: 'post',
    data: userIds
  })
}

export function fetchList(query) {
  return request({
    url: '/operation/system-user/retrieve',
    method: 'post',
    data: query
  })
}
