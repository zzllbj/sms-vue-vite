import { request } from '@/utils/request.js'

/**
 * 预算资金 API接口
 */
export default {

  /**
   * 数据列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/gx/AmountTotal/index',
      method: 'get',
      params
    })
  },

  /**
   * 回收站数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/gx/AmountTotal/recycle',
      method: 'get',
      params
    })
  },
  /**
   * 添加数据
   * @returns
   */
  save (params = {}) {
    return request({
      url: '/gx/AmountTotal/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read (id) {
    return request({
      url: '/gx/AmountTotal/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 软删除数据
   * @returns
   */
  delete (data) {
    return request({
      url: '/gx/AmountTotal/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 恢复回收站数据
   * @returns
   */
  recovery (data) {
    return request({
      url: '/gx/AmountTotal/recovery',
      method: 'post',
      data
    })
  },

  /**
   * 真实删除数据
   * @returns
   */
  realDestroy(data) {
    return request({
      url: '/gx/AmountTotal/realDestroy',
      method: 'delete',
      data,
    })
  },
  /**
   * 更新数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: '/gx/AmountTotal/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 更改状态
   * @returns
   */
  changeStatus(data = {}) {
    return request({
      url: '/gx/AmountTotal/changeStatus',
      method: 'post',
      data
    })
  },

}