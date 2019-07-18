<template>
  <div>
    <navg></navg>
    <longtable></longtable>
    <Button type="primary" size="large" @click="exportData()">
      <Icon type="ios-download-outline"></Icon>数据导出
    </Button>
  </div>
</template>
<script>
import navg from "@/components/subpages/nav";
// import excel from "@/utils/excel.js";
import moment from "moment";
import XLSX from "xlsx";
import longtable from "@/components/subpages/longtable";
export default {
  components: {
    navg,
    longtable
  },
  data() {
    return {
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url: "r"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url: ""
        }
      ],
      imgName: "",
      visible: false,
      uploadList: []
    };
  },
  methods: {
    exportData() {
      let exporttable = XLSX.utils.aoa_to_sheet(
        this.$store.state.output.longtabledata
      );
      console.log(exporttable);
      this.openDownloadDialog(
        this.sheet2blob(exporttable),
        this.$store.state.setting.formDynamic.team +
          moment(this.$store.state.setting.formDynamic.date).format("YYYY-MM") +
          "量化绩效数据" +
          "导出.xlsx"
      );
    },
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || "sheet1";
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary"
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      return blob;
    },
    openDownloadDialog(url, saveName) {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    // handleRemove(file) {
    //   const fileList = this.$refs.upload.fileList;
    //   this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    // },
    // handleSuccess(res, file) {
    //   file.url =
    //     "";
    //   file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    // },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    }
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList;
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
  }
};
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>