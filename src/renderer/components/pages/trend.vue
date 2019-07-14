<template>
  <div>
    <navg></navg>
    <br />
    <div style="padding:10px">
      <Button type="primary" size="large" @click="exportData(1)">
        <Icon type="ios-download-outline"></Icon>数据导出
      </Button>
    </div>
    <br />
    <Table :columns="tableTitle" :data="fordata" size="small" ref="table"></Table>

    <!-- <Button type="primary" size="large" @click="exportData(2)">
      <Icon type="ios-download-outline"></Icon>Export sorting and filtered data
    </Button>
    <Button type="primary" size="large" @click="exportData(3)">
      <Icon type="ios-download-outline"></Icon>Export custom data
    </Button>-->
  </div>
</template>
<script>
import excel from "@/utils/ejs.js";
import { get, post, del } from "@/api/api.js";
import moment from "moment";
import navg from "@/components/subpages/nav";
export default {
  name: "DataQualityInspectionStatistics",
  components: {
    navg
  },
  data() {
    return {
      fordata: this.$store.state.output.outputdata,
      tableTitle: [
        { title: "序号", key: "序号" },
        { title: "人员", key: "人员" },
        { title: "时间", key: "时间" },
        { title: "工作类别", key: "工作类别" },
        { title: "工作任务", key: "工作任务" },
        { title: "任务编号", key: "任务编号" },
        { title: "工作任务基准积分", key: "工作任务基准积分" },
        { title: "工作完成质量系数", key: "工作完成质量系数" },
        { title: "最后积分", key: "最后积分" },
        { title: "备注工作内容", key: "备注工作内容" }
      ]
    };
  },
  mounted() {
  },
  methods: {
    exportData(type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename:
            this.$store.state.setting.formDynamic.team +
            moment(this.$store.state.setting.formDynamic.date).format("YYYY-MM")+
            "量化绩效数据"
        });
      } 
      // else if (type === 2) {
      //   this.$refs.table.exportCsv({
      //     filename: "Sorting and filtering data",
      //     original: false
      //   });
      // } else if (type === 3) {
      //   this.$refs.table.exportCsv({
      //     filename: "Custom data",
      //     columns: this.columns8.filter((col, index) => index < 4),
      //     data: this.data7.filter((data, index) => index < 4)
      //   });
      // }
    }
  }
};
</script>