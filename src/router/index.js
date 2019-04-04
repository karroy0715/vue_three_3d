/*@Description:three.js学习demo
 *@Author:karroy
 *@Data:2019-03-27
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'karroy',
      component: ()=>import('@/components/HelloWorld')
    },
    {
      path: '/box_blue',
      name: 'karry',
      component: ()=>import('@/components/box_blue')
    },
    {
      path: '/box_colour',
      name: 'roy',
      component: ()=>import('@/components/box_colour')
    },
    {
      path: '/line',
      name: 'K03',
      component: ()=>import('@/components/line')
    },
    {
      path: '/grid',
      name: 'K04',
      component: ()=>import('@/components/grid')
    },
    {
      path: '/move_camera',
      name: 'K05',
      component: ()=>import('@/components/move_camera')
    },
    {
      path: '/move_mesh',
      name: 'K06',
      component: ()=>import('@/components/move_mesh')
    },
    {
      path: '/perfor_stats',
      name: 'K07',
      component: ()=>import('@/components/perfor_stats')
    },
    {
      path: '/fov_change1',
      name: 'K08',
      component: ()=>import('@/components/fov_change1')
    },
    {
      path: '/fov_change2',
      name: 'K09',
      component: ()=>import('@/components/fov_change2')
    },
    {
      path: '/light_multi',
      name: 'K10',
      component: ()=>import('@/components/light_multi')
    },
    {
      path: '/light_multi_gemo',
      name: 'K11',
      component: ()=>import('@/components/light_multi_geom')
    },
    {
      path: '/texture_box',
      name: 'K12',
      component: ()=>import('@/components/texture_box')
    },
    {
      path: '/texture_clock',
      name: 'K13',
      component: ()=>import('@/components/texture_clock')
    },
    {
      path: '/model_collada',
      name: 'M01',
      component: ()=>import('@/components/model_collada')
    },
    {
      path: '/model_gltf',
      name: 'M02',
      component: ()=>import('@/components/model_gltf')
    },
    {
      path: '/model_json',
      name: 'M03',
      component: ()=>import('@/components/model_json')
    },
    {
      path: '/model_obj',
      name: 'M04',
      component: ()=>import('@/components/model_obj')
    },
    {
      path: '/model_objmtl',
      name: 'M05',
      component: ()=>import('@/components/model_objmtl')
    },
    {
      path: '/model_ply',
      name: 'M06',
      component: ()=>import('@/components/model_ply')
    },
    {
      path: '/model_stl',

      name: 'M07',
      component: ()=>import('@/components/model_stl')
    },
    {
      path: '/helper_axes',
      name: 'H01',
      component: ()=>import('@/components/helper_axes')
    },
    {
      path: '/helper_polargrid',
      name: 'H02',
      component: ()=>import('@/components/helper_polargrid')
    },
    {
      path: '/helper_grid',
      name: 'H03', 
      component: ()=>import('@/components/helper_grid')
    },
    {
      path: '/helper_skeleton',
      name: 'H04', 
      component: ()=>import('@/components/helper_skeleton')
    },
    {
      path: '/mysearchlogo',
      name: 'mysearchlogo', 
      component: ()=>import('@/components/mysearchlogo')
    },
    {
      path: '/examples_webcam',
      name: 'E01', 
      component: ()=>import('@/components/examples_webcam')
    },
    {
      path: '/examples_comparison',
      name: 'E02', 
      component: ()=>import('@/components/examples_comparison')
    },
  ]
})
