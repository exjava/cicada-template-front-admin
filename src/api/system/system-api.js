import request from '@/utils/request'

export function editApi(data) {
  return request({
    url: '/operation/system-api/update',
    method: 'post',
    data
  })
}

export function addApi(data) {
  return request({
    url: '/operation/system-api/create',
    method: 'post',
    data
  })
}

export function deleteApis(apiIds) {
  return request({
    url: '/operation/system-api/delete',
    method: 'post',
    data: apiIds
  })
}

export function fetchList(query) {
  return request({
    url: '/operation/system-api/retrieve',
    method: 'post',
    data: query
  })
}

