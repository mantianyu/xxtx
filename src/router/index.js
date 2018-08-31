import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import XTGLY from '@/components/system/XTGLY'
import QXSZ from '@/components/system/QXSZ'
import Home from '@/components/common/Home'
import JdZxdj from '@/components/registration/JdzxManage'
import JdYydj from '@/components/registration/JdyyManage'
import Jdrzdj from '@/components/registration/JdrzManage'
import LRRZGL from '@/components/registration/LRRZGL'
import WCDJ from '@/components/dailyAffairs/WCDJ'
import TSLF from '@/components/dailyAffairs/TSLF'
import TZDJ from '@/components/registration/TZDJ'
import TZCX from '@/components/registration/TZCX'
import SGJL from '@/components/dailyAffairs/SGJL'
import CWLX from '@/components/serviceManager/CWLX'
import CWGL from '@/components/serviceManager/CWGL'
import FYGL from '@/components/FYGL/Index'
import FYycgl from '@/components/FYGL/YCGL'
import FYfyls from '@/components/FYGL/FYLS'
import FYrzjf from '@/components/FYGL/RZJF'
import FYfylb from '@/components/FYGL/FYLB'
import FYcsfy from '@/components/FYGL/CSFY'
import FYqfgl from '@/components/FYGL/QFGL'
import BuildT from '@/components/serviceManager/common/buildTable.vue'
import FloorT from '@/components/serviceManager/common/floorTable.vue'
import RoomT from '@/components/serviceManager/common/roomTable.vue'
import BedT from '@/components/serviceManager/common/bedTable.vue'
import SGLX from '@/components/dailyAffairs/SGLX'
import PGDJ from '@/components/serviceManager/PGDJ'
import NLPG from '@/components/serviceManager/NLPG'
import TJDJ from '@/components/serviceManager/TJDJ'
import JYDJ from '@/components/serviceManager/JYDJ'
import SWGL from '@/components/serviceManager/SWGL'
import SWT from '@/components/serviceManager/common/SWTable.vue'
import SCQY from '@/components/serviceManager/SCQY'
import SCQYT from '@/components/serviceManager/common/SCQYTable.vue'
import AREAST from '@/components/serviceManager/common/AreasTable.vue'
import DCGL from '@/components/serviceManager/DCGL'
import SCJL from '@/components/serviceManager/SCJL'
import SPGL from '@/components/serviceManager/SPGL'
import SPLBT from '@/components/serviceManager/common/SPLBTable.vue'
import SPGLT from '@/components/serviceManager/common/recipeTable.vue'
import YYZD from '@/components/serviceManager/YYZD'
import BIRTH from '@/components/dailyAffairs/Birthday'
import LRHD from '@/components/dailyAffairs/LRHD'
import YPJC from '@/components/serviceManager/YPJC'
import YPJCT from '@/components/serviceManager/common/YPJCTable.vue'
import DRUGLT from '@/components/serviceManager/common/drugListTable.vue'
import YYSZ from '@/components/serviceManager/YYSZ'
import YYDJ from '@/components/serviceManager/YYDJ'
import YYDJT from '@/components/serviceManager/common/YYDJTable.vue'
import DYYDJT from '@/components/serviceManager/common/drugYYDJTable.vue'
import SJZD from '@/components/system/SJZD'
import SJZDT from '@/components/system/SJZDTable'
import XFDJ from '@/components/FYGL/XFDJ'
import JFDJ from '@/components/FYGL/JFDJ'
import TZJS from '@/components/FYGL/TZJS'
import HGXZ from '@/components/NursingManager/HGXZ'
import HLJB from '@/components/serviceManager/HLJB'
import HLXM from '@/components/serviceManager/HLXM'
import HLXMT from '@/components/serviceManager/common/HLXMTable'
import NursPlan from '@/components/NursingManager/NursPlan'
import HGTB from '@/components/NursingManager/HGTB'
import HGPB from '@/components/NursingManager/HGPB'
import NURSE from '@/components/NursingManager/NURSE'
import SYSTEM from '@/components/system/systemTable.vue'
import DEPART from '@/components/system/department.vue'
import LRXXXQ from '@/components/TJFX/LRXXXQ'
import LRJBTJ from '@/components/TJFX/LRJBTJ'
import LRNLTJ from '@/components/TJFX/LRNLTJ'
import HLJBTJ from '@/components/TJFX/HLJBTJ'
import LRCRBB from '@/components/TJFX/LRCRBB'
import LRCRTJ from '@/components/TJFX/LRCRTJ'
import RZLTJ from '@/components/TJFX/RZLTJ'
import CKSZ from '@/components/KCGL/CKSZ'
import CKGL from '@/components/KCGL/CKGL'
import WZSZ from '@/components/KCGL/WZSZ'
import WZSZT from '@/components/KCGL/common/WZSZTable'
import RKGL from '@/components/KCGL/RKGL'
import KCCX from '@/components/KCGL/KCCX'
import KCCXT from '@/components/KCGL/common/KCCXTable'
import YDPC from '@/components/KCGL/YDPC'
import YDPCT from '@/components/KCGL/common/YDPCTable'
import KCJE from '@/components/KCGL/KCJE'
import WZDB from '@/components/KCGL/WZDB'
import KCPD from '@/components/KCGL/KCPD'
import NDYYBB from '@/components/TJFX/NDYYBB'
import EMP from '@/components/system/employee'
import YDYYBB from '@/components/TJFX/YDYYBB'
import HLLXFX from '@/components/TJFX/HLLXFX'
import CWSYFX from '@/components/TJFX/CWSYFX'
import CWZTTJ from '@/components/TJFX/CWZTTJ'
import LRLXFX from '@/components/TJFX/LRLXFX'
import YGXXXQ from '@/components/TJFX/YGXXXQ'
import YGGWFX from '@/components/TJFX/YGGWFX'
import YGNLFX from '@/components/TJFX/YGNLFX'
import YGXLFX from '@/components/TJFX/YGXLFX'
import HLYZZFX from '@/components/TJFX/HLYZZFX'
import ZYLR from '@/components/registration/LRXXXQ'
import FWGLIndex from '@/components/serviceManager/Index'
import DJGLIndex from '@/components/registration/Index'
import RCSW from '@/components/dailyAffairs/Index'
import HLGL from '@/components/NursingManager/Index'
import TJFX from '@/components/TJFX/Index'
import XTGL from '@/components/system/Index'
import WebMap from '@/components/common/Map'
import NOTICE from '@/components/system/message'
import RWWCZK from '@/components/NursingManager/taskStatus'
import RWTJ from '@/components/NursingManager/RWTJ'
import DDLB from '@/components/dailyAffairs/orderList'
import FWTJ from '@/components/dailyAffairs/FWTJ'
import FWJL from '@/components/dailyAffairs/FWJL'
import JFCK from '@/components/NursingManager/JFCK'
import JFJL from '@/components/NursingManager/JFJL'
import YLZJ from '@/components/system/YLZJ'
import JGGL from '@/components/system/JGGL'
import YGFC from '@/components/system/YGFC'
import SYSSET from '@/components/system/systemSet'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: Home,
      children: [{
        path: '/',
        meta: {
          //requireAuth: true
        },
        component: Index
      }, {
        path: '/djgl/zxdj', //登记管理-咨询登记
        meta: {
          //requireAuth: true
        },
        component: JdZxdj
      }, {
        path: '/djgl/yydj', //登记管理-预约登记
        meta: {
          //requireAuth: true
        },
        component: JdYydj
      }, {
        path: '/djgl/rzdj', //登记管理-入住登记
        meta: {
          //requireAuth: true
        },
        component: Jdrzdj
      }, {
        path: '/xtgl/manager', //系统管理-系统管理员
        meta: {
          //requireAuth: true
        },
        component: XTGLY
      },{
        path: '/xtgl/permission', //系统管理-权限设置
        meta: {
          //requireAuth: true
        },
        component: QXSZ
      }, {
        path: '/djgl/lrst', //登记管理-老人管理-老人视图
        meta: {
          //requireAuth: true
        },
        component: LRRZGL
      },{
        path: '/djgl/zylr', //登记管理-老人管理-住院老人
        meta: {
          //requireAuth: true
        },
        component: ZYLR
      }, {
        path: '/rcsw/wcdj', //日常事务-外出登记
        meta: {
          //requireAuth: true
        },
        component: WCDJ
      }, {
        path: '/rcsw/tslf', //日常事务-探视来访
        meta: {
          //requireAuth: true
        },
        component: TSLF
      }, {
        path: '/djgl/cydj', //登记管理-出院登记
        meta: {
          //requireAuth: true
        },
        component: TZDJ
      }, {
        path: '/djgl/cycx', //登记管理-出院查询
        meta: {
          //requireAuth: true
        },
        component: TZCX
      }, {
        path: '/fwgl/cwlx', //服务管理-床位类型
        meta: {
          //requireAuth: true
        },
        component: CWLX
      }, {
        path: '/fwgl/cwsz', //服务管理-床位设置-首页  redirect 楼栋
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/cwsz/buildt',
        component: CWGL,
        children: [{
            path: '/fwgl/cwsz/buildt', //服务管理-床位设置-楼栋
            meta: {
              //requireAuth: true
            },
            component: BuildT
          },
          {
            path: '/fwgl/cwsz/floort/:lid', //服务管理-床位设置-楼层
            meta: {
              //requireAuth: true
            },
            component: FloorT
          },
          {
            path: '/fwgl/cwsz/roomt/:lid/:fid', //服务管理-床位设置-房间
            meta: {
              //requireAuth: true
            },
            component: RoomT
          },
          {
            path: '/fwgl/cwsz/bedt/:lid/:fid/:rid', //服务管理-床位设置-床位
            meta: {
              //requireAuth: true
            },
            component: BedT
          },
        ]
      },{
        path: '/rcsw/sglx', //日常事务-事故类型
        meta: {
          //requireAuth: true
        },
        component: SGLX
      }, {
        path: '/rcsw/sgjl', //日常事务-事故记录
        meta: {
          //requireAuth: true
        },
        component: SGJL
      }, {
        path: '/fygl', //费用管理-首页
        meta: {
          //requireAuth: true
        },
        component: FYGL
      }, {
        path: '/fygl/ycgl', //费用管理-预存管理
        meta: {
          //requireAuth: true
        },
        component: FYycgl
      }, {
        path: '/fygl/rzjf', //费用管理-入住缴费
        meta: {
          //requireAuth: true
        },
        component: FYrzjf
      }, {
        path: '/fygl/qfgl', //费用管理-欠费管理
        meta: {
          //requireAuth: true
        },
        component: FYqfgl
      }, {
        path: '/fygl/fylb', //费用管理-费用类别
        meta: {
          //requireAuth: true
        },
        component: FYfylb
      }, {
        path: '/fygl/csfy', //费用管理-初始费用
        meta: {
          //requireAuth: true
        },
        component: FYcsfy
      }, {
        path: '/fygl/fyls', //费用管理-费用流水
        meta: {
          //requireAuth: true
        },
        component: FYfyls
      }, {
        path: '/fwgl/pgdj', //服务管理-评估登记
        meta: {
          //requireAuth: true
        },
        component: PGDJ
      }, {
        path: '/fwgl/nlpg', //服务管理-能力评估
        meta: {
          //requireAuth: true
        },
        component: NLPG
      }, {
        path: '/fwgl/tjdj', //服务管理-体检登记
        meta: {
          //requireAuth: true
        },
        component: TJDJ
      }, {
        path: '/fwgl/jydj', //服务管理-就医登记
        meta: {
          //requireAuth: true
        },
        component: JYDJ
      }, {
        path: '/fwgl/swgl', //服务管理-食物管理
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/swgl/sw/0',
        component: SWGL,
        children: [{
          path: '/fwgl/swgl/sw/:fyid', //服务管理-食物管理-食物
          meta: {
            //requireAuth: true
          },
          component: SWT
        }, ]
      }, {
        path: '/fwgl/scqy', //服务管理-送餐区域
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/scqy/scqy',
        component: SCQY,
        children: [{
            path: '/fwgl/scqy/scqy', //服务管理-送餐区域-送餐区域
            meta: {
              //requireAuth: true
            },
            component: SCQYT
          },
          {
            path: '/fwgl/scqy/areast/:aid', //服务管理-送餐区域-AREAST
            meta: {
              //requireAuth: true
            },
            component: AREAST
          },
        ]
      }, {
        path: '/fwgl/dcgl', //服务管理-点餐管理
        meta: {
          //requireAuth: true
        },
        component: DCGL,
      }, {
        path: '/fwgl/scjl', //服务管理-送餐记录
        meta: {
          //requireAuth: true
        },
        component: SCJL,
      }, {
        path: '/fwgl/spgl', //服务管理-食谱管理
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/spgl/splb',
        component: SPGL,
        children: [{
            path: '/fwgl/spgl/splb', //服务管理-食谱管理-食谱类别
            meta: {
              //requireAuth: true
            },
            component: SPLBT
          },
          {
            path: '/fwgl/spgl/spgl/:rid', //服务管理-食谱管理-食谱管理
            meta: {
              //requireAuth: true
            },
            component: SPGLT
          },
        ]
      }, {
        path: '/fwgl/yyzd', //服务管理-用药字典
        meta: {
          //requireAuth: true
        },
        component: YYZD,
      }, {
        path: '/rcsw/birth', //日常事务-老人生日
        meta: {
          //requireAuth: true
        },
        component: BIRTH,
      }, {
        path: '/rcsw/lrhd', //日常事务-老人活动
        meta: {
          //requireAuth: true
        },
        component: LRHD,
      }, {
        path: '/fwgl/ypjc', //服务管理-药品缴存
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/ypjc/ypjcelder',
        component: YPJC,
        children: [{
            path: '/fwgl/ypjc/ypjcelder', //服务管理-药品缴存-老人
            meta: {
              //requireAuth: true
            },
            component: YPJCT
          },
          {
            path: '/fwgl/ypjc/druglt/:elderid/:safekeepingid', //服务管理-药品缴存-药品
            meta: {
              //requireAuth: true
            },
            component: DRUGLT
          },
        ]
      }, {
        path: '/fwgl/yysz', //服务管理-用药设置
        meta: {
          //requireAuth: true
        },
        component: YYSZ,
      }, {
        path: '/fwgl/yydj', //服务管理-药品缴存
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/yydj/yydjelder',
        component: YYDJ,
        children: [{
            path: '/fwgl/yydj/yydjelder', //服务管理-用药登记-老人
            meta: {
              //requireAuth: true
            },
            component: YYDJT
          },
          {
            path: '/fwgl/yydj/drugdjt/:elderid', //服务管理-用药登记-药品
            meta: {
              //requireAuth: true
            },
            component: DYYDJT
          },
        ]
      }, {
        path: '/xtgl/sjzd', //系统管理-数据字典
        meta: {
          //requireAuth: true
        },
        redirect: '/xtgl/sjzd/sjzdt/0',
        component: SJZD,
        children: [{
          path: '/xtgl/sjzd/sjzdt/:group', //系统管理-数据字典
          meta: {
            //requireAuth: true
          },
          component: SJZDT
        }]
      }, {
        path: '/fygl/xfdj', //费用管理-消费登记
        meta: {
          //requireAuth: true
        },
        component: XFDJ,
      }, {
        path: '/fygl/jfdj', //费用管理-交费登记
        meta: {
          //requireAuth: true
        },
        component: JFDJ,
      }, {
        path: '/fygl/tzjs', //费用管理-退住结算
        meta: {
          //requireAuth: true
        },
        component: TZJS,
      }, {
        path: '/djgl/fyjs', //登记管理-费用结算
        meta: {
          //requireAuth: true
        },
        component: TZJS,
      }, {
        path: '/hlgl/hgxz', //护理管理-护工小组
        meta: {
          //requireAuth: true
        },
        component: HGXZ,
      }, {
        path: '/fwgl/hljb', //服务管理-护理级别
        meta: {
          //requireAuth: true
        },
        component: HLJB,
      }, {
        path: '/fwgl/hlxm', //服务管理-护理项目
        meta: {
          //requireAuth: true
        },
        redirect: '/fwgl/hlxm/hlxmt/0',
        component: HLXM,
        children: [{
          path: '/fwgl/hlxm/hlxmt/:pid', //服务管理-护理项目
          meta: {
            //requireAuth: true
          },
          component: HLXMT
        }]
      }, {
        path: '/hlgl/nursplan', //护理管理-护工排班方案
        meta: {
          //requireAuth: true
        },
        component: NursPlan,
      }, {
        path: '/hlgl/hgtb', //护理管理-护工替班
        meta: {
          //requireAuth: true
        },
        component: HGTB,
      }, {
        path: '/hlgl/hgpb', //护理管理-护工排班
        meta: {
          //requireAuth: true
        },
        component: HGPB,
      }, {
        path: '/hlgl/nurse', //护理管理-护工
        meta: {
          //requireAuth: true
        },
        component: NURSE,
      }, {
        path: '/xtgl/system', //操作日志
        meta: {
          //requireAuth: true
        },
        component: SYSTEM,
      }, {
        path: '/xtgl/depart', //系统管理-部门管理
        meta: {
          //requireAuth: true
        },
        component: DEPART,
      }, {
        path: '/tjfx/lrtj_lrxxxq', //统计分析-老人统计-老人信息详情
        meta: {
          //requireAuth: true
        },
        component: LRXXXQ,
      }, {
        path: '/tjfx/lrtj_lrjbtj', //统计分析-老人统计-老人疾病统计
        meta: {
          //requireAuth: true
        },
        component: LRJBTJ,
      }, {
        path: '/tjfx/lrtj_lrnltj', //统计分析-老人统计-老人年龄统计
        meta: {
          //requireAuth: true
        },
        component: LRNLTJ,
      }, {
        path: '/tjfx/lrtj_hljbtj', //统计分析-老人统计-护理级别统计
        meta: {
          //requireAuth: true
        },
        component: HLJBTJ,
      }, {
        path: '/tjfx/jgtj_lrcrbb', //统计分析-机构统计-老人出入报表
        meta: {
          //requireAuth: true
        },
        component: LRCRBB,
      }, {
        path: '/tjfx/jgtj_lrcrtj', //统计分析-机构统计-老人出入统计
        meta: {
          //requireAuth: true
        },
        component: LRCRTJ,
      }, {
        path: '/tjfx/jgtj_rzltj', //统计分析-机构统计-入住率统计
        meta: {
          //requireAuth: true
        },
        component: RZLTJ,
      }, {
        path: '/rcsw/cksz', //日常事务-仓库设置
        meta: {
          //requireAuth: true
        },
        component: CKSZ,
      }, {
        path: '/rcsw/ckgl', //日常事务-出库管理
        meta: {
          //requireAuth: true
        },
        component: CKGL,
      }, {
        path: '/rcsw/wzsz', //日常事务-物资设置
        meta: {
          //requireAuth: true
        },
        redirect: '/rcsw/wzsz/wzszt/0',
        component: WZSZ,
        children: [{
          path: '/rcsw/wzsz/wzszt/:id', //日常事务-物资设置-物资
          meta: {
            //requireAuth: true
          },
          component: WZSZT
        }]
      }, {
        path: '/rcsw/rkgl', //日常事务-入库管理
        meta: {
          //requireAuth: true
        },
        component: RKGL,
      }, {
        path: '/rcsw/kccx', //日常事务-库存查询
        meta: {
          //requireAuth: true
        },
        redirect: '/rcsw/kccx/kccxt/0',
        component: KCCX,
        children: [{
          path: '/rcsw/kccx/kccxt/:id', //日常事务-库存查询-库存
          meta: {
            //requireAuth: true
          },
          component: KCCXT
        }]
      }, {
        path: '/rcsw/ydpc', //日常事务-月度盘存
        meta: {
          //requireAuth: true
        },
        redirect: '/rcsw/ydpc/ydpct/0',
        component: YDPC,
        children: [{
          path: '/rcsw/ydpc/ydpct/:id', //日常事务-月度盘存-库存
          meta: {
            //requireAuth: true
          },
          component: YDPCT
        }]
      }, {
        path: '/rcsw/kcje', //日常事务-库存金额
        meta: {
          //requireAuth: true
        },
        component: KCJE,
      }, {
        path: '/rcsw/wzdb', //日常事务-物资调拨
        meta: {
          //requireAuth: true
        },
        component: WZDB,
      }, {
        path: '/rcsw/kcpd', //日常事务-库存盘点
        meta: {
          //requireAuth: true
        },
        component: KCPD,
      }, {
        path: '/tjfx/jgtj_ndyybb', //统计分析-机构统计-年度运营报表
        meta: {
          //requireAuth: true
        },
        component: NDYYBB,
      }, {
        path: '/xtgl/emp', //系统管理-员工信息
        meta: {
          //requireAuth: true
        },
        component: EMP,
      }, {
        path: '/tjfx/jgtj_ydyybb', //统计分析-机构统计-月度运营报表
        meta: {
          //requireAuth: true
        },
        component: YDYYBB,
      }, 
       {
        path: '/tjfx/jgtj_ydyybb', //统计分析-机构统计-月度运营报表
        meta: {
          //requireAuth: true
        },
        component: YDYYBB,
      },{
        path: '/tjfx/lrtj_hllxfx', //统计分析-老人统计-护理类型分析
        meta: {
          //requireAuth: true
        },
        component: HLLXFX,
      }, {
        path: '/tjfx/jgtj_cwsyfx', //统计分析-机构统计-床位使用分析
        meta: {
          //requireAuth: true
        },
        component: CWSYFX,
      }, {
        path: '/tjfx/jgtj_cwzttj', //统计分析-机构统计-床位状态统计
        meta: {
          //requireAuth: true
        },
        component: CWZTTJ,
	    }, {
        path: '/tjfx/lrtj_lrlxfx', //统计分析-老人统计-老人类型分析
        meta: {
          //requireAuth: true
        },
        component: LRLXFX,
      }, {
        path: '/tjfx/ygtj_ygxxxq', //统计分析-员工统计-员工信息详情
        meta: {
          //requireAuth: true
        },
        component: YGXXXQ,
      }, {
        path: '/tjfx/ygtj_yggwfx', //统计分析-员工统计-员工岗位分析
        meta: {
          //requireAuth: true
        },
        component: YGGWFX,
      }, {
        path: '/tjfx/ygtj_ygnlfx', //统计分析-员工统计-员工年龄分析
        meta: {
          //requireAuth: true
        },
        component: YGNLFX,
      }, {
        path: '/tjfx/ygtj_ygxlfx', //统计分析-员工统计-员工学历分析
        meta: {
          //requireAuth: true
        },
        component: YGXLFX,
      }, {
        path: '/tjfx/ygtj_hlyzzfx', //统计分析-员工统计-护理员资质分析
        meta: {
          //requireAuth: true
        },
        component: HLYZZFX,
      },{
        path: '/fwgl', //服务管理首页
        meta: {
          //requireAuth: true
        },
        component: FWGLIndex
      },{
        path: '/djgl', //登记管理首页
        meta: {
          //requireAuth: true
        },
        component: DJGLIndex
      },{
        path: '/rcsw', //日常事物首页
        meta: {
          //requireAuth: true
        },
        component: RCSW
      },{
        path: '/hlgl', //护理管理首页
        meta: {
          //requireAuth: true
        },
        component: HLGL
      },{
        path: '/tjfx', //统计分析首页
        meta: {
          //requireAuth: true
        },
        component: TJFX
      },{
        path: '/xtgl', //系统管理首页
        meta: {
          //requireAuth: true
        },
        component: XTGL
      },{
        path: '/map', //网站地图
        meta: {
          ////requireAuth: true
        },
        component: WebMap
      },{
        path: '/xtgl/notice', //养老院公告
        meta: {
          requireAuth: true
        },
        component: NOTICE
      },{
        path: '/hlgl/rwwczk', //护理管理-任务完成状况
        meta: {
          requireAuth: true
        },
        component: RWWCZK
      },{
        path: '/hlgl/RWTJ', //护理管理-任务统计
        meta: {
          requireAuth: true
        },
        component: RWTJ
      },{
        path: '/rcsw/ddlb', //日常事务-时间银行-订单列表
        meta: {
          requireAuth: true
        },
        component: DDLB
      },{
        path: '/rcsw/fwtj', //日常事务-时间银行-服务统计
        meta: {
          requireAuth: true
        },
        component:FWTJ
      },{
        path: '/rcsw/fwjl', //日常事务-时间银行-服务记录
        name: 'FWJL',
        meta: {
          requireAuth: true
        },
        component:FWJL
      },{
        path: '/hlgl/jfck', //护理管理-护工积分-积分查看
        meta: {
          requireAuth: true
        },
        component:JFCK
      },{
        path: '/hlgl/jfjl', //护理管理-护工积分-积分记录
        name: 'JFJL',
        meta: {
          requireAuth: true
        },
        component:JFJL
      },{
        path: '/xtgl/ylzj', //系统管理-在线营销-资料管理
        meta: {
          requireAuth: true
        },
        component:YLZJ
      },{
        path: '/xtgl/jggl', //系统管理-在线营销-价格管理
        meta: {
          requireAuth: true
        },
        component:JGGL
      },{
        path: '/xtgl/ygfc', //系统管理-在线营销-员工风采
        meta: {
          requireAuth: true
        },
        component:YGFC
      },{
        path: '/xtgl/sysset', //系统管理-系统设置
        meta: {
          requireAuth: true
        },
        component:SYSSET
      }]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
//     var accessToken = '';
//     console.log(document.cookie.split('; '))
//     var arr = document.cookie.split('; ');
//     for (var i = 0; i < arr.length; i++) {
//       var arr2 = arr[i].split('=');
//       console.log(arr2)
//       if (arr2[0] == 'accessToken') {
//         accessToken = arr2[1];
//       }
//       console.log(accessToken)
//     }
//     console.log(arr)
//     console.log(accessToken)
//     if (accessToken != '') { // 判断当前的token是否存在
//       next();
//     } else if (accessToken == '') {
//       alert(accessToken)
//       next({
//         path: '/login',
//         query: {
//           redirect: to.fullPath
//         } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
