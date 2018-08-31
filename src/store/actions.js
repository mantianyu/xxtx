import * as types from './mutations-types'

export default {
  manage({
    commit
  }) {
    commit(types.MANAGE)
  },
  promise({
    commit
  }) {
    commit(types.PROMISE)
  },
  manageEditOpen({
    commit
  }) {
    commit(types.MANAGE_EDIT_OPEN)
  },
  manageEditClose({
    commit
  }) {
    commit(types.MANAGE_EDIT_CLOSE)
  },
  JdzxManageEditOpen({
    commit
  }) {
    commit(types.JDZXMANAGEEDIT_EDIT_OPEN)
  },
  JdzxManageEditClose({
    commit
  }) {
    commit(types.JDZXMANAGEEDIT_EDIT_CLOSE)
  },
  JdzxManagechangeOpen({
    commit
  }) {
    commit(types.JDZXMANAGECHANGE_EDIT_TRUE)
  },
  JdzxManagechangeClose({
    commit
  }) {
    commit(types.JDZXMANAGECHANGE_EDIT_FALSE)
  },
  JdzxManageXqOpen({
    commit
  }) {
    commit(types.JDZXMANAGEXQ_EDIT_TRUE)
  },
  JdzxManageXqClose({
    commit
  }) {
    commit(types.JDZXMANAGEXQ_EDIT_FALSE)
  },
  rzdjEditTrue({
    commit
  }) {
    commit(types.RZDJ_EDIT_TRUE)
  },
  rzdjEditFalse({
    commit
  }) {
    commit(types.RZDJ_EDIT_FALSE)
  },

  JdyyEditOpen({
    commit
  }) {
    commit(types.JDYYEDIT_EDIT_TRUE)
  },
  JdyyEditClose({
    commit
  }) {
    commit(types.JDYYEDIT_EDIT_FALSE)
  },
  JdyyEditFalseOpen({
    commit
  }) {
    commit(types.JDYYEDITFALSE_EDIT_TRUE)
  },
  JdyyEditFalseClose({
    commit
  }) {
    commit(types.JDYYEDITFALSE_EDIT_FALSE)
  },

  YcglEditOpen({
    commit
  }) {
    commit(types.YCGLEDIT_EDIT_TRUE)
  },
  YcglEditClose({
    commit
  }) {
    commit(types.YCGLEDIT_EDIT_FALSE)
  },

  rzjfAddFalse({
    commit
  }) {
    commit(types.RZJFADD_FALSE)
  },
  rzjfAddTrue({
    commit
  }) {
    commit(types.RZJFADD_TRUE)
  },
  rzjfDetailFalse({
    commit
  }) {
    commit(types.RZJFDETAIL_FALSE)
  },
  rzjfDetailTrue({
    commit
  }) {
    commit(types.RZJFDETAIL_TRUE)
  },
  fylbEditFalse({
    commit
  }) {
    commit(types.FYLBEDIT_FALSE)
  },
  fylbEditTrue({
    commit
  }) {
    commit(types.FYLBEDIT_TRUE)
  },
  qfglCheckOutFalse({
    commit
  }) {
    commit(types.QFGL_CHECK_OUT_FALSE)
  },
  qfglCheckOutTrue({
    commit
  }) {
    commit(types.QFGL_CHECK_OUT_TRUE)
  },

  jcxxEditFalse({
    commit
  }) {
    commit(types.JCXXEDIT_FALSE)
  },
  jcxxEditTrue({
    commit
  }) {
    commit(types.JCXXEDIT_TRUE)
  },
  jcxxEditFalseFalse({
    commit
  }) {
    commit(types.JCXXEDITFALSE_FALSE)
  },
  jcxxEditFalseTrue({
    commit
  }) {
    commit(types.JCXXEDITFALSE_TRUE)
  },

  promiseEditOpen({
    commit
  }) {
    commit(types.PROMISE_EDIT_OPEN)
  },
  promiseEditClose({
    commit
  }) {
    commit(types.PROMISE_EDIT_CLOSE)
  },
  oldOutFalse({
    commit
  }) {
    commit(types.OLD_OUT_FALSE)
  },
  oldOutTrue({
    commit
  }) {
    commit(types.OLD_OUT_TRUE)
  },
  oldOutEditFalse({
    commit
  }) {
    commit(types.OLD_OUT_EDIT_FALSE)
  },
  oldOutEditTrue({
    commit
  }) {
    commit(types.OLD_OUT_EDIT_TRUE)
  },
  oldOutEditBackFalse({
    commit
  }) {
    commit(types.OLD_OUT_EDIT_BACK_FALSE)
  },
  oldOutEditBackTrue({
    commit
  }) {
    commit(types.OLD_OUT_EDIT_BACK_TRUE)
  },
  oldVisitEditFalse({
    commit
  }) {
    commit(types.OLD_VISIT_EDIT_FALSE)
  },
  oldVisitEditTrue({
    commit
  }) {
    commit(types.OLD_VISIT_EDIT_TRUE)
  },
  oldVisitEditBackFalse({
    commit
  }) {
    commit(types.OLD_VISIT_EDIT_BACK_FALSE)
  },
  oldVisitEditBackTrue({
    commit
  }) {
    commit(types.OLD_VISIT_EDIT_BACK_TRUE)
  },
  oldCheckOutFalse({
    commit
  }) {
    commit(types.OLD_CHECK_OUT_FALSE)
  },
  oldCheckOutTrue({
    commit
  }) {
    commit(types.OLD_CHECK_OUT_TRUE)
  },
  oldAccidentFalse({
    commit
  }) {
    commit(types.OLD_ACCIDENT_FALSE)
  },
  oldAccidentTrue({
    commit
  }) {
    commit(types.OLD_ACCIDENT_TRUE)
  },
  oldAccidentEditFalse({
    commit
  }) {
    commit(types.OLD_ACCIDENT_EDIT_FALSE)
  },
  oldAccidentEditTrue({
    commit
  }) {
    commit(types.OLD_ACCIDENT_EDIT_TRUE)
  },
  bedTypeEditFalse({
    commit
  }) {
    commit(types.BED_TYPE_EDIT_FALSE)
  },
  bedtypeEditTrue({
    commit
  }) {
    commit(types.BED_TYPE_EDIT_TRUE)
  },
  addBuildTrue({
    commit
  }) {
    commit(types.ADD_BUILD_TRUE)
  },
  addBuildFalse({
    commit
  }) {
    commit(types.ADD_BUILD_FALSE)
  },
  buildEditTrue({
    commit
  }) {
    commit(types.BUILD_EDIT_TRUE)
  },
  buildEditFalse({
    commit
  }) {
    commit(types.BUILD_EDIT_FALSE)
  },
  addFloorTrue({
    commit
  }) {
    commit(types.ADD_FLOOR_TRUE)
  },
  addFloorFalse({
    commit
  }) {
    commit(types.ADD_FLOOR_FALSE)
  },
  floorEditTrue({
    commit
  }) {
    commit(types.FLOOR_EDIT_TRUE)
  },
  floorEditFalse({
    commit
  }) {
    commit(types.FLOOR_EDIT_FALSE)
  },
  addRoomTrue({
    commit
  }) {
    commit(types.ADD_ROOM_TRUE)
  },
  addRoomFalse({
    commit
  }) {
    commit(types.ADD_ROOM_FALSE)
  },
  roomEditTrue({
    commit
  }) {
    commit(types.ROOM_EDIT_TRUE)
  },
  roomEditFalse({
    commit
  }) {
    commit(types.ROOM_EDIT_FALSE)
  },
  addBedTrue({
    commit
  }) {
    commit(types.ADD_BED_TRUE)
  },
  addBedFalse({
    commit
  }) {
    commit(types.ADD_BED_FALSE)
  },
  bedEditTrue({
    commit
  }) {
    commit(types.BED_EDIT_TRUE)
  },
  bedEditFalse({
    commit
  }) {
    commit(types.BED_EDIT_FALSE)
  },
  addAccidentTypeTrue({
    commit
  }) {
    commit(types.ADD_ACCIDENT_TYPE_TRUE)
  },
  addAccidentTypeFalse({
    commit
  }) {
    commit(types.ADD_ACCIDENT_TYPE_FALSE)
  },
  addElderRegistTrue({
    commit
  }) {
    commit(types.ADD_ELDER_REGIST_TRUE)
  },
  addElderRegistFalse({
    commit
  }) {
    commit(types.ADD_ELDER_REGIST_FALSE)
  },
  addElderRegistEditTrue({
    commit
  }) {
    commit(types.ADD_ELDER_REGIST_EDIT_TRUE)
  },
  addElderRegistEditFalse({
    commit
  }) {
    commit(types.ADD_ELDER_REGIST_EDIT_FALSE)
  },
  abilityEditTrue({
    commit
  }) {
    commit(types.ABILITY_EDIT_TRUE)
  },
  abilityEditFalse({
    commit
  }) {
    commit(types.ABILITY_EDIT_FALSE)
  },
  addHealthTrue({
    commit
  }) {
    commit(types.ADD_HEALTH_TRUE)
  },
  addHealthFalse({
    commit
  }) {
    commit(types.ADD_HEALTH_FALSE)
  },
  addHealthEditTrue({
    commit
  }) {
    commit(types.ADD_HEALTH_EDIT_TRUE)
  },
  addHealthEditFalse({
    commit
  }) {
    commit(types.ADD_HEALTH_EDIT_FALSE)
  },
  addGoHospitalTrue({
    commit
  }) {
    commit(types.ADD_GO_HOSPITAL_TRUE)
  },
  addGoHospitalFalse({
    commit
  }) {
    commit(types.ADD_GO_HOSPITAL_FALSE)
  },
  addGoHospitalEditTrue({
    commit
  }) {
    commit(types.ADD_GO_HOSPITAL_EDIT_TRUE)
  },
  addGoHospitalEditFalse({
    commit
  }) {
    commit(types.ADD_GO_HOSPITAL_EDIT_FALSE)
  },
  addFoodTypeTrue({
    commit
  }) {
    commit(types.ADD_FOOD_TYPE_TRUE)
  },
  addFoodTypeFalse({
    commit
  }) {
    commit(types.ADD_FOOD_TYPE_FALSE)
  },
  addFoodTrue({
    commit
  }) {
    commit(types.ADD_FOOD_TRUE)
  },
  addFoodFalse({
    commit
  }) {
    commit(types.ADD_FOOD_FALSE)
  },
  addAreasTrue({
    commit
  }) {
    commit(types.ADD_AREAS_TRUE)
  },
  addAreasFalse({
    commit
  }) {
    commit(types.ADD_AREAS_FALSE)
  },
  addAreaTrue({
    commit
  }) {
    commit(types.ADD_AREA_TRUE)
  },
  addAreaFalse({
    commit
  }) {
    commit(types.ADD_AREA_FALSE)
  },
  addOrderTrue({
    commit
  }) {
    commit(types.ADD_ORDER_TRUE)
  },
  addOrderFalse({
    commit
  }) {
    commit(types.ADD_ORDER_FALSE)
  },
  selectFoodTrue({
    commit
  }) {
    commit(types.SELECT_FOOD_TRUE)
  },
  selectFoodFalse({
    commit
  }) {
    commit(types.SELECT_FOOD_FALSE)
  },
  recipeTypeTrue({
    commit
  }) {
    commit(types.RECIPE_TYPE_TRUE)
  },
  recipeTypeFalse({
    commit
  }) {
    commit(types.RECIPE_TYPE_FALSE)
  },
  recipeTrue({
    commit
  }) {
    commit(types.RECIPE_TRUE)
  },
  recipeFalse({
    commit
  }) {
    commit(types.RECIPE_FALSE)
  },
  deliveryTrue({
    commit
  }) {
    commit(types.IS_DELIVERY_TRUE)
  },
  deliveryFalse({
    commit
  }) {
    commit(types.IS_DELIVERY_FALSE)
  },
  addDrugTrue({
    commit
  }) {
    commit(types.ADD_DRUG_TRUE)
  },
  addDrugFalse({
    commit
  }) {
    commit(types.ADD_DRUG_FALSE)
  },
  addActiveTrue({
    commit
  }) {
    commit(types.ADD_ACTIVE_TRUE)
  },
  addActiveFalse({
    commit
  }) {
    commit(types.ADD_ACTIVE_FALSE)
  },
  isActiveTrue({
    commit
  }) {
    commit(types.IS_ACTIVE_TRUE)
  },
  isActiveFalse({
    commit
  }) {
    commit(types.IS_ACTIVE_FALSE)
  },
  addEldersTrue({
    commit
  }) {
    commit(types.ADD_ELDERS_TRUE)
  },
  addEldersFalse({
    commit
  }) {
    commit(types.ADD_ELDERS_FALSE)
  },
  addDrugSaleTrue({
    commit
  }) {
    commit(types.ADD_DRUG_SALE_TRUE)
  },
  addDrugSaleFalse({
    commit
  }) {
    commit(types.ADD_DRUG_SALE_FALSE)
  },
  addDrugListTrue({
    commit
  }) {
    commit(types.ADD_DRUG_LIST_TRUE)
  },
  addDrugListFalse({
    commit
  }) {
    commit(types.ADD_DRUG_LIST_FALSE)
  },
  addDrugSetTrue({
    commit
  }) {
    commit(types.ADD_DRUG_SET_TRUE)
  },
  addDrugSetFalse({
    commit
  }) {
    commit(types.ADD_DRUG_SET_FALSE)
  },
  addAlwaysTrue({
    commit
  }) {
    commit(types.ADD_ALWAYS_TRUE)
  },
  addAlwaysFalse({
    commit
  }) {
    commit(types.ADD_ALWAYS_FALSE)
  },
  addInterimTrue({
    commit
  }) {
    commit(types.ADD_INTERIM_TRUE)
  },
  addInterimFalse({
    commit
  }) {
    commit(types.ADD_INTERIM_FALSE)
  },
  addSJZDTrue({
    commit
  }) {
    commit(types.ADD_SJZD_TRUE)
  },
  addSJZDFalse({
    commit
  }) {
    commit(types.ADD_SJZD_FALSE)
  },
  ycglDetailTrue({
    commit
  }) {
    commit(types.YCGL_DETAIL_TRUE)
  },
  ycglDetailFalse({
    commit
  }) {
    commit(types.YCGL_DETAIL_FALSE)
  },
  checkOutPayTrue({
    commit
  }) {
    commit(types.CHECK_OUT_PAY_TRUE)
  },
  checkOutPayFalse({
    commit
  }) {
    commit(types.CHECK_OUT_PAY_FALSE)
  },
  consumeTrue({
    commit
  }) {
    commit(types.CONSUME_TRUE)
  },
  consumeFalse({
    commit
  }) {
    commit(types.CONSUME_FALSE)
  },
  checkInPayTrue({
    commit
  }) {
    commit(types.CHECK_IN_PAY_TRUE)
  },
  checkInPayFalse({
    commit
  }) {
    commit(types.CHECK_IN_PAY_FALSE)
  },
  addHLXMTrue({
    commit
  }) {
    commit(types.ADD_HLXM_TRUE)
  },
  addHLXMFalse({
    commit
  }) {
    commit(types.ADD_HLXM_FALSE)
  },
  addHLXMEditTrue({
    commit
  }) {
    commit(types.ADD_HLXM_EDIT_TRUE)
  },
  addHLXMEditFalse({
    commit
  }) {
    commit(types.ADD_HLXM_EDIT_FALSE)
  },
  isZDXQTrue({
    commit
  }) {
    commit(types.IS_ZDXQ_TRUE)
  },
  isZDXQFalse({
    commit
  }) {
    commit(types.IS_ZDXQ_FALSE)
  },
  addNursPlanTrue({
    commit
  }) {
    commit(types.ADD_NURS_PLAN_TRUE)
  },
  addNursPlanFalse({
    commit
  }) {
    commit(types.ADD_NURS_PLAN_FALSE)
  },
  addNursRelayTrue({
    commit
  }) {
    commit(types.ADD_NURS_RELAY_TRUE)
  },
  addNursRelayFalse({
    commit
  }) {
    commit(types.ADD_NURS_RELAY_FALSE)
  },
  addHGPBTrue({
    commit
  }) {
    commit(types.ADD_HGPB_TRUE)
  },
  addHGPBFalse({
    commit
  }) {
    commit(types.ADD_HGPB_FALSE)
  },
  consumeDetailTrue({
    commit
  }) {
    commit(types.CONSUME_DETAIL_TRUE)
  },
  consumeDetailFalse({
    commit
  }) {
    commit(types.CONSUME_DETAIL_FALSE)
  },
  addHLJBTrue({
    commit
  }) {
    commit(types.ADD_HLJB_TRUE)
  },
  addHLJBFalse({
    commit
  }) {
    commit(types.ADD_HLJB_FALSE)
  },
  editProjectTrue({
    commit
  }) {
    commit(types.EDIT_PROJECT_TRUE)
  },
  editProjectFalse({
    commit
  }) {
    commit(types.EDIT_PROJECT_FALSE)
  },
  addHGXZTrue({
    commit
  }) {
    commit(types.ADD_HGXZ_TRUE)
  },
  addHGXZFalse({
    commit
  }) {
    commit(types.ADD_HGXZ_FALSE)
  },
  eldersListTrue({
    commit
  }) {
    commit(types.ELDERS_LIST_TRUE)
  },
  eldersListFalse({
    commit
  }) {
    commit(types.ELDERS_LIST_FALSE)
  },
  nursePlansTrue({
    commit
  }) {
    commit(types.NURSE_PLANS_TRUE)
  },
  nursePlansFalse({
    commit
  }) {
    commit(types.NURSE_PLANS_FALSE)
  },
  addNurseTrue({
    commit
  }) {
    commit(types.ADD_NURSE_TRUE)
  },
  addAssistantTrue({
    commit
  }) {
    commit(types.ADD_ASSISTANT_TRUE)
  },
  addAssistantFalse({
    commit
  }) {
    commit(types.ADD_ASSISTANT_FALSE)
  },
  addNurseFalse({
    commit
  }) {
    commit(types.ADD_NURSE_FALSE)
  },
  addDepartTrue({
    commit
  }) {
    commit(types.ADD_DEPART_TRUE)
  },
  addDepartFalse({
    commit
  }) {
    commit(types.ADD_DEPART_FALSE)
  },
  addRelationTrue({
    commit
  }) {
    commit(types.ADD_RELATION_TRUE)
  },
  addRelationFalse({
    commit
  }) {
    commit(types.ADD_RELATION_FALSE)
  },
  addCYCWHLTrue({
    commit
  }) {
    commit(types.ADD_CYCWHL_TRUE)
  },
  addCYCWHLFalse({
    commit
  }) {
    commit(types.ADD_CYCWHL_FALSE)
  },
  addHealthEstTrue({
    commit
  }) {
    commit(types.ADD_HEALTH_EST_TRUE)
  },
  addHealthEstFalse({
    commit
  }) {
    commit(types.ADD_HEALTH_EST_FALSE)
  },
  sideBarSave({
    commit
  }, data) {
    commit(types.SIDEBARS, data)
  },
  checkinIdSave({
    commit
  }, data) {
    commit(types.CHECKINID, data)
  },
  isCollapse({
    commit
  }) {
    commit(types.ISCOLLAPSE)
  },
  elderEditTrue({
    commit
  }) {
    commit(types.ELDER_EDIT_TRUE)
  },
  elderEditFalse({
    commit
  }) {
    commit(types.ELDER_EDIT_FALSE)
  },
  updateTrue({
    commit
  }) {
    commit(types.UPDATE_TRUE)
  },
  updateFalse({
    commit
  }) {
    commit(types.UPDATE_FALSE)
  },
  elderAbilityTrue({
    commit
  }) {
    commit(types.ELDER_ABILITY_TRUE)
  },
  elderAbilityFalse({
    commit
  }) {
    commit(types.ELDER_ABILITY_FALSE)
  },
  ckszEditTrue({
    commit
  }) {
    commit(types.CKSZ_EDIT_TRUE)
  },
  ckszEditFalse({
    commit
  }) {
    commit(types.CKSZ_EDIT_FLASE)
  },
  addWZLBTrue({
    commit
  }) {
    commit(types.ADD_WZLB_TRUE)
  },
  addWZLBFalse({
    commit
  }) {
    commit(types.ADD_WZLB_FALSE)
  },
  addWZTrue({
    commit
  }) {
    commit(types.ADD_WZ_TRUE)
  },
  addWZFalse({
    commit
  }) {
    commit(types.ADD_WZ_FALSE)
  },
  addRKGLTrue({
    commit
  }) {
    commit(types.ADD_RKGL_TRUE)
  },
  addRKGLFalse({
    commit
  }) {
    commit(types.ADD_RKGL_FALSE)
  },
  RKPriceTrue({
    commit
  }) {
    commit(types.RK_PRICE_TRUE)
  },
  RKPriceFalse({
    commit
  }) {
    commit(types.RK_PRICE_FALSE)
  },
  addCKGLTrue({
    commit
  }) {
    commit(types.ADD_CKGL_TRUE)
  },
  addCKGLFalse({
    commit
  }) {
    commit(types.ADD_CKGL_FALSE)
  },
  addWZDBTrue({
    commit
  }) {
    commit(types.ADD_WZDB_TRUE)
  },
  addWZDBFalse({
    commit
  }) {
    commit(types.ADD_WZDB_FALSE)
  },
  WZDBApproveTrue({
    commit
  }) {
    commit(types.WZDB_TRUE)
  },
  WZDBApproveFalse({
    commit
  }) {
    commit(types.WZDB_FALSE)
  },
  addKCPDTrue({
    commit
  }) {
    commit(types.ADD_KCPD_TRUE)
  },
  addKCPDFalse({
    commit
  }) {
    commit(types.ADD_KCPD_FALSE)
  },
  repoId({
    commit
  }, data) {
    commit(types.REPO_ID, data)
  },
  PDRepoTrue({
    commit
  }) {
    commit(types.PD_REPO_TRUE)
  },
  PDRepoFalse({
    commit
  }) {
    commit(types.PD_REPO_FALSE)
  },
  PDChooseTrue({
    commit
  }) {
    commit(types.PD_CHOOSE_TRUE)
  },
  PDChooseFalse({
    commit
  }) {
    commit(types.PD_CHOOSE_FALSE)
  },
  PDChooseList({
    commit
  }, data) {
    commit(types.PD_CHOOSE_LIST, data)
  },
  PDEditTrue({
    commit
  }) {
    commit(types.PD_EDIT_TRUE)
  },
  PDEditFalse({
    commit
  }) {
    commit(types.PD_EDIT_FALSE)
  },
  PDCheckTrue({
    commit
  }) {
    commit(types.PD_CHECK_TRUE)
  },
  PDCheckFalse({
    commit
  }) {
    commit(types.PD_CHECK_FALSE)
  },
  CKChooseTrue({
    commit
  }) {
    commit(types.CK_CHOOSE_TRUE)
  },
  CKChooseFalse({
    commit
  }) {
    commit(types.CK_CHOOSE_FALSE)
  },
  balanceTrue({
    commit
  }) {
    commit(types.BALANCE_TRUE)
  },
  balanceFalse({
    commit
  }) {
    commit(types.BALANCE_FALSE)
  },
  balanceData({
    commit
  }, data) {
    commit(types.BALANCE_DATA, data)
  },
  token({
    commit
  }, data) {
    commit(types.TOKEN, data)
  },
  navNum({
    commit
  }, data) {
    commit(types.NAVNUM, data)
  },
}
