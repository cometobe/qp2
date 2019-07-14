<template>
  <div>
    <navg></navg>
    <Card title="导入标准库">
      <Row>
        <Upload :before-upload="handleBeforeUpload" action accept=".xls, .xlsx">
          <Button
            :loading="uploadLoading"
            icon="ios-cloud-upload-outline"
            @click="handleUploadFile"
          >上传文件</Button>
        </Upload>
      <!-- </Row>
      <Row> -->
        <div v-if="file !== null" class="ivu-upload-list-file">
          <Icon type="ios-stats"/>
          {{ file.name }}
          <Icon
            v-show="showRemoveFile"
            type="ios-close"
            class="ivu-upload-list-remove"
            @click.native="handleRemove()"
          />
        </div>
      </Row>
      <Row>
        <transition name="fade">
          <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
            <div v-if="progressPercent == 100">
              <Icon type="ios-checkmark-circle"/>
              <span>成功</span>
            </div>
          </Progress>
        </transition>
      </Row>
    </Card>
    <Row class="margin-top-10">
      <Table stripe  :columns="tableTitle" :data="tableData1" />
    </Row>
    <!-- <row v-for="tab in tableData">
                {{ tab }}
    </row> -->
    <!-- {{this.$store.state.standlib.data}} -->
  </div>
</template>
<script>
import excel from "@/utils/excel.js";
import { get, post, del } from "@/api/api.js";
import navg from '@/components/subpages/nav'
export default {
  name: "stand",
  components: {
    navg
  },
  data() {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableLoading: false,
      tableTitle: [{title: '任务编号',key: '任务编号'},{title: '工作任务',key: '工作任务'},
    {title: '工作类别',key: '工作类别'},
    {title: '标准工时',key: '标准工时'},
    {title: '所需人手',key: '所需人手'},
    {title: '所需知识和技能程度',key: '所需知识和技能程度'},
    {title: '工作环境',key: '工作环境'},
    {title: '工作风险',key: '工作风险'},{title: '工作任务积分',key: '工作任务积分'},
    {title: '数据来源',key: '数据来源'},{title: '备注',key: '备注'}],      
    };
  },
  mounted(){
    // console.log(this.tableData,"数据检查",this.$store.state.standlib.data)
    // this.tableData = this.$store.state.standlib.data[0]
    // for(let i = 0 ; i<this.$store.state.standlib.data.length;i++){
    //   this.tableData.push(this.$store.state.standlib.data[i])
    // }
        // console.log(this.tableData,"数据检查",this.$store.state.standlib.data)
        // console.log("getter",this.$store.getters.members)
        //2更新标准库数据
    this.$store.dispatch("getlib").then(); 
  },
  computed:{
 tableData1(){
     return this.$store.state.standlib.data
   }
  },
  
  methods: {
    initUpload() {
      this.file = null;
      this.showProgress = false;
      this.loadingProgress = 0;
      // this.tableData = [];
      // this.tableTitle = [];
    },
    handleUploadFile() {
      this.initUpload();
    },
    handleRemove() {
      this.initUpload();
      this.$Message.info("数据库已删除！");
      del("/lib/clrall").then(res => {
        this.$Message.info(res.num+"条"+res.msg);
      }).then(
          res=>(
          this.$store.dispatch("getlib")
          ));; 
    },
    handleBeforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "文件：" +
            file.name +
            "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
        });
      }

      //清空数据库
      del("/lib/clrall").then(res => {
        this.$Message.info(res.num+"条"+res.msg);
      }); //怎么获取回调？
      return false;
    },
    // 读取文件
    readFile(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadstart = e => {
        this.uploadLoading = true;
        this.tableLoading = true;
        this.showProgress = true;
      };
      reader.onprogress = e => {
        this.progressPercent = Math.round((e.loaded / e.total) * 100);
      };
      reader.onerror = e => {
        this.$Message.error("文件读取出错");
      };
      reader.onload = e => {
        this.$Message.info("文件读取成功");
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        console.log("原始数据", header, results);
        // const Eheader = {
        //   工作任务: "task",
        //   任务编号: "taskid",
        //   工作类别: "taskcategory",
        //   标准工时: "reqhour",
        //   所需人手: "reqman",
        //   所需知识和技能程度: "reqskill",
        //   工作环境: "workenvironment",
        //   工作风险: "risk",
        //   工作任务积分: "score",
        //   数据来源: "source",
        //   备注: "mark"
        // };
        // const tableTitle = header.map(item => {
        //   return { title: item, key: item };
        // });
        // this.tableData = results;
        // this.tableTitle = tableTitle;
        this.uploadLoading = false;
        this.tableLoading = false;
        this.showRemoveFile = true;
        //将中文键值改为英文
        // const rdata = results.map(item => {
        //   let obj = {};
        //   for (let prop in item) {
        //     // 检测属性是否属于thead自身的
        //     // console.log("原始数据",prop,Eheader.hasOwnProperty(prop))
        //     if (Eheader.hasOwnProperty(prop)) {
        //       obj[Eheader[prop]] = item[prop];
        //       // console.log("数据修改", obj, item);
        //     }
        //   }
        //   return obj;
        // });
        // console.log("数据修改后", results, rdata);
        //上传数据库
        // for (let i = 0, len = results.length, text = ""; i < len; i++) {
        //   // console.log(results[i])
        //   post("/lib/add", results[i]);
        // }
         //一次性上传数据库
        post("/lib/adds", results).then(
          res=>(console.log("添加数据回调",res),
          this.$Message.info({content:res.msg,duration: 3}),
          this.$store.dispatch("getlib")
          ));
      };
    }
  }
};
</script>