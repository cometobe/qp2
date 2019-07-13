import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);

const state = {
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

}
    ;

const actions = {
    getmember: ({ commit, state }) => {
        return new Promise((resolve) => {
            console.log("actions", state)
            get('/config/query')
                .then((res) => {
                    console.log('获取config数据成功', res.data[0], state);
                    if (res.data[0]!=undefined){
                        commit('SAVECONFIG', res.data[0], state)
                    }
                    // resolve(res);
                    console.log("检查state", state)
                })
                .catch(error => {
                    console.log('获取config错误1', error)
                })
        });
    },
}

const getters = {
    members: function (state) {
        let lists = [];
        for (let t of state.formDynamic.items) {
            // console.log(t)
            // lists.push(state.formDynamic.items[t].value)
            lists.push(t.value)
        }
        return lists
    },
};


const mutations = {
    SAVECONFIG(state, res) {
        console.log('提交的config数据至state', res, state);
        state.formDynamic = res.formDynamic
    }
}


export default {
    state,
    actions,
    getters,
    mutations
}