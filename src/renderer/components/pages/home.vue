<template>
  <div>
    <Layout>
      <Header>
        <!-- <Row>
        <Col span="12" offset="2" style="padding-top:60px" height="100%">-->
        <!-- <p>1</p> -->
        
        <!-- </Col>
        </Row>-->
        <!-- <div> -->
          <!-- <div> -->
          <img id="logo" src="~@/assets/logo.jpg" alt="electron-vue" style="height:100%;width:260px" />
          <!-- </div> -->
          <Button style="float:right;margin-top: 14px" size="large" @click="open(false)">帮助</Button>
        <!-- </div> -->
        
      </Header>
      <Content style="padding: 100 10px;height:500px">
        <Row style="padding-top:110px;padding-bottom:100px">
          <Col span="4" offset="1">
            <Card style="width:220px">
              <div style="text-align:center">
                <h1>
                  <router-link to="/stand">
                    <!-- <img src="~@/assets/2.png" width="200px"> -->
                    <Icon type="ios-options-outline" size="200" />标准库
                  </router-link>
                </h1>
              </div>
            </Card>
          </Col>
          <Col span="4" offset="2">
            <Card style="width:220px">
              <div style="text-align:center">
                <h1>
                  <router-link to="/excel">
                    <!-- <img src="~@/assets/1.png" width="200px"> -->
                    <Icon type="ios-git-network" size="200" />数据导入
                  </router-link>
                </h1>
              </div>
            </Card>
          </Col>
          <Col span="4" offset="2">
            <Card style="width:220px">
              <div style="text-align:center">
                <h1>
                  <router-link to="/trend">
                    <Icon type="ios-trending-up" size="200" />
                    <!-- <img src="~@/assets/3.png" width="200px"> -->
                    积分查询
                  </router-link>
                </h1>
              </div>
            </Card>
          </Col>
          <Col span="4" offset="2">
            <Card style="width:220px">
              <div style="text-align:center">
                <h1>
                  <router-link to="/setting">
                    <!-- <img src="~@/assets/2.png" width="200px"> -->
                    <Icon type="ios-settings-outline" size="200" />基本配置
                  </router-link>
                </h1>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style="padding-top:60px" class="layout-footer-center">
        2019 @ QuShaoJun
        
      </Footer>
    </Layout>
  </div>
</template>

<script>
import moment from "moment";
import { get, post, del } from "@/api/api.js";
export default {
  name: "home-page",
  mounted() {
    // 页面加载时调用远方配置数据
    //1更新设置数据
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
    });
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    open(nodesc) {
      this.$Notice.open({
        title: "帮助",
        duration:0,
        desc: nodesc
          ? ""
          : "1. 进入<基本配置>，将需要的班组、班组成员、部分任务编号设置填好后点击提交。</br>2.进入<标准库>导入标准库配置，标准库格式要稍作修改，将标题合并为一行。注意标准库第一行必须是标题。</br>3.进入<数据导入>导入资产管理系统导出的表格。维护检修模块的计划要在任务前加4位任务编号，否则无法识别。可以在页面直接填写其他数据，与其他的数据导入是同步的。</br>4.<积分查询>页面可以查询导入的表格数据转换后的量化绩效数据，点击按钮可以导出excel格式文本。</br>"
      });
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

/* * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
} */

/* .layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #fff;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
} */
.layout-footer-center {
  text-align: center;
}
</style>
