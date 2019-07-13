import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);

const state = {
    outputdata:[]
}
    ;

const actions = {
    handlerdata: ({ commit, state },res) => {
        return new Promise((resolve) => {
            // console.log("actions", state)
            console.log('获取后台所有数据成功', res);
            for(let i = 0 ;i<res.length;i++){
                res[i]["序号"] = i+1
            }
            commit('SAVEALLDATA', res, state)
        });
    },
}

const getters = {
    // members: function (state) {
    //     let lists = [];
    //     for (let t of state.formDynamic.items) {
    //         console.log(t)
    //         // lists.push(state.formDynamic.items[t].value)
    //         lists.push(t.value)
    //     }
    //     return lists
    // },
};


const mutations = {
    SAVEALLDATA(state, res) {
        console.log('提交的其他数据至res->state', res, state);
        state.outputdata = res
    }
}


export default {
    state,
    actions,
    getters,
    mutations
}