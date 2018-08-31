import * as types from './mutations-types'

export default {
  [types.MANAGE](state) {
    state.manage = true
    state.promise = false
  },
  [types.PROMISE](state) {
    state.manage = false
    state.promise = true
  },
  [types.MANAGE_EDIT_OPEN](state) {
    state.manageEdit = true
  },
  [types.MANAGE_EDIT_CLOSE](state) {
    state.manageEdit = false
  },
  [types.JDZXMANAGEEDIT_EDIT_OPEN](state) {
    state.JdzxManageEdit = true
  },
  [types.JDZXMANAGEEDIT_EDIT_CLOSE](state) {
    state.JdzxManageEdit = false
  },
  [types.JDZXMANAGECHANGE_EDIT_TRUE](state) {
    state.JdzxManagechange = true
  },
  [types.JDZXMANAGECHANGE_EDIT_FALSE](state) {
    state.JdzxManagechange = false
  },
  [types.JDZXMANAGEXQ_EDIT_TRUE](state) {
    state.JdzxManageXqOpen = true
  },
  [types.JDZXMANAGEXQ_EDIT_FALSE](state) {
    state.JdzxManageXqOpen = false
  },
  [types.JDYYEDIT_EDIT_TRUE](state) {
    state.jdyyEdit = true
  },
  [types.JDYYEDIT_EDIT_FALSE](state) {
    state.jdyyEdit = false
  },
  [types.JDYYEDITFALSE_EDIT_TRUE](state) {
    state.jdyyEditFalse = true
  },
  [types.JDYYEDITFALSE_EDIT_FALSE](state) {
    state.jdyyEditFalse = false
  },

  [types.YCGLEDIT_EDIT_TRUE](state) {
    state.ycglEdit = true
  },
  [types.YCGLEDIT_EDIT_FALSE](state) {
    state.ycglEdit = false
  },
  [types.RZJFADD_FALSE](state) {
    state.rzjfAdd = false
  },
  [types.RZJFADD_TRUE](state) {
    state.rzjfAdd = true
  },
  [types.RZJFDETAIL_FALSE](state) {
    state.rzjfdetail = false
  },
  [types.RZJFDETAIL_TRUE](state) {
    state.rzjfdetail = true
  },
  [types.FYLBEDIT_FALSE](state) {
    state.fylbEdit = false
  },
  [types.FYLBEDIT_TRUE](state) {
    state.fylbEdit = true
  },
  [types.QFGL_CHECK_OUT_FALSE](state) {
    state.qfglcheckout = false
  },
  [types.QFGL_CHECK_OUT_TRUE](state) {
    state.qfglcheckout = true
  },

  [types.JCXXEDIT_FALSE](state) {
    state.jcxxEdit = false
  },
  [types.JCXXEDIT_TRUE](state) {
    state.jcxxEdit = true
  },

  [types.JCXXEDITFALSE_FALSE](state) {
    state.jcxxEditFalse = false
  },
  [types.JCXXEDITFALSE_TRUE](state) {
    state.jcxxEditFalse = true
  },
  [types.RZDJ_EDIT_TRUE](state) {
    state.rzdjEdit = true
  },
  [types.RZDJ_EDIT_FALSE](state) {
    state.rzdjEdit = false
  },

  [types.PROMISE_EDIT_OPEN](state) {
    state.promiseEdit = true
  },
  [types.PROMISE_EDIT_CLOSE](state) {
    state.promiseEdit = false
  },
  [types.OLD_OUT_FALSE](state) {
    state.old_out_flag = false
  },
  [types.OLD_OUT_TRUE](state) {
    state.old_out_flag = true
  },
  [types.OLD_OUT_EDIT_FALSE](state) {
    state.oldOutEdit = false
  },
  [types.OLD_OUT_EDIT_TRUE](state) {
    state.oldOutEdit = true
  },
  [types.OLD_OUT_EDIT_BACK_FALSE](state) {
    state.oldOutEditFalse = false
  },
  [types.OLD_OUT_EDIT_BACK_TRUE](state) {
    state.oldOutEditFalse = true
  },
  [types.OLD_VISIT_EDIT_FALSE](state) {
    state.oldVisitEdit = false
  },
  [types.OLD_VISIT_EDIT_TRUE](state) {
    state.oldVisitEdit = true
  },
  [types.OLD_VISIT_EDIT_BACK_FALSE](state) {
    state.oldVisitEditFalse = false
  },
  [types.OLD_VISIT_EDIT_BACK_TRUE](state) {
    state.oldVisitEditFalse = true
  },
  [types.OLD_CHECK_OUT_FALSE](state) {
    state.checkout = false
  },
  [types.OLD_CHECK_OUT_TRUE](state) {
    state.checkout = true
  },
  [types.OLD_ACCIDENT_FALSE](state) {
    state.oldAccident = false
  },
  [types.OLD_ACCIDENT_TRUE](state) {
    state.oldAccident = true
  },
  [types.OLD_ACCIDENT_EDIT_FALSE](state) {
    state.oldAccidentEdit = false
  },
  [types.OLD_ACCIDENT_EDIT_TRUE](state) {
    state.oldAccidentEdit = true
  },
  [types.BED_TYPE_EDIT_FALSE](state) {
    state.bedTypeEdit = false
  },
  [types.BED_TYPE_EDIT_TRUE](state) {
    state.bedTypeEdit = true
  },
  [types.ADD_BUILD_TRUE](state) {
    state.addBuild = true
  },
  [types.ADD_BUILD_FALSE](state) {
    state.addBuild = false
  },
  [types.BUILD_EDIT_TRUE](state) {
    state.buildEdit = true
  },
  [types.BUILD_EDIT_FALSE](state) {
    state.buildEdit = false
  },
  [types.ADD_FLOOR_TRUE](state) {
    state.addFloor = true
  },
  [types.ADD_FLOOR_FALSE](state) {
    state.addFloor = false
  },
  [types.FLOOR_EDIT_TRUE](state) {
    state.floorEdit = true
  },
  [types.FLOOR_EDIT_FALSE](state) {
    state.floorEdit = false
  },
  [types.ADD_ROOM_TRUE](state) {
    state.addRoom = true
  },
  [types.ADD_ROOM_FALSE](state) {
    state.addRoom = false
  },
  [types.ROOM_EDIT_TRUE](state) {
    state.roomEdit = true
  },
  [types.ROOM_EDIT_FALSE](state) {
    state.roomEdit = false
  },
  [types.ADD_BED_TRUE](state) {
    state.addBed = true
  },
  [types.ADD_BED_FALSE](state) {
    state.addBed = false
  },
  [types.BED_EDIT_TRUE](state) {
    state.bedEdit = true
  },
  [types.BED_EDIT_FALSE](state) {
    state.bedEdit = false
  },
  [types.ADD_ACCIDENT_TYPE_TRUE](state) {
    state.addAccidentType = true
  },
  [types.ADD_ACCIDENT_TYPE_FALSE](state) {
    state.addAccidentType = false
  },
  [types.ADD_ELDER_REGIST_TRUE](state) {
    state.addElderRegist = true
  },
  [types.ADD_ELDER_REGIST_FALSE](state) {
    state.addElderRegist = false
  },
  [types.ADD_ELDER_REGIST_EDIT_TRUE](state) {
    state.addElderRegistEdit = true
  },
  [types.ADD_ELDER_REGIST_EDIT_FALSE](state) {
    state.addElderRegistEdit = false
  },
  [types.ABILITY_EDIT_TRUE](state) {
    state.abilityEdit = true
  },
  [types.ABILITY_EDIT_FALSE](state) {
    state.abilityEdit = false
  },
  [types.ADD_HEALTH_TRUE](state) {
    state.addHealth = true
  },
  [types.ADD_HEALTH_FALSE](state) {
    state.addHealth = false
  },
  [types.ADD_HEALTH_EDIT_TRUE](state) {
    state.addHealthEdit = true
  },
  [types.ADD_HEALTH_EDIT_FALSE](state) {
    state.addHealthEdit = false
  },
  [types.ADD_GO_HOSPITAL_TRUE](state) {
    state.addGoHospital = true
  },
  [types.ADD_GO_HOSPITAL_FALSE](state) {
    state.addGoHospital = false
  },
  [types.ADD_GO_HOSPITAL_EDIT_TRUE](state) {
    state.addGoHospitalEdit = true
  },
  [types.ADD_GO_HOSPITAL_EDIT_FALSE](state) {
    state.addGoHospitalEdit = false
  },
  [types.ADD_FOOD_TYPE_TRUE](state) {
    state.addFoodType = true
  },
  [types.ADD_FOOD_TYPE_FALSE](state) {
    state.addFoodType = false
  },
  [types.ADD_FOOD_TRUE](state) {
    state.addFood = true
  },
  [types.ADD_FOOD_FALSE](state) {
    state.addFood = false
  },
  [types.ADD_AREAS_TRUE](state) {
    state.addAreas = true
  },
  [types.ADD_AREAS_FALSE](state) {
    state.addAreas = false
  },
  [types.ADD_AREA_TRUE](state) {
    state.addArea = true
  },
  [types.ADD_AREA_FALSE](state) {
    state.addArea = false
  },
  [types.ADD_ORDER_TRUE](state) {
    state.addOrder = true
  },
  [types.ADD_ORDER_FALSE](state) {
    state.addOrder = false
  },
  [types.SELECT_FOOD_TRUE](state) {
    state.selectFood = true
  },
  [types.SELECT_FOOD_FALSE](state) {
    state.selectFood = false
  },
  [types.RECIPE_TYPE_TRUE](state) {
    state.addRecipeType = true
  },
  [types.RECIPE_TYPE_FALSE](state) {
    state.addRecipeType = false
  },
  [types.RECIPE_TRUE](state) {
    state.addRecipe = true
  },
  [types.RECIPE_FALSE](state) {
    state.addRecipe = false
  },
  [types.IS_DELIVERY_TRUE](state) {
    state.isDelivery = true
  },
  [types.IS_DELIVERY_FALSE](state) {
    state.isDelivery = false
  },
  [types.ADD_DRUG_TRUE](state) {
    state.addDrug = true
  },
  [types.ADD_DRUG_FALSE](state) {
    state.addDrug = false
  },
  [types.ADD_ACTIVE_TRUE](state) {
    state.addActive = true
  },
  [types.ADD_ACTIVE_FALSE](state) {
    state.addActive = false
  },
  [types.IS_ACTIVE_TRUE](state) {
    state.isActive = true
  },
  [types.IS_ACTIVE_FALSE](state) {
    state.isActive = false
  },
  [types.ADD_ELDERS_TRUE](state) {
    state.addElders = true
  },
  [types.ADD_ELDERS_FALSE](state) {
    state.addElders = false
  },
  [types.ADD_DRUG_SALE_TRUE](state) {
    state.addDrugSale = true
  },
  [types.ADD_DRUG_SALE_FALSE](state) {
    state.addDrugSale = false
  },
  [types.ADD_DRUG_LIST_TRUE](state) {
    state.addDrugList = true
  },
  [types.ADD_DRUG_LIST_FALSE](state) {
    state.addDrugList = false
  },
  [types.ADD_DRUG_SET_TRUE](state) {
    state.addDrugSet = true
  },
  [types.ADD_DRUG_SET_FALSE](state) {
    state.addDrugSet = false
  },
  [types.ADD_ALWAYS_TRUE](state) {
    state.addAlways = true
  },
  [types.ADD_ALWAYS_FALSE](state) {
    state.addAlways = false
  },
  [types.ADD_INTERIM_TRUE](state) {
    state.addInterim = true
  },
  [types.ADD_INTERIM_FALSE](state) {
    state.addInterim = false
  },
  [types.ADD_SJZD_TRUE](state) {
    state.addSJZD = true
  },
  [types.ADD_SJZD_FALSE](state) {
    state.addSJZD = false
  },
  [types.YCGL_DETAIL_TRUE](state) {
    state.ycglDetail = true
  },
  [types.YCGL_DETAIL_FALSE](state) {
    state.ycglDetail = false
  },
  [types.CHECK_OUT_PAY_TRUE](state) {
    state.checkOutPay = true
  },
  [types.CHECK_OUT_PAY_FALSE](state) {
    state.checkOutPay = false
  },
  [types.CONSUME_TRUE](state) {
    state.consume = true
  },
  [types.CONSUME_FALSE](state) {
    state.consume = false
  },
  [types.CHECK_IN_PAY_TRUE](state) {
    state.checkInPay = true
  },
  [types.CHECK_IN_PAY_FALSE](state) {
    state.checkInPay = false
  },
  [types.ADD_HLXM_TRUE](state) {
    state.addHLXM = true
  },
  [types.ADD_HLXM_FALSE](state) {
    state.addHLXM = false
  },
  [types.ADD_HLXM_EDIT_TRUE](state) {
    state.addHLXMEdit = true
  },
  [types.ADD_HLXM_EDIT_FALSE](state) {
    state.addHLXMEdit = false
  },
  [types.IS_ZDXQ_TRUE](state) {
    state.isZDXQ = true
  },
  [types.IS_ZDXQ_FALSE](state) {
    state.isZDXQ = false
  },
  [types.ADD_NURS_PLAN_TRUE](state) {
    state.addNursPlan = true
  },
  [types.ADD_NURS_PLAN_FALSE](state) {
    state.addNursPlan = false
  },
  [types.ADD_NURS_RELAY_TRUE](state) {
    state.addNursRelay = true
  },
  [types.ADD_NURS_RELAY_FALSE](state) {
    state.addNursRelay = false
  },
  [types.ADD_HGPB_TRUE](state) {
    state.addHGPB = true
  },
  [types.ADD_HGPB_FALSE](state) {
    state.addHGPB = false
  },
  [types.CONSUME_DETAIL_TRUE](state) {
    state.consumeDetail = true
  },
  [types.CONSUME_DETAIL_FALSE](state) {
    state.consumeDetail = false
  },
  [types.ADD_HLJB_TRUE](state) {
    state.addHLJB = true
  },
  [types.ADD_HLJB_FALSE](state) {
    state.addHLJB = false
  },
  [types.EDIT_PROJECT_TRUE](state) {
    state.editProject = true
  },
  [types.EDIT_PROJECT_FALSE](state) {
    state.editProject = false
  },
  [types.ADD_HGXZ_TRUE](state) {
    state.addHGXZ = true
  },
  [types.ADD_HGXZ_FALSE](state) {
    state.addHGXZ = false
  },
  [types.ELDERS_LIST_TRUE](state) {
    state.eldersList = true
  },
  [types.ELDERS_LIST_FALSE](state) {
    state.eldersList = false
  },
  [types.NURSE_PLANS_TRUE](state) {
    state.nursePlans = true
  },
  [types.NURSE_PLANS_FALSE](state) {
    state.nursePlans = false
  },
  [types.ADD_NURSE_TRUE](state) {
    state.addNurse = true
  },
  [types.ADD_ASSISTANT_TRUE](state) {
    state.addAssistant = true
  },
  [types.ADD_ASSISTANT_FALSE](state) {
    state.addAssistant = false
  },
  [types.ADD_NURSE_FALSE](state) {
    state.addNurse = false
  },
  [types.ADD_DEPART_TRUE](state) {
    state.addDepart = true
  },
  [types.ADD_DEPART_FALSE](state) {
    state.addDepart = false
  },
  [types.ADD_RELATION_TRUE](state) {
    state.addRelation = true
  },
  [types.ADD_RELATION_FALSE](state) {
    state.addRelation = false
  },
  [types.ADD_CYCWHL_TRUE](state) {
    state.addCYCWHL = true
  },
  [types.ADD_CYCWHL_FALSE](state) {
    state.addCYCWHL = false
  },
  [types.ADD_HEALTH_EST_TRUE](state) {
    state.addHealthEst = true
  },
  [types.ADD_HEALTH_EST_FALSE](state) {
    state.addHealthEst = false
  },
  [types.SIDEBARS](state, res) {
    state.sideData = res;
  },
  [types.CHECKINID](state, res) {
    state.checkinId = res;
  },
  [types.ISCOLLAPSE](state) {
    state.isCollapse = !state.isCollapse
  },
  [types.ELDER_EDIT_TRUE](state) {
    state.elderEdit = true;
  },
  [types.ELDER_EDIT_FALSE](state) {
    state.elderEdit = false;
  },
  [types.UPDATE_TRUE](state) {
    state.update = true;
  },
  [types.UPDATE_FALSE](state) {
    state.update = false;
  },
  [types.ELDER_ABILITY_TRUE](state) {
    state.elderAbility = true;
  },
  [types.ELDER_ABILITY_FALSE](state) {
    state.elderAbility = false;
  },
  [types.CKSZ_EDIT_TRUE](state) {
    state.ckszEdit = true;
  },
  [types.CKSZ_EDIT_FLASE](state) {
    state.ckszEdit = false;
  },
  [types.ADD_WZLB_TRUE](state) {
    state.addWZLB = true;
  },
  [types.ADD_WZLB_FALSE](state) {
    state.addWZLB = false;
  },
  [types.ADD_WZ_TRUE](state) {
    state.addWZ = true;
  },
  [types.ADD_WZ_FALSE](state) {
    state.addWZ = false;
  },
  [types.ADD_RKGL_TRUE](state) {
    state.addRKGL = true;
  },
  [types.ADD_RKGL_FALSE](state) {
    state.addRKGL = false;
  },
  [types.RK_PRICE_TRUE](state) {
    state.RKPrice = true;
  },
  [types.RK_PRICE_FALSE](state) {
    state.RKPrice = false;
  },
  [types.ADD_CKGL_TRUE](state) {
    state.addCKGL = true;
  },
  [types.ADD_CKGL_FALSE](state) {
    state.addCKGL = false;
  },
  [types.ADD_WZDB_TRUE](state) {
    state.addWZDB = true;
  },
  [types.ADD_WZDB_FALSE](state) {
    state.addWZDB = false;
  },
  [types.WZDB_TRUE](state) {
    state.WZDBApprove = true;
  },
  [types.WZDB_FALSE](state) {
    state.WZDBApprove = false;
  },
  [types.ADD_KCPD_TRUE](state) {
    state.addKCPD = true;
  },
  [types.ADD_KCPD_FALSE](state) {
    state.addKCPD = false;
  },
  [types.REPO_ID](state, res) {
    state.repo_id = res;
  },
  [types.PD_REPO_TRUE](state) {
    state.PDRepo = true;
  },
  [types.PD_REPO_FALSE](state) {
    state.PDRepo = false;
  },
  [types.PD_CHOOSE_TRUE](state) {
    state.PDChoose = true;
  },
  [types.PD_CHOOSE_FALSE](state) {
    state.PDChoose = false;
  },
  [types.PD_CHOOSE_LIST](state, res) {
    state.PDChooseList = res;
  },
  [types.PD_EDIT_TRUE](state) {
    state.PDEdit = true;
  },
  [types.PD_EDIT_FALSE](state) {
    state.PDEdit = false;
  },
  [types.PD_CHECK_TRUE](state) {
    state.PDCheck = true;
  },
  [types.PD_CHECK_FALSE](state) {
    state.PDCheck = false;
  },
  [types.CK_CHOOSE_TRUE](state) {
    state.CKChoose = true;
  },
  [types.CK_CHOOSE_FALSE](state) {
    state.CKChoose = false;
  },
  [types.BALANCE_TRUE](state) {
    state.balance = true;
  },
  [types.BALANCE_FALSE](state) {
    state.balance = false;
  },
  [types.BALANCE_DATA](state, res) {
    state.balanceData = res;
  },
  [types.TOKEN](state, res) {
    state.accessToken = res;
  },
  [types.NAVNUM](state, res) {
    state.navNum = res;
  },
}
