<template>
  <div>
    <navg></navg>
    <div v-for="(item,index) in uploadlist" style="padding:10px"> 
        <Row>
          <Col span="1" offset="0"> 
        <Button @click="deletedata(index)" icon="md-close" type="warning" ghost></Button>
          </col>
          <Col span="5" offset="1">
        <Upload :before-upload="(item)=> handleUpload(index, item)" action accept=".xls, .xlsx" >
          <Tooltip :content="contents[index]" >
            <Button icon="ios-cloud-upload-outline">上传{{ item.title }}数据文件</Button>
            </Tooltip>
          </Upload>
          </col>
        <Col span="4" offset="1"> 
          <p v-if="item !== null">{{ item.title }}文件名:{{ item.filename }}</p>
        </col>
        </Row>
        <Divider dashed />
    </div>
    <!-- <Button
      type="primary"
      @click="upload"
      :loading="loadingStatus"
    >{{ loadingStatus ? '上传中...' : '点击上传处理' }}</Button> -->
<!-- <p>{{this.$store.state.otherdata.database}}</p> -->

<Row class="padding:10px">
      <Col span="22" offset="1"> <Card><p>填写下表并提交可以添加单条数据： </p>
<Form :model="formLeft" label-position="left" >
  <Row class="padding:2px">
      <Col span="12" offset="0"> 
        <FormItem label="工作任务" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
          <Select v-model="o.task" filterable style="width:400px" placeholder="请选择或者输入搜索关键字">
        <Option v-for="item in alltasks" :value="item" :key="item" >{{ item }}</Option>
    </Select>
        </FormItem>
        </col>
      <Col span="6" offset="0"> 
        <FormItem label="人员" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <!-- <Input v-model="formLeft.input1"></Input> -->
            <Select v-model="o.mem" style="width:200px">
        <Option v-for="item in allteam" :value="item" :key="item">{{ item }}</Option>
    </Select>
        </FormItem>
        </col>
        <Col span="6" offset="0"> 
        <FormItem label="日期" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <DatePicker @on-change="o.date=$event"
 v-model="o.date" format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        </col>
        <!-- <Col span="6" offset="0"> 
        <FormItem label="工作类别">
            <Input v-model="formLeft.input3"></Input>
        </FormItem>
        </col> -->
        
        <!-- <Col span="6" offset="0"> 
        <FormItem label="任务编号">
            <Select v-model="o.taskid" style="width:200px">
        <Option v-for="item in alltaskids" :value="item" :key="item">{{ item }}</Option>
    </Select>
        </FormItem>
        </col> -->
        <Col span="6" offset="0"> 
        <FormItem label="工作完成质量系数" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <Input v-model="o.q" style="padding-right:5px"></Input>
        </FormItem>
        </col>
        <Col span="6" offset="0"> 
        <FormItem label="备注工作内容" >
            <Input v-model="o.mark" style="padding-right:5px"></Input>
        </FormItem>
        </col>
        <Col span="6" offset="4"> 
        <FormItem  style="padding-top:32px" >
            <Button type="primary" long @click="handlerone">提交</Button>
        </FormItem>
        </col>
    </Row>
    </Form></Card>
    </col>
    </Row>
    
    <Row class="padding:10px">
      <Col span="22" offset="1"> 
      <Card><p>上传的其他数据显示在下表中，可以点击删除按钮删除数据库中的对应数据 </p></Card>
      <Table stripe  :columns="tableTitle" :data="tableData1" />
      </col>
    </Row>
  </div>
</template>
<script>
import excel from "@/utils/excelmant.js";
import excelo from "@/utils/excel.js";
import { mapState ,mapActions} from 'vuex'
import { get, post, del } from "@/api/api.js";
import moment from "moment";
import navg from "@/components/subpages/nav";
export default {
  components: {
    navg
  },
  data() {
    return {
      o:{
        mem:"",
        date:"",
        task:"",
        q:1,
        mark:""
      },
      alltaskids :this.$store.getters.alltaskid,
      alltasks:this.$store.getters.alltask,
      formLeft: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
      tableTitle: [
                    {
                        title: '人员',
                        key: '人员',
                    },
                    {
                        title: '时间',
                        key: '时间'
                    },
                    {
                        title: '工作类别',
                        key: '工作类别'
                    },
                    {
                        title: '工作任务',
                        key: '工作任务'
                    },
                    {
                        title: '任务编号',
                        key: '任务编号'
                    },
                    {
                        title: '工作任务基准积分',
                        key: '工作任务基准积分'
                    },
                    {
                        title: '工作完成质量系数',
                        key: '工作完成质量系数'
                    },
                    {
                        title: '最后积分',
                        key: '最后积分'
                    },
                    {
                        title: '备注工作内容',
                        key: '备注工作内容'
                    },
                    {
                        title: '操作',
                        key: '操作',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                          console.log(params.row._id)
                                          // this.remove(params.index)
                                          get("/odata/delete",params.row._id).then(res => {
                                          this.$Message.info( res.msg);
                                          this.$store.dispatch("getodata")
                                        });
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
      tableData:this.$store.state.otherdata.database,
      uploadlist: [
        { title: "生产", filename: "" },
        { title: "缺陷", filename: "" },
        { title: "日志", filename: "" },
        { title: "操作票", filename: "" },
        { title: "工作票", filename: "" },
        { title: "其他", filename: "" },
      ],
      loadingStatus: false,
      team: [],
      config: this.$store.state.setting,
      contents:["请在此处上传维护检修系统周计划导出数据","请在此处上传缺陷导出数据","请在此处上传安全活动记录导出数据","请在此处上传人资要求格式补充的数据文档","请在此处上传操作票统计导出数据","请在此处上传工作票统计导出数据"]
    };
  },
  computed: {
    teammembers() {
      let lists = [];
      // console.log("cpmputed检查", this.$store.state.setting);
      let state = this.$store.state.setting;
      if (state != undefined) {
        for (let t of state.formDynamic.items) {
          // console.log("item分解", t);
          lists.push(t.value);
        }
        return lists;
      } else {
        return lists;
      }
    },
   tableData1(){
     return this.$store.state.otherdata.database
   },
   allteam(){
     return this.$store.getters.members
   }
  },
  mounted(){
    this.$store.dispatch("getodata");
    console.log("mounted getters",this.$store.getters.alltaskid)
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
  },
  methods: {
    handlerone(){
      post("/odata/formadd",this.o).then((res)=>{
        this.$Message.info( res.msg),
        this.$store.dispatch("getodata");
        this.o.task="",this.o.mark=""

        
        // this.$store.dispatch("getodata"),res => {
        //     this.$Message.info(res.num + "条" + res.msg);
            // this.tableData1 =[];
            // console.log("this.$store.dispatch",this.$$store)
            }
          // });
      )
    },
            remove (index) {
                // this.tableData.splice(index, 1);
            },

    deletedata(index){
      let that = this
        console.log("index",index)
        if (index == 0){
          get("/pdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
            this.$store.dispatch("handlerdata")
          });
        }
        else if(index ==1 ){
          get("/fdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
          });
        }
        else if(index == 2){
          get("/sdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
          });
        }else if(index ==5 ){
          get("/odata/clrall").then(this.$store.dispatch("getodata"),res => {
            this.$Message.info(res.num + "条" + res.msg);
            // this.tableData1 =[];
            console.log("this.$store.dispatch",this.$store)
            
          });
        }else if(index ==3){
          get("/czdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
          });
        }else if(index == 4){
          get("/gzdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
          });
        }
    },
    handleUpload(index, file) {
      console.log("上传的文件", file, index, this.teammembers);
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      console.log("后缀检查", fileExt);
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.uploadlist[index].filename = file.name; //文件名显示
        // console.log(this.uploadlist);
        this.readFile(index, file);
        // this.file = file;
        console.log("文件读取", file);
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc:
            "文件：" +
            file.name +
            "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。"
        });
      }

      return false;
    },
    upload(filename) {
      this.loadingStatus = true;
      setTimeout(() => {
        this.filename = null;
        this.loadingStatus = false;
        this.$Message.success("Success");
      }, 1500);
    },
    readFile(index, file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      // reader.onloadstart = e => {
      //   this.uploadLoading = true;
      //   this.tableLoading = true;
      //   this.showProgress = true;
      // };
      // reader.onprogress = e => {
      //   this.progressPercent = Math.round((e.loaded / e.total) * 100);
      // };
      reader.onerror = e => {
        this.$Message.error("文件读取出错");
      };
      reader.onload = e => {
        this.$Message.info("文件读取成功");
        const data = e.target.result;
        //要增加文件内容的校验，否则结果会混乱，每个里面用HEADER来校验格式
        if (index == 0) {
          const { header, results } = excel.read(data, "array",1);
          console.log("原始数据", index, header, results);
          //生产数据处理
          let mdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let templ = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          console.log(mdata, "新数组");
          // var ndata = new Promise(function(resolve, reject) {
          let ndata = []; //用于上传
          for (let i = 0, len = results.length; i < len; i++) {
            if (results[i]["计划状态"] == "已完成") {
              //只处理已完成的计划
              mdata[i]["任务编号"] = results[i]["工作内容"].substr(0, [4]);
              mdata[i]["时间"] = moment(results[i]["实际结束时间"]).format("YYYY-MM-DD");
              mdata[i]["备注工作内容"] = results[i]["工作内容"];
              mdata[i]["工作负责人"] = results[i]["工作负责人"];
              mdata[i]["工作成员"] = results[i]["工作成员"];
              mdata[i]["计划编号"] = results[i]["计划编号"];
              // mdata[i]["工作完成质量系数"] = 1
              templ[i] = excel.clone(mdata[i]);
              if (templ[i] != undefined) {
                //排除因未完成状态删除了的值
                let member1,
                  member2 = [];
                member1 = templ[i]["工作负责人"].split(";");
                if (templ[i]["工作成员"] != undefined) {
                  //&& mdata[i]['工作成员'].length>1
                  member2 = templ[i]["工作成员"].split(";");
                }
                let member = member1.concat(member2); //人员是站内人员数据才有效，在最后查询环节去筛选
                // console.log(member);
                for (let m in member) {
                  let odata = {};
                  odata["时间"] = templ[i]["时间"];
                  odata["任务编号"] = templ[i]["任务编号"];
                  odata["备注工作内容"] = templ[i]["备注工作内容"];
                  odata["人员"] = member[m];
                  odata["_id"] = templ[i]["计划编号"] + "m" + odata["人员"]; //给ID，以便保持数据唯一性
                  ndata.push(odata);
                }
              }
            } else {
              this.$Message.info({
                content: results[i]["计划编号"] + "任务状态不是<已完成>",
                // content:"任务编号《" +mdata[i].taskid +"》错误，请修改后重试",
                duration: 5
              });
            }
          } //for
          del("/pdata/clrall").then(res => {
            this.$Message.info(res.num + "条" + res.msg);
            for (let n in ndata) {
              //上传数据库
              post("/pdata/add", ndata[n]).then(res => {
                // console.log("回调", n,res);
                return;
              });
            }
          });
        } else if (index == 1) {
          const { header, results } = excel.read(data, "array",1);
          console.log("原始数据", index, header, results);
          //缺陷数据处理
          let fdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let ffdata = []; //用于上传
          console.log(index, header, results, fdata, this.config);
          for (let i = 0, len = results.length; i < len; i++) {
            fdata[i] = results[i];
            let memberf = fdata[i]["发现人"].split(";");
            console.log(memberf);
            for (let m = 0; m < memberf.length - 1; m++) {
              let zdata = {};
              zdata.人员 = memberf[m];
              zdata._id =
                fdata[i]["缺陷编号"] + memberf[m] + "f" + fdata[i]["发现时间"];
              zdata.备注工作内容 = fdata[i]["缺陷编号"] + fdata[i]["缺陷描述"];
              zdata.时间 = moment(fdata[i]["发现时间"]).format("YYYY-MM-DD");
              if (fdata[i]["缺陷等级"] == "紧急") {
                zdata.工作任务 = "紧急缺陷发现";
                zdata.任务编号 = this.config.formDynamic.edefectf;
              } else if (fdata[i]["缺陷等级"] == "重大") {
                zdata.工作任务 = "重大缺陷发现";
                zdata.任务编号 = this.config.formDynamic.vdefectf;
              } else if (fdata[i]["缺陷等级"] == "一般") {
                zdata.工作任务 = "一般缺陷发现";
                zdata.任务编号 = this.config.formDynamic.ndefectf;
              }
              ffdata.push(zdata);
            }
            if (fdata[i]["验收人"] != undefined) {
              let membert = fdata[i]["验收人"].split(";");
              console.log(membert, "yanshou");
              for (let m = 0; m < membert.length; m++) {
                let xdata = {};
                xdata.人员 = membert[m];
                xdata._id =
                  fdata[i]["缺陷编号"] +
                  membert[m] +
                  "t" +
                  fdata[i]["验收时间"];
                xdata.备注工作内容 =
                  fdata[i]["缺陷编号"] + fdata[i]["缺陷描述"];
                xdata.时间 = moment(fdata[i]["验收时间"]).format("YYYY-MM-DD");
                if (fdata[i]["缺陷等级"] == "紧急") {
                  xdata.工作任务 = "紧急缺陷验收";
                  xdata.任务编号 = this.config.formDynamic.edefectt;
                } else if (fdata[i]["缺陷等级"] == "重大") {
                  xdata.工作任务 = "重大缺陷验收";
                  xdata.任务编号 = this.config.formDynamic.vdefectt;
                } else if (fdata[i]["缺陷等级"] == "一般") {
                  xdata.工作任务 = "一般缺陷验收";
                  xdata.任务编号 = this.config.formDynamic.ndefectt;
                }
                ffdata.push(xdata);
              }
            }
          }
          console.log(ffdata.length);
          del("/fdata/clrall").then(r => {
            //上传前清空数据库
            for (let f = 0; f < ffdata.length; f++) {
              //上传数据库
              post("/fdata/add", ffdata[f]).then(res => {
                console.log("回调", f, res);
                return;
              });
            }
          });
        } else if (index == 2) {
          const { header, results } = excelo.read(data, "array");
          // console.log("原始数据", index, header, results);

          //日志数据处理
          let sdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let ssdata = []; //用于上传
          // console.log(index, header, results, sdata, this.config);
          for (let i = 0, len = results.length; i < len; i++) {
            sdata[i] = results[i];
            let memberf = sdata[i]["参加人员"].split("、");
            let memberr = sdata[i]["记录人"];
            console.log(memberf);
            let ttdata = {};
            ttdata.人员 = sdata[i]["记录人"];
            ttdata._id =
              sdata[i]["日期"] +
              sdata[i]["记录人"] +
              "w" +
              sdata[i]["运行记录时间"];
            ttdata.备注工作内容 = "记录安全活动" + sdata[i]["活动主题"];
            ttdata.时间 = sdata[i]["日期"];
            ttdata.任务编号 = this.config.formDynamic.securew;
            ssdata.push(ttdata);
            for (let m = 0; m < memberf.length; m++) {
              let tdata = {};
              tdata.人员 = memberf[m];
              tdata._id =
                sdata[i]["日期"] + memberf[m] + "f" + sdata[i]["运行记录时间"];
              tdata.备注工作内容 = "参加安全活动" + sdata[i]["活动主题"];
              tdata.时间 = sdata[i]["日期"];
              tdata.任务编号 = this.config.formDynamic.securei;
              ssdata.push(tdata);
            }
            
          }
          console.log(ssdata.length, ssdata);
          del("/sdata/clrall").then(r => {
            //上传前清空数据库
            for (let s = 0; s < ssdata.length; s++) {
              //上传数据库
              post("/sdata/add", ssdata[s]).then(res => {
                console.log("回调", s, res);
                return;
              });
            }
          });
        } else if (index == 5) {
          //其他数据处理
          const { header, results } = excelo.read(data, "array");
          let odata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let oodata = []; //用于上传
          console.log("加扣分表", index, header, results, odata, this.config);
          for (let i = 0, len = results.length; i < len; i++) {
            odata[i] = results[i];
            odata[i]._id =
              odata[i]["时间"] +
              odata[i]["人员"] +
              "-" +
              odata[i]["备注工作内容"];
            oodata.push(odata[i]);
          }
          console.log(oodata.length, oodata);
          del("/odata/clrall").then(r => {
            //上传前清空数据库
            for (let o = 0; o < oodata.length; o++) {
              //上传数据库
              post("/odata/add", oodata[o]).then(res => {
                console.log("回调", o, res);
                if(o ==oodata.length-1){
                  this.$store.dispatch("getodata")
                }
                return;
              });
            }
          });
        } else if (index == 3) {
          //操作票数据处理
          const { header, results } = excelo.read(data, "array");
          console.log("原始数据", index, header, results);
          let cdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let czdata = []; //用于上传
          for (let i = 0, len = results.length; i < len; i++) {
            let ctemp = {}
            cdata[i] = results[i];
            ctemp.人员 = cdata[i]["人员名称"]
            ctemp.任务编号 = this.config.formDynamic.cz;
            ctemp.时间 =  this.$store.state.setting.formDynamic.date+"-01";
            ctemp.cznumb = cdata[i]["操作总项数"]+cdata[i]["监护总项数"]
            ctemp.备注工作内容 = this.config.formDynamic.team+this.config.formDynamic.date.substr(0, [7])+"月操作得分";
            czdata.push(ctemp)
          }console.log(czdata.length, czdata);
          del("/czdata/clrall").then(cz => {
            //上传前清空数据库
            for (let cz = 0; cz < czdata.length; cz++) {
              //上传数据库
              post("/czdata/add", czdata[cz]).then(res => {
                console.log("回调", cz, res);
                return;
              });
            }
          });
        } else if (index == 4) {
          //工作票数据处理
          const { header, results } = excel.read(data, "array",2);
          console.log("原始数据", index, header, results);
          let gdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let gzdata = []; //用于上传
          for (let i = 0, len = results.length; i < len; i++) {
            let ctemp = {}
            gdata[i] = results[i];
            ctemp.人员 = gdata[i]["__EMPTY"]
            ctemp.任务编号 = this.config.formDynamic.gz;
            ctemp.时间 = this.config.formDynamic.date+"-01";
            ctemp.gznumb = gdata[i]["工作终结许可人_3"]+gdata[i]["工作许可人_3"]
            ctemp.备注工作内容 = this.config.formDynamic.team+this.config.formDynamic.date.substr(0, [7])+"月工作票得分";
            gzdata.push(ctemp)
          }console.log(gzdata.length, gzdata);
          del("/gzdata/clrall").then(gz => {
            //上传前清空数据库
            for (let gz = 0; gz < gzdata.length; gz++) {
              //上传数据库
              post("/gzdata/add", gzdata[gz]).then(res => {
                console.log("回调", gz, res);
                return;
              });
            }
          });
        } else {
        }
        // const rdata = results.map(item => {
        //   let obj = {};
        //   for (let prop in item) {
        // 检测属性是否属于thead自身的
        // console.log("原始数据",prop,Eheader.hasOwnProperty(prop))
        // if (Eheader.hasOwnProperty(prop)) {
        // obj[Eheader[prop]] = item[prop];
        // console.log("数据修改", obj, item);
        // }
        //   }
        //   return obj;
        // });
        // console.log("数据修改后", results, rdata);
        //上传数据库
        // for (let i = 0, len = rdata.length, text = ""; i < len; i++) {
        //   console.log(results[i]);
        //   // post("/pdata/add", rdata[i]);
        // }
      };
    }
  }
};
</script>
<style>
.center{
        width: 300px;
        margin: 10px auto;
        overflow: hidden;
    }
.center-right{
        float: right;
    }

.ivu-divider-horizontal{
  margin: 5px;
}
</style>