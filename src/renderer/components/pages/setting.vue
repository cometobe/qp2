<template>
  <div>
    <navg></navg>
    <Row>
      <Form ref="formDynamic" :model="formDynamic" :label-width="120" style="padding-top:50px">
        <Col span="7" offset="2">
          <FormItem label="绩效月份" >
            <DatePicker
              type="month"
              format="yyyy-MM"
              v-model="formDynamic.date"
              placeholder="选择要统计的月份"
              style="width: 240px"
            ></DatePicker>
          </FormItem>
          <FormItem label="班组">
            <Input v-model="formDynamic.team" placeholder="输入班组名称"></Input>
          </FormItem>
          <p style="font-weight:bold;padding:20px">填入以下任务的任务编号</p>
          <FormItem label="发现一般缺陷">
            <Input v-model="formDynamic.ndefectf" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="验收一般缺陷">
            <Input v-model="formDynamic.ndefectt" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="发现重大缺陷">
            <Input v-model="formDynamic.vdefectf" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="验收重大缺陷">
            <Input v-model="formDynamic.vdefectt" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="发现紧急缺陷">
            <Input v-model="formDynamic.edefectf" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="验收紧急缺陷">
            <Input v-model="formDynamic.edefectt" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="参与安全活动">
            <Input v-model="formDynamic.securei" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="记录安全活动">
            <Input v-model="formDynamic.securew" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="参与操作票">
            <Input v-model="formDynamic.cz" placeholder="填入任务编号"></Input>
          </FormItem>
          <FormItem label="参与工作票">
            <Input v-model="formDynamic.gz" placeholder="填入任务编号"></Input>
          </FormItem>
        </Col>
        <Col span="8" offset="2">
        <p style="font-weight:bold;padding:20px">注意: 成员名不要重复</p>
          <FormItem
            v-for="(item, index) in formDynamic.items"
            v-if="item.status"
            :key="index"
            :label="'成员 ' + item.index"
            :prop="'items.' + index + '.value'"
            :rules="{required: true, message: '班组成员 ' + item.index +'不能为空', trigger: 'blur'}"
          >
            <Row>
              <Col span="18">
                <Input type="text" v-model="item.value" placeholder="输入班组成员姓名"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="12">
                <Button type="dashed" long @click="handleAdd" icon="md-add">增加</Button>
              </Col>
            </Row>
          </FormItem>
          
          <FormItem style="padding-top:50px">
            <Button type="success" long @click="handleSubmit()">提交</Button>
          </FormItem>
        </Col>
      </Form>
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
      // team: this.$store.state.setting.formDynamic.team,
      // date: moment(this.$store.state.setting.formDynamic.date).format("YYYY-MM"),
      index: 1,
      formDynamic: {
        items: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ],
        date: "",
        team: "",
        ndefectf: "",
        ndefectt: "",
        vdefectf: "",
        vdefectt: "",
        edefectf: "",
        edefectt: "",
        securew: "",
        securei: "",
        cz: "",
        gz: ""
      }
    };
  },

  mounted() {
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
    this.formDynamic = this.$store.state.setting.formDynamic;
  },
  methods: {
    handleSubmit() {
      this.formDynamic.date = moment(this.formDynamic.date).format("YYYY-MM");
      console.log(
        "点击提交",
        this.formDynamic,
        this.$store.state.setting.formDynamic
      );
      
      post("/config/member", { formDynamic: this.formDynamic }).then(res => {
        this.$store.dispatch("getmember");
        console.log("检查state和本地", res, this.$store.state.setting);
      });
    },
    handleAdd() {
      this.index++;
      console.log("增加成员", this.formDynamic.items);
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
<style>
/* label {
  width: 100px;
}
.ivu-form .ivu-form-item-label{
  width: 100px
}
.ivu-form-item-content{
  padding-left: 30px;
  width: 150px
} */
</style>