<template>
  <div>
    <navg></navg>
    <Row>
      <Col span="8" offset="2">
        <Form :label-width="80" style="padding-top:30px">
          <FormItem label="绩效月份">
            <DatePicker
              type="month"
              format="yyyy-MM"
              v-model="date"
              placeholder="选择要统计的月份"
              style="width: 240px"
            ></DatePicker>
          </FormItem>
          <FormItem label="班组">
            <Input v-model="team" placeholder="输入班组名称"></Input>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmit1()">修改</Button>
          </FormItem>
        </Form>
        <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width: 300px">
          <p>Message is: {{ this.$store.state.setting.member }}</p>
          <FormItem
            v-for="(item, index) in formDynamic.items"
            v-if="item.status"
            :key="index"
            :label="'Item ' + item.index"
            :prop="'items.' + index + '.value'"
            :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}"
          >
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.value" placeholder="Enter something..."></Input>
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleRemove(index)">Delete</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="12">
                <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit2()">Submit</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
import navg from "@/components/subpages/nav";
import { get, post, del } from "@/api/api.js";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "setting",
  components: {
    navg
  },
  data() {
    return {
      people: "",
      team: this.$store.state.setting.team,
      date: this.$store.state.setting.date,
      index: 1,
      formDynamic: this.$store.state.setting.formDynamic
    };
  },
  created() {
    // 调用请求菜单列表数据的接口
    // getTodoList({}).then(res => {
    //   const TODOS = res.data.todos; // 数据都会返回在res.data里面。
    //   this.items = TODOS; // 我的把菜单数据赋值给定义的this.items
    //   this.todoId = TODOS[0].id; // 把菜单数据的默认的第一个对象的id赋值给默认选中的id
    // });
    // this.$store.dispatch("getdata").then((res) => {
    //   console.log("回调",res);
    //       console.log(this.$store.state.setting);
    // this.team = this.$store.state.setting.team;
    // this.date = this.$store.state.setting.date;
    // });
    // console.log("页面创建",this.$store)
    // .then(() => { // 调用vuex actions.js 里面的 getTodo函数
    //   // this.$nextTick(() => {
    //   //   this.goList(this.todoList[0]._id);
    //   // });
    // });
  },
  mounted() {
    // this.$store.dispatch("getdata");
    // this.team = this.$store.state.setting.team;
    // this.date = this.$store.state.setting.date;
    //       console.log("页面转载",this.$store)
  },
  methods: {
    handleSubmit1() {
      let obj = {};
      obj.date = moment(this.date).format("YYYY-MM");
      obj.team = this.team;
      obj.id = "flag";
      post("/config/date", obj).then(res => {
        this.$store.dispatch("getdata");
        console.log("回调", res);
        console.log(
          "检查state和本地",
          this.$store.state.setting,
          this.team,
          this.date
        );
      });
    },
    handleSubmit2() {
      console.log("点击提交", this.formDynamic);
      let obj={}
      obj.formDynamic = this.formDynamic;
      // obj.member = [];
      obj.id = "fog";
      // for (let p in this.formDynamic.items) {
      //   console.log(this.formDynamic.items[p].value);
      //   obj.member.push(this.formDynamic.items[p].value);
      // }
      post("/config/member", obj).then(res => {
        this.$store.dispatch("getmember");
        console.log("回调", res);
        console.log(
          "检查state和本地",
          this.$store.state.setting,
          this.team,
          this.date
        );
      });
      // console.log("提交后",this.$store)
      // console.log(obj);
      // post('/config',obj).then(console.log(this.$store.state.date))
      // this.$refs[name].validate(valid => {
      //   if (valid) {
      //     this.$Message.success("Success!");
      //   } else {
      //     this.$Message.error("Fail!");
      //   }
      // });
    },
    // handleReset(name) {
    //   this.$refs[name].resetFields();
    // },
    handleAdd() {
      this.index++;
      this.formDynamic.items.push({
        value: "",
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      this.formDynamic.items[index].status = 0;
    }
  }
};
</script>