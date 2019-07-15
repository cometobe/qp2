import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { get, post, del } from "@/api/api.js";

Vue.use(Vuex);
import setting from './setting';
const state = {
    outputdata: []
}

const actions = {
    // handlerdata: ({ commit, state }, res) => {
    //     return new Promise((resolve) => {
    //         // console.log("actions", state)
    //         console.log('获取后台所有数据成功', res);
    //         for (let i = 0; i < res.length; i++) {
    //             res[i]["序号"] = i + 1
    //         }
    //         commit('SAVEALLDATA', res, state)
    //     });
    // },
    handlerdata: ({ commit, state }, payload) => {
        return new Promise((resolve) => {
            console.log("actions-handlerdata", state, payload)
            get("/pdata/search/", payload).then(res => {
                console.log("后台查询所有数据时res", res);
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i]["序号"] = i + 1
                }
                commit('SAVEALLDATA', res.data, state)
                // for(let i = 0;i<res.data.length;i++){
                //   this.fordata.push(res.data[i])
            })
            // console.log('获取后台所有数据成功', res);

            // commit('SAVEALLDATA', res, state)
        });
    },
}

const getters = {
    allcatalog: function () {
        // 统计工作类别
        var nameContainer = []; // 针对键name进行归类的容器
        state.outputdata.forEach(item => {
            nameContainer[item.工作类别] = nameContainer[item.工作类别] || [];

            //当逻辑或||时，找到为true的分项就停止处理，并返回该分项的值，否则执行完，并返回最后分项的值。

            nameContainer.push(item.工作类别);
        });
        const catalog = [...new Set(nameContainer)];//得到最终的工作类别数组，去重
        return ['总分'].concat(catalog)
    },
    totalscore: function (e) {//用于echart的数据
        console.log("this.members[1]", state, setting, setting.getters.members(setting.state))
        let members = setting.getters.members(setting.state)
        let data = state.outputdata
        let datanew = []
        let total = []
        let result = []
        let newresult = []
        let catscore = []
        let series = []
        // 统计工作类别
        var nameContainer = []; // 针对键name进行归类的容器
        data.forEach(item => {
            nameContainer[item.工作类别] = nameContainer[item.工作类别] || [];

            //当逻辑或||时，找到为true的分项就停止处理，并返回该分项的值，否则执行完，并返回最后分项的值。

            nameContainer.push(item.工作类别);
        });
        const catalog = [...new Set(nameContainer)];//得到最终的工作类别数组，去重
        console.log(catalog)
        let datatotal = []
        for (let i = 0; i < members.length; i++) {//按人员筛选
            datatotal[i] = data.filter(
                function (porduct) {
                    return porduct["人员"] == members[i]
                }
            )
            console.log("datatotal", datatotal[i], sums(datatotal[i]))
            result[i] = datatotal[i]
        }
        total = datatotal.map(sums)
        series.push({
            name: '总分',
            type: 'bar',
            data: total,
            markLine: {
                lineStyle: {
                    normal: {
                        type: 'dashed'
                    }
                },
                data: [{ name: '平均分', type: 'average', label: { position: "middle",formatter: '{b}:{c}'} }]
            }
        })
        function sums(e) {//求和
            let sum = 0
            for (let ee in e) {
                if (e[ee]["最后积分"]) {
                    sum = sum + parseInt(e[ee]["最后积分"])
                }
            }
            return sum
        }
        //分裂数据
        for (let i = 0; i < catalog.length; i++) {//按类别筛选
            datanew[i] = data.filter(
                function (porduct) {
                    return porduct["工作类别"] == catalog[i]
                }
            )
            console.log("datanew", datanew[i], sums(datanew[i]))
            result[i] = datanew[i]

            newresult.push([])//填充空数组
            catscore.push([])
            for (let j = 0; j < members.length; j++) {//按人员筛选
                newresult[i][j] = result[i].filter(
                    function (porduct) {
                        return porduct["人员"] == members[j]
                    }
                )
                console.log("newresult", newresult)
                catscore[i] = newresult[i].map(sums)
                // console.log("datanew", datanew[i], sums(datanew[i]))
            }
        }

        for (let n = 0; n < catscore.length; n++) {
            console.log("catscore[n]" + n, catscore[n])
            series.push({
                name: catalog[n],
                type: 'bar',
                stack: '总分',
                data: catscore[n]
            })
        }
        return series
    },
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