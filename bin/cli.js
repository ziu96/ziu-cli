#! /usr/bin/env node
/*
 * @Description: 指令
 * @Version: 1.0
 * @Author: zx
 * @Date: 2021-08-06 17:46:37
 * @LastEditors: zx
 * @LastEditTime: 2021-08-06 18:26:13
 */


const program = require("commander"); // 定义命令
const figlet = require('figlet');
const chalk = require('chalk');

program
  //定义命令和参数
  .command("create <app-name>")
  .description("Create a new project")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options) => {
    // 执行结果
    require('../lib/create.js')(name, options)
  });

program
  // 配置版本号信息
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");

program
  .on('--help', ()=>{
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('ZIU', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
  })

// 配置更新包命令
program
  .command('update')
  .description('update cli')
  .action((option) => {

  })

// 解析用户执行命令传入参数
program.parse(process.argv);
