<template>
  <div>
    <Row>
      <Col span="12" offset="2" style="padding-top:60px">
        <img id="logo" src="~@/assets/logo.jpg" alt="electron-vue">
      </Col>
    </Row>
    <Row style="padding-top:60px">
      <Col span="4" offset="1">
        <Card style="width:220px">
          <div style="text-align:center">
            <h1>
              <router-link to="/stand">
                <!-- <img src="~@/assets/2.png" width="200px"> -->
                <Icon type="ios-options-outline" size="200" />
                标准库
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
                <Icon type="ios-git-network" size="200" />
                数据导入
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
                <Icon type="ios-settings-outline" size="200" />
                基本配置
              </router-link>
            </h1>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
// import SystemInformation from "./LandingPage/SystemInformation";

export default {
  name: "home-page",
  // components: { SystemInformation },
  beforeCreate() {
    // 页面加载时调用远方配置数据
        this.$store.dispatch("getmember")
this.$store.dispatch("getlib")
        // })
        
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
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
}
</style>
