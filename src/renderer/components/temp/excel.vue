<template>
  <div>
    <navg></navg>
    <div v-for="(item,index) in uploadlist"> 
      <Upload :before-upload="(item)=> handleUpload(index, item)"  action="" accept=".xls, .xlsx"> 
      <Button icon="ios-cloud-upload-outline">选择{{ item.title }}数据文件</Button>
    </Upload>
        <div v-if="item !== null">
      {{ item.title }}文件:{{index}} {{item}}{{ item.filename }}
       </div></div>
    <!-- <Upload :before-upload="handleUpload0" action="" accept=".xls, .xlsx"> 
      <Button icon="ios-cloud-upload-outline">选择生产数据文件</Button>
    </Upload>
        <div v-if="file1 !== null">
      生产数据文件: {{ file1.name }} -->
      <!-- <Button
        type="text"
        @click="upload(file1.name)"
        :loading="loadingStatus"
      >{{ loadingStatus ? 'Uploading' : '点击上传处理' }}</Button> -->
    <!-- </div> -->
    <!-- <Upload :before-upload="handleUpload1" action="" accept=".xls, .xlsx"> 
      <Button icon="ios-cloud-upload-outline">选择缺陷数据文件</Button>
    </Upload>
        <div v-if="file2 !== null">
      生产数据文件: {{ file2.name }}
      <Button
        type="text"
        @click="upload"
        :loading="loadingStatus"
      >{{ loadingStatus ? 'Uploading' : '点击上传处理' }}</Button>
    </div>
    <Upload :before-upload="handleUpload2" action="" accept=".xls, .xlsx"> 
      <Button icon="ios-cloud-upload-outline">选择日志数据文件</Button>
    </Upload>
    <div v-if="file3 !== null">
      生产数据文件: {{ file3.name }} -->
      {{this.$store.getter.members}}
      <Button
        type="text"
        @click="upload"
        :loading="loadingStatus"
      >{{ loadingStatus ? 'Uploading' : '点击上传处理' }}</Button>
    <!-- </div> -->
  </div>
</template>
<script>
import excel from "@/utils/excel.js";
import { get, post, del } from "@/api/api.js";

import navg from "@/components/subpages/nav";
export default {
  components: {
    navg
  },
  data() {
    return {
      file1: "",
      file2: "",
      file3: "",
      uploadlist:[{title:"生产",filename:""},{title:"缺陷",filename:""},{title:"日志",filename:""},{title:"其他",filename:""}],
      loadingStatus: false
    };
  },
  methods: {
    handleUpload0(file) {
        console.log("上传的文件",file)
      this.file1 = file;
      return false;
    },
        handleUpload1(file) {
        console.log("上传的文件",file)
      this.file2 = file;
      return false;
    },
        handleUpload2(file) {
        console.log("上传的文件",file)
      this.file3 = file;
      return false;
    },
            handleUpload(index,file) {
        console.log("上传的文件",file,index)
      this.uploadlist[index].filename = file.name;
      console.log(this.uploadlist)
      return false;
    },
    upload(filename) {
      this.loadingStatus = true;
      setTimeout(() => {
        this.filename = null;
        this.loadingStatus = false;
        this.$Message.success("Success");
      }, 1500);
    }
  }
};
</script>