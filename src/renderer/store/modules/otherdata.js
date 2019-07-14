import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);

const state = {
    database:[]
}
    ;

const actions = {
    getodata: ({ commit, state }) => {
        return new Promise((resolve) => {
            console.log("actions", state)
            get('/odata/query')
                .then((res) => {
                    console.log('获取其他数据成功', res.data, state);
                    // if (res.data[0]!=undefined){
                        commit('SAVEODATA', res, state)
                    // }
                    // resolve(res);
                    console.log("检查state", state)
                })
                .catch(error => {
                    console.log('获取其他数据错误1', error)
                })
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
    SAVEODATA(state, res) {
        console.log('提交的其他数据至res->state', res, state);
        state.database = res.data
    }
}


export default {
    state,
    actions,
    getters,
    mutations
}