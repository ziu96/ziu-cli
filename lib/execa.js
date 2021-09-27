/*
 * @Description: 下载依赖
 * @Version: 1.0
 * @Author: zx
 * @Date: 2021-08-06 17:42:46
 * @LastEditors: zx
 * @LastEditTime: 2021-08-06 18:30:34
 */
const execa = require('execa')

module.exports = function executeCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        const child = execa(command, [], {
            cwd,
            stdio: ['inherit', 'pipe', 'inherit'],
        })

        child.stdout.on('data', buffer => {
            process.stdout.write(buffer)
        })

        child.on('close', code => {
            if (code !== 0) {
                reject(new Error(`command failed: ${command}`))
                return
            }

            resolve()
        })
    })
}


