<template>
  <div>
    <Card title="导入EXCEL">
      <Row>
        <Upload :before-upload="handleBeforeUpload" action="" accept=".xls, .xlsx">
          <Button :loading="uploadLoading" icon="ios-cloud-upload-outline" @click="handleUploadFile">上传文件</Button>
        </Upload>
      </Row>
      <Row>
        <div v-if="file !== null" class="ivu-upload-list-file">
          <Icon type="ios-stats"/>
          {{ file.name }}
          <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"/>
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
      <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"/>
    </Row>
  </div>
</template>
<script>
import excel from '@/utils/ejs.js'
export default {
  name: 'DataQualityInspectionStatistics',
  data() {
    return {
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableTitle: [],
      tableLoading: false
    }
  },
  methods: {
    initUpload() {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile() {
      this.initUpload()
    },
    handleRemove() {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile(file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功')
        const data = e.target.result
        const { header, results } = excel.read(this.file.path)
        const tableTitle = header.map(item => { return { title: item, key: item } })
        this.tableData = results
        this.tableTitle = tableTitle
        this.uploadLoading = false
        this.tableLoading = false
        this.showRemoveFile = true
        //上传数据库
        for (let i = 0, len = results.length, text = ""; i < len; i++){
            console.log(results[i])
        }
      }
    }
  }
}
</script>