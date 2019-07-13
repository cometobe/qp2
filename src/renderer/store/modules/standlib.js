import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);

const state = {
    data: [],
}
    ;

const actions = {
    getlib: ({ commit, state }) => {
        return new Promise((resolve) => {
            console.log("actions", state)
            get('/lib/query')
                .then((res) => {
                    console.log('获取标准库数据成功', res.slibdata, state.data);
                    commit('SAVELIB', res.slibdata, state.data)
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
            let temp = t.任务编号+"/"+t.工作任务积分+"/"+t.工作类别+"/"+t.工作任务
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
    }
}


export default {
    state,
    actions,
    getters,
    mutations
}