
// @Description:three.js学习demo
//  @Author:karroy
//  @Data:2019-03-27
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path: '/a_squirrel',
      name: 'A1',
      component: () => import('@/components/a_squirrel')
    },
    {
      path: '/a_summer',
      name: 'A2',
      component: () => import('@/components/a_summer')
    },
    {
      path: '/a_area',
      name: 'A3',
      component: () => import('@/components/a_area')
    },
    {
      path: '/a_area2',
      name: 'A03',
      component: () => import('@/components/a_area2')
    },
    {
      path: '/a_areatest',
      name: 'A4',
      component: () => import('@/components/a_areatest')
    },
    {
      path: '/a_touteng',
      name: 'A5',
      component: () => import('@/components/a_touteng')
    },
    {
      path: '/a_jytouteng',
      name: 'A6',
      component: () => import('@/components/a_jytouteng')
    },
    {
      path: '/a_opendoor',
      name: 'A7',
      component: () => import('@/components/a_opendoor')
    },
    {
      path: '/a_opendoor2',
      name: 'A8',
      component: () => import('@/components/a_opendoor2')
    },
    {
      path: '/HelloWorld',
      name: 'karroy',
      component: () => import('@/components/HelloWorld')
    },
    {
      path: '/box_blue',
      name: 'karry',
      component: () => import('@/components/box_blue')
    },
    {
      path: '/box_colour',
      name: 'roy',
      component: () => import('@/components/box_colour')
    },
    {
      path: '/line',
      name: 'K03',
      component: () => import('@/components/line')
    },
    {
      path: '/grid',
      name: 'K04',
      component: () => import('@/components/grid')
    },
    {
      path: '/move_camera',
      name: 'K05',
      component: () => import('@/components/move_camera')
    },
    {
      path: '/move_mesh',
      name: 'K06',
      component: () => import('@/components/move_mesh')
    },
    {
      path: '/perfor_stats',
      name: 'K07',
      component: () => import('@/components/perfor_stats')
    },
    {
      path: '/fov_change1',
      name: 'K08',
      component: () => import('@/components/fov_change1')
    },
    {
      path: '/fov_change2',
      name: 'K09',
      component: () => import('@/components/fov_change2')
    },
    {
      path: '/light_multi',
      name: 'K10',
      component: () => import('@/components/light_multi')
    },
    {
      path: '/light_multi_gemo',
      name: 'K11',
      component: () => import('@/components/light_multi_geom')
    },
    {
      path: '/texture_box',
      name: 'K12',
      component: () => import('@/components/texture_box')
    },
    {
      path: '/texture_clock',
      name: 'K13',
      component: () => import('@/components/texture_clock')
    },
    {
      path: '/model_collada',
      name: 'M01',
      component: () => import('@/components/model_collada')
    },
    {
      path: '/model_gltf',
      name: 'M02',
      component: () => import('@/components/model_gltf')
    },
    {
      path: '/model_json',
      name: 'M03',
      component: () => import('@/components/model_json')
    },
    {
      path: '/model_obj',
      name: 'M04',
      component: () => import('@/components/model_obj')
    },
    {
      path: '/model_objmtl',
      name: 'M05',
      component: () => import('@/components/model_objmtl')
    },
    {
      path: '/model_ply',
      name: 'M06',
      component: () => import('@/components/model_ply')
    },
    {
      path: '/model_stl',

      name: 'M07',
      component: () => import('@/components/model_stl')
    },
    {
      path: '/helper_axes',
      name: 'H01',
      component: () => import('@/components/helper_axes')
    },
    {
      path: '/helper_polargrid',
      name: 'H02',
      component: () => import('@/components/helper_polargrid')
    },
    {
      path: '/helper_grid',
      name: 'H03',
      component: () => import('@/components/helper_grid')
    },
    {
      path: '/helper_skeleton',
      name: 'H04',
      component: () => import('@/components/helper_skeleton')
    },
    {
      path: '/helper_boxhelper',
      name: 'H05',
      component: () => import('@/components/helper_boxhelper')
    },
    {
      path: '/helper_camerahelper',
      name: 'H06',
      component: () => import('@/components/helper_camerahelper')
    },
    {
      path: '/helper_directionallight',
      name: 'H07',
      component: () => import('@/components/helper_directionallight')
    },
    {
      path: '/helper_plane',
      name: 'H08',
      component: () => import('@/components/helper_plane')
    },
    {
      path: '/helper_pointlight',
      name: 'H09',
      component: () => import('@/components/helper_pointlight')
    },   
    {
      path: '/helper_rectlight',
      name: 'H10',
      component: () => import('@/components/helper_rectlight')
    },
    {
      path: '/helper_spotlight',
      name: 'H11',
      component: () => import('@/components/helper_spotlight')
    },
    {
      path: '/mysearchlogo',
      name: 'mysearchlogo',
      component: () => import('@/components/mysearchlogo')
    },
    {
      path: '/examples_webcam',
      name: 'E01',
      component: () => import('@/components/examples_webcam')
    },
    {
      path: '/examples_comparison',
      name: 'E02',
      component: () => import('@/components/examples_comparison')
    },
    {
      path: '/examples_water',
      name: 'E03',
      component: () => import('@/components/examples_water')
    },
    {
      path: '/examples_cubes',
      name: 'E05',
      component: () => import('@/components/examples_cubes')
    },
    {
      path: '/01-first-scene',
      name: 'book01',
      component: () => import('@/components2/01-first-scene')
    },
    {
      path: '/02-ascii-scene',
      name: 'book02',
      component: () => import('@/components2/02-ascii-scene')
    },
    {
      path: '/03-basic-scene',
      name: 'book03',
      component: () => import('@/components2/03-basic-scene')
    },
    {
      path: '/04-foggy-scene',
      name: 'book04',
      component: () => import('@/components2/04-foggy-scene')
    },
    {
      path: '/05-geometries',
      name: 'book05',
      component: () => import('@/components2/05-geometries')
    },
    {
      path: '/06-custom-geometry',
      name: 'book06',
      component: () => import('@/components2/06-custom-geometry')
    },
    {
      path: '/07-mesh-properties',
      name: 'book07',
      component: () => import('@/components2/07-mesh-properties')
    },
    {
      path: '/08-both-cameras',
      name: 'book08',
      component: () => import('@/components2/08-both-cameras')
    },
    {
      path: '/09-ambient-light',
      name: 'book09',
      component: () => import('@/components2/09-ambient-light')
    },
    {
      path: '/10-point-light',
      name: 'book10',
      component: () => import('@/components2/10-point-light')
    },
    {
      path: '/11-spot-light',
      name: 'book11',
      component: () => import('@/components2/11-spot-light')
    },
    {
      path: '/12-directional-light',
      name: 'book12',
      component: () => import('@/components2/12-directional-light')
    },
    {
      path: '/0708-sprites',
      name: 'book0708',
      component: () => import('@/components2/0708-sprites')
    }
  ]
})