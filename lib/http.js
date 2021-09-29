/*
 * @Description: 模板获取
 * @Version: 1.0
 * @Author: zx
 * @Date: 2021-08-06 15:14:36
 * @LastEditors: zx
 * @LastEditTime: 2021-08-06 17:05:13
 */
const axios = require("axios");

axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * @description: 获取模板列表
 * @return {*}
 * @author: zx
 */
async function getRepoList() {
  return axios.get("https://api.github.com/orgs/Zi-cli/repos");
}

/**
 * @description: 获取版本信息
 * @param {*} repo 版本号
 * @return {*}
 * @author: zx
 */
async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/Zi-cli/${repo}/tags`);
}

module.exports = {
  getTagList,
  getRepoList,
};
