<template>
  <div>
    <navg></navg>
    <div id="myChart" :style="{width:'100%', height: '600px'}"></div>
  </div>
</template>
<script>
// import excel from "@/utils/ejs.js";
import echarts from "echarts";
import { get, post, del } from "@/api/api.js";
import moment from "moment";
import navg from "@/components/subpages/nav";
export default {
  name: "analysis",
  components: {
    navg
  },

  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    this.$store.dispatch("getmember").then(() => {
      console.log("lastthen", this.$store.state);
      console.log(
        moment(this.$store.state.setting.formDynamic.date).format("YYYY-MM"),
        this.$store.getters.members
      );
      this.$store.dispatch("handlerdata", {
        m: this.$store.getters.members,
        month: moment(this.$store.state.setting.formDynamic.date).format(
          "YYYY-MM"
        )
      });
    }).then(() => {
        this.$store.dispatch("getlib")
      });
      
    this.drawLine();
    console.log("datamake", this.$store.getters.seriesdata);
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: moment(this.$store.state.setting.formDynamic.date).format("YYYY年MM月") },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: this.$store.getters.allcatalog
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.$store.getters.members
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.$store.getters.totalscore
      });
      window.onresize = myChart.resize;
    }
  }
};
</script>