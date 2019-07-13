<template>
  <div ref="navg">
    <Row>
      <Menu mode="horizontal" :active-name="actn" @on-select="routeTo">
        <MenuItem name="/">
          <Icon type="md-home" />首页
        </MenuItem>
        <MenuItem name="stand">
          <Icon type="md-book" />标准库
        </MenuItem>
        <MenuItem name="excel">
          <Icon type="md-arrow-up" />数据导入
        </MenuItem>
        <MenuItem name="trend">
          <Icon type="md-list" />积分查询
        </MenuItem>
        <MenuItem name="analyse">
          <Icon type="md-analytics" />数据分析
        </MenuItem>
        <MenuItem name="Setting">
          <Icon type="md-settings" />设置
        </MenuItem>
      </Menu>
    </Row>
  </div>
</template>
<script>
export default {
  name: "navg",
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
    };
  },
  computed: {
    actn() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    routeTo(e) {
      this.$router.push(e);
    }
  }
};
</script>