import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  manage: true,
  promise: false,
  manageEdit: false,
  promiseEdit: false,
  JdzxManageEdit:false,
  JdzxManagechange:false,
  JdzxManageXq:false,
  jdyyEdit:false,
  jdyyEditFalse:false,
  ycglEdit:false,
  jcxxEdit:false,
  jcxxEditFalse:false,
  rzjfAdd:false,
  rzjfdetail:false,
  fylbEdit:false,
  rzdjEdit:false,
  qfglcheckout:false,
  old_out_flag: false,
  oldOutEdit: false,   //玩出添加修改是否显示
  oldOutEditFalse: false,  //玩出是否修改
  oldVisitEdit: false,  //探访添加修改是否显示
  oldVisitEditFalse: false, //探访能否修改
  checkout: false,    //退住详情是否显示
  oldAccident: false,  //事故记录添加修改是否显示
  oldAccidentEdit: false,  //事故记录添加修改是否能修改
  bedTypeEdit: false,  //床位类型详情是否显示
  addBuild: false,  //添加楼房是否显示
  buildEdit: false,  //修改楼房是否显示
  addFloor: false,  //添加楼层是否显示
  floorEdit: false,  //修改楼层是否显示
  addRoom: false,  //添加房间是否显示
  roomEdit: false,  //修改房间是否显示
  addBed: false,  //添加床位是否显示
  bedEdit: false,  //修改床位是否显示
  addAccidentType: false,  //添加事故类型是否显示
  addElderRegist: false,  //评估登记是否显示
  addElderRegistEdit: false, //评估登记是否修改
  abilityEdit: false,  //能力评估是否显示
  addHealth: false,  //体检登记是否显示
  addHealthEdit: false,  //体检登记是否修改
  addGoHospital: false,  //体检登记是否显示
  addGoHospitalEdit: false,  //体检登记是否修改
  addFoodType: false, //食物类别是否显示
  addFood: false,  //食物是否显示
  addAreas: false, //送餐区域是否显示
  addArea: false,  //送餐区域对应区域是否显示
  addOrder: false, //点餐是否显示
  selectFood: false,  //选择食物是否显示
  addRecipeType: false,  //食谱类别是否显示
  addRecipe: false,  //食谱是否显示
  isDelivery: false,  //送餐是否显示
  addDrug: false,  //添加药品是否显示
  addActive: false,  //添加活动是否显示
  isActive: false,  //添加活动是否修改
  addElders: false,  //参加老人是否显示
  addDrugSale: false,  //药品缴存是否显示
  addDrugList: false,  //选择药品是否显示
  addDrugSet: false,  //用药设置是否显示
  addAlways: false,  //常规用药登记是否显示
  addInterim: false,  //临时用药登记是否显示
  addSJZD: false,  //添加字典项
  ycglDetail: false,  //预存管理详情
  checkOutPay: false, //退住结算
  consume: false,  //消费情况是否显示
  checkInPay: false,  //入住缴费登记是否显示
  addHLXM: false,  //护理项目类型是否显示
  addHLXMEdit: false,  //护理项目是否显示
  isZDXQ: false,  //账单详情是否显示
  addNursPlan: false,  //护工排班方案是否显示
  addNursRelay: false,  //护工替班是否显示
  addHGPB: false,  //护工排班是否显示
  consumeDetail: false,  //账单调整是否显示
  addHLJB: false,  //护理级别是否显示
  editProject: false,  //任务设置是否显示
  addHGXZ: false,  //护理小组是否显示
  eldersList: false,  //选择老人是否显示
  nursePlans: false,  //查看计划是否显示
  addNurse: false,  //护工是否显示
  addDepart: false,  //添加部门是否显示
  addRelation: false,  //添加亲属是否显示
  addCYCWHL: false,  //餐饮床位护理是否显示
  addHealthEst: false,  //健康评估登记是否显示
  sideData: [],  //侧边栏
  checkinId: 0,  //重新入住
  isCollapse: false,  //侧边栏是否变换
  elderEdit: false,  //老人信息详情是否显示
  update: false,  //系统更新是否显示
  elderAbility: false,  //老人信息能力评估
  ckszEdit: false,   //仓库设置是否显示
  addWZLB: false,  //物资类别是否显示
  addWZ: false,  //物资编辑是否显示
  addRKGL: false,  //入库管理是否显示
  RKPrice: false,  //入库价格修改
  addCKGL: false,  //出库管理是否显示
  addWZDB: false,  //物资调拨是否显示
  WZDBApprove: false,  //物资调拨审批是否显示
  addKCPD: false,  //库存盘点新增是否显示
  repo_id: 0,  //仓库Id
  PDRepo: false,  //盘点列表是否显示
  PDChoose: false,  //盘点选择是否显示
  PDChooseList: [],  //盘点选择列表
  PDEdit: false,  //盘存详情是否显示
  PDCheck: false,  //盘村查看是否显示
  CKChoose: false,  //出库查看是否显示
  balance: false,  //年统计列表对比是否显示
  balanceData: [],  //年统计列表对比数据
  accessToken: "",  //token
  navNum: 1,  //导航点击id
  addAssistant: false,  //护工助手资料是否显示

}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
