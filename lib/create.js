/*
 * @Description:
 * @Version: 1.0
 * @Author: zx
 * @Date: 2021-08-05 18:06:58
 * @LastEditors: zx
 * @LastEditTime: 2021-08-06 17:25:08
 */
// lib/create.js

const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const Generator = require("./Generator");

module.exports = async function (name, options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录名称
  const targetAir = path.join(cwd, name);

  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // TODO：询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "该文件夹已经存在 是否覆盖该文件",
          choices: [
            { name: "Yes", value: "yes" },
            { name: "No", value: false },
          ],
        },
      ]);

      if (!action) {
        return;
      } else if (action === "yes") {
        // 移除已经存在文件夹
        console.log("\r\nRemoving...");
        await fs.remove(targetAir);
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir);

  //开始创建项目
  generator.create();
};
