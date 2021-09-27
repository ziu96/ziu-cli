/*
 * @Description: 用户模板选择
 * @Version: 1.0
 * @Author: zx
 * @Date: 2021-08-06 15:20:28
 * @LastEditors: zx
 * @LastEditTime: 2021-08-06 18:04:26
 */
const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const chalk = require("chalk");
const downloadGitRepo = require("download-git-repo"); // 不支持 Promise
const executeCommand = require("./execa");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail("Request failed, refetch ...");
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建地址
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 获取用户选择的模板
  async getRepo() {
    // 拉取远程模板
    const repoList = await wrapLoading(getRepoList, "模板拉取中");
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name);

    // 用户选择模板
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "请选择需要创建的项目模板",
    });

    // 输出选择的模板
    return repo;
  }

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, "版本拉取中", repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item) => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: "tag",
      type: "list",
      choices: tagsList,
      message: "选择你想要的版本",
    });

    // 3）return 用户选择的 tag
    return tag;
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo, tag) {
    // 1）拼接下载地址
    const requestUrl = `Zi-cli/${repo}${tag ? "#" + tag : ""}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      "创建中", // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir)
    ); // 参数2: 创建位置
  }

  // 核心创建逻辑
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();

    // 2) 获取 tag 名称
    const tag = await this.getTag(repo);

    // 3）下载模板到模板目录
    await this.download(repo, tag);
    // 4）依赖安装
    await wrapLoading(
      executeCommand, // 下载依赖
      "正在下载依赖", // 加载提示信息
      "npm install", // 指令
      path.join(process.cwd(), this.name)
    );
    // 5）模板使用提示
    console.log("\n依赖下载完成! 执行下列命令开始开发：\n");
    console.log(`cd ${this.name}`);
    console.log(`npm run dev`);
  }
}

module.exports = Generator;
