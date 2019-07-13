
<template>
  <div>
    <navg></navg>
    <div v-for="(item,index) in uploadlist">
      <Upload :before-upload="(item)=> handleUpload(index, item)" action accept=".xls, .xlsx">
        <Button icon="ios-cloud-upload-outline">选择{{ item.title }}数据文件</Button>
      </Upload>
      <div v-if="item !== null">{{ item.title }}文件:{{ item.filename }}</div>
    </div>
    <Button
      type="primary"
      @click="upload"
      :loading="loadingStatus"
    >{{ loadingStatus ? '上传中...' : '点击上传处理' }}</Button>
  </div>
</template>
<script>
import excel from "@/utils/excelmant.js";
import { get, post, del } from "@/api/api.js";

import navg from "@/components/subpages/nav";
export default {
  components: {
    navg
  },
  data() {
    return {
      uploadlist: [
        { title: "生产", filename: "" },
        { title: "缺陷", filename: "" },
        { title: "日志", filename: "" },
        { title: "其他", filename: "" },
        { title: "两票", filename: "" }
      ],
      loadingStatus: false,
      team: []
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
    }
  },
  methods: {
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
        const { header, results } = excel.read(data, "array");
        console.log("原始数据", index, header, results);
        //要增加文件内容的校验，否则结果会混乱，每个里面用HEADER来校验格式
        if (index == 0) {
          // get("/pdata/clrall");
          //生产数据处理
          let mdata = Array.from({ length: results.length }, () => ({})); //临时生产数据集
          let templ = Array.from({ length: results.length }, () => ({})); //临时生产数据集

          console.log(mdata, "新数组");
          let flag=0;
          var ndata = new Promise(function(resolve, reject) {
            let zdata = []; //用于上传
            for (let i = 0, len = results.length; i < len; i++) {
              flag++
              console.log(flag)
              if (results[i]["计划状态"] == "已完成") {
                //只处理已完成的计划
                mdata[i].taskid = results[i]["工作内容"].substr(0, [4]);
                mdata[i]["时间"] = results[i]["实际结束时间"];
                mdata[i]["备注工作内容"] = results[i]["工作内容"];
                mdata[i]["工作负责人"] = results[i]["工作负责人"];
                mdata[i]["工作成员"] = results[i]["工作成员"];
                mdata[i]["计划编号"] = results[i]["计划编号"];
                //做lib查询，返回一些参数
                get("/lib/search/", mdata[i]["taskid"]).then(res => {
                  // console.log("回调", res.data);
                  if (res.data.length != 0) {
                    mdata[i].工作类别 = res.data[0].taskcategory; //如果查询结果异常的处理
                    mdata[i].工作任务 = res.data[0].task;
                    mdata[i].工作任务基准积分 = res.data[0].score;
                    mdata[i].工作完成质量系数 = 1;
                    mdata[i].最后积分 = res.data[0].score;
                    // console.log(mdata[i]); //查询完成后才赋值，异步操作，所以后面可能取不到值
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
                        odata["工作类别"] = templ[i]["工作类别"];
                        odata["工作任务"] = templ[i]["工作任务"];
                        odata["任务编号"] = templ[i]["taskid"];
                        odata["工作任务基准积分"] =
                          templ[i]["工作任务基准积分"];
                        odata["工作完成质量系数"] =
                          templ[i]["工作完成质量系数"];
                        odata["最后积分"] = templ[i]["最后积分"];
                        odata["备注工作内容"] = templ[i]["备注工作内容"];
                        odata["人员"] = member[m];
                        odata["_id"] =
                          templ[i]["计划编号"] + "m" + odata["人员"]; //给ID，以便保持数据唯一性
                        // console.log(mdata[i], templ[i], odata);
                        zdata.push(odata);
                      }
                    }
                  } else {
                    this.$Message.info({
                      content:
                        "任务编号《" +
                        mdata[i]["taskid"] +
                        "》错误，请修改后重试",
                      duration: 5
                    });
                    // console.log("任务编号《" + mdata[i]["taskid"] + "》错误，请修改后重试");
                  }
                  
                }).then(result => {console.log(flag,len,zdata.length)
                  if (flag ===len){//最后一个循环才输出promise
                  console.log(zdata, "promise内");
                  return resolve(zdata);//一定要放在第二个promise then的里面

                  }});//then
              }//if
            }//for
          });

          // console.log("ndata", ndata,ndata.then);
          let postdata = ndata.then(result => {
            console.log(result);
            // post("/pdata/add", result);
            for (let n in result) {
              //上传数据库
              post("/pdata/add", result[n])
              .then(res => {
              console.log("回调", res);
              return
              });
            };
          });
        } else if (index == 1) {
          //缺陷数据处理
        } else if (index == 2) {
          //日志数据处理
        } else if (index == 3) {
          //其他数据处理
        } else if (index == 4) {
          //操作票数据处理
        } else if (index == 5) {
          //工作票数据处理
        } else {
        }
        const rdata = results.map(item => {
          let obj = {};
          for (let prop in item) {
            // 检测属性是否属于thead自身的
            // console.log("原始数据",prop,Eheader.hasOwnProperty(prop))
            // if (Eheader.hasOwnProperty(prop)) {
            // obj[Eheader[prop]] = item[prop];
            // console.log("数据修改", obj, item);
            // }
          }
          return obj;
        });
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