import { request } from '@/utils/request.js'

/**
 * 成果管理 API接口
 */
export default {

  /**
   * 数据列表
   * @returns
   */
  getPageList (params = {}) {
    return request({
      url: '/gx/Result/index',
      method: 'get',
      params
    })
  },

#whether[$generate_model == 1]
  /**
   * 回收站数据列表
   * @returns
   */
  getRecyclePageList (params = {}) {
    return request({
      url: '/gx/Result/recycle',
      method: 'get',
      params
    })
  },
#/whether
  /**
   * 添加数据
   * @returns
   */
  save (params = {}) {
    return request({
      url: '/gx/Result/save',
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
      url: '/gx/Result/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 软删除数据
   * @returns
   */
  delete (data) {
    return request({
      url: '/gx/Result/destroy',
      method: 'delete',
      data
    })
  },

#whether[$generate_model == 1]
  /**
   * 恢复回收站数据
   * @returns
   */
  recovery (data) {
    return request({
      url: '/gx/Result/recovery',
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
      url: '/gx/Result/realDestroy',
      method: 'delete',
      data,
    })
  },
#/whether
  /**
   * 更新数据
   * @returns
   */
  update (id, data = {}) {
    return request({
      url: '/gx/Result/update?id=' + id,
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
      url: '/gx/Result/changeStatus',
      method: 'post',
      data
    })
  },

}