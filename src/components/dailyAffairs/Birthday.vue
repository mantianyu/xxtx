<template>
  <div>
    <vue-event-calendar
      title="老人生日"
      :events="demoEvents"
      @day-changed="handleDayChanged"
      @month-changed="handleMonthChanged"
    ></vue-event-calendar>
  </div>
</template>

<script>
let today = new Date()
export default {
  name: 'app',
  data () {
    return {
      demoEvents: []
    }
  },
  mounted(){
    var Year = new Date().getFullYear();
    var Month = new Date().getMonth() + 1;
    var date = Year + '-' + Month;
    this.fetchMonthBirth(date);
  },
  methods: {
    handleDayChanged (data) {
      // this.fetchDayBirth(data);
    },
    handleMonthChanged (data) {
      var reg1 = new RegExp("年");
      var date = data.replace(reg1,"-");
      var reg2 = new RegExp("月");
      date = date.replace(reg2,"");
      this.fetchMonthBirth(date);
    },
    fetchDayBirth: async function(data){
      let url = this.api.getdayelderbrithday;
      var dayArr = data.date.split('/');
      var day = dayArr[0] + '-' + dayArr[1] + '-' + dayArr[2];
      var data = {
        'day': day
      }
      const res = await this.$http.post(url,data);
      var birth = res.data.data;
      this.demoEvents = [];
      if(birth){
        for(let i =0; i < birth.length; i++){
          var data = {
            date: `${today.getFullYear()}/${new Date(birth[i].birthday).getMonth() + 1}/${new Date(birth[i].birthday).getDate()}`,
            title: this.message.elderName + birth[i].name,
            desc: this.message.IDNumber + birth[i].id_number
          }
          this.demoEvents.push(data);
        }
      }
    },
    fetchMonthBirth: async function(date){
      let url = this.api.getmonthelderbrithday;
      var data = {
        'date': date
      }
      const res = await this.$http.post(url,data);
      var birth = res.data.data;
      this.demoEvents = [];
      if(birth){
        for(let i =0; i < birth.length; i++){
          var data = {
            date: `${today.getFullYear()}/${new Date(birth[i].birthday).getMonth() + 1}/${new Date(birth[i].birthday).getDate()}`,
            title: this.message.elderName + birth[i].name,
            desc: this.message.IDNumber + birth[i].id_number
          }
          this.demoEvents.push(data);
        }
      }
    }
  }
}
</script>

<style>
  .title{
    border: 0 !important;
  }
  .cal-events{
    overflow-x: hidden !important;
  }
</style>