import { Login } from "@/api/login"
import { setToKen, setUserName, getUserName, removeToKen, removeUserName } from "@/utils/app"


const state = {
    isCollapse: JSON.parse(window.sessionStorage.getItem("isCollapse")) || false,
    to_ken: "",
    username: getUserName() || '',
}

const getters = {
}

const mutations = {
    SET_CPLLAPSE(state) {
        state.isCollapse = !state.isCollapse
        window.sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value) {
        state.to_ken = value
    },
    SET_USERNAME(state, value) {
        state.username = value
    }
}
const actions = {
    login(content, requestData) {
        return new Promise((resolve, reject) => {
            Login(requestData).then((response) => {
                let data = response.data.data;
                content.commit('SET_TOKEN', data.token)
                content.commit('SET_USERNAME', data.username)
                setToKen(data.token)
                setUserName(data.username)
                resolve(response)
            }).catch((err) => {
                reject(err)
            });
        })
    },

    exit({ commit }) {
        return new Promise((resolve, reject) => {
            removeToKen()
            removeUserName()
            commit('SET_TOKEN', '')
            commit('SET_USERNAME', '')
            resolve()
        })
    }
}



export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
