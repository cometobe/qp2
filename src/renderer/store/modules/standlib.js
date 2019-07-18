import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);

const state = {
    data: [],
    longdata: []
}
    ;

const actions = {
    getlib: ({ commit, state }) => {
        return new Promise((resolve) => {
            console.log("actions", state)
            get('/lib/query')
                .then((res) => {
                    console.log("/lib/query-res",res)
                    let dataArr = [];
                    for (let i = 0; i < res.slibdata.length; i++) {
                        // res.slibdata[i]["序号"] = i + 1
                        let arr = [
                            // res.slibdata[i].序号,
                            res.slibdata[i].工作类别,
                            res.slibdata[i].工作任务,
                            res.slibdata[i].任务编号,
                            res.slibdata[i].标准工时,
                            res.slibdata[i].所需人手,
                            res.slibdata[i].所需知识和技能程度,
                            res.slibdata[i].工作环境,
                            res.slibdata[i].工作风险,
                            res.slibdata[i].工作任务积分,
                            res.slibdata[i].数据来源,
                            res.slibdata[i].备注
                        ];
                        dataArr.push(arr);
                    }
                    console.log('获取标准库数据成功', res.slibdata, state.data);
                    commit('SAVELIB', res.slibdata, state.data)
                    commit('SAVELONGLIB', dataArr, state.longdata)
                    // resolve(res);
                    console.log("检查state", state)
                })
                .catch(error => {
                    console.log('获取标准库错误1', error)
                })
        });
    },
}

const getters = {
    alltaskid: function (state) {
        let lists = [];
        // console.log("getters",state)
        for (let t of state.data) {
            // console.log(t)
            // lists.push(state.formDynamic.items[t].value)
            lists.push(t.任务编号)
        }
        return lists
    },
    alltask: function (state) {
        let lists = [];
        for (let t of state.data) {
            let temp = t.任务编号 + "/" + t.工作任务积分 + "/" + t.工作类别 + "/" + t.工作任务
            // lists.push(state.formDynamic.items[t].value)
            lists.push(temp)
        }
        return lists
    },
};


const mutations = {
    SAVELIB(state, res) {
        console.log('提交的标准库数据至state', res, state);
        state.data = res
    },
    SAVELONGLIB(state, res) {
        console.log('提交的标准库数据至state', res, state);
        state.longdata = res
    }
}


export default {
    state,
    actions,
    getters,
    mutations
}