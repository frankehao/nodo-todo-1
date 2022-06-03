const inquirer = require('inquirer')

const db = require('./db.js')
module.exports.add = async (title) => {
  //title是我们要存入的代办事项
  const list = await db.read()
  //读文件
  list.push({ title, done: false })
  //push数据
  await db.write(list)
  //写文件
}
module.exports.clear = async () => {
  await db.write([])
}
module.exports.showAll = async () => {
  const list = await db.read()
  printTasks(list)
}
function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}
function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '新的标题',
      default: list[index].title,
    })
    .then((answer) => {
      list[index].title = answer.title
      db.write(list)
    })
}
function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
function askForAction(list, index) {
  const actions = { markAsDone, markAsUndone, remove, updateTitle }
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        { name: '退出', value: 'quit' },
        { name: '已完成', value: 'markAsDone' },
        { name: '未完成', value: 'markAsUndone' },
        { name: '改标题', value: 'updateTitle' },
        { name: '删除', value: 'remove' },
      ],
    })
    .then((answer2) => {
      const action = actions[answer2.action]
      action && action(list, index)
    })
}
function askForCreateTask(list) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '输入任务标题',
    })
    .then((answer) => {
      list.push({
        title: answer.title,
        done: false,
      })
      db.write(list)
    })
}
function printTasks(list) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices: [
        { name: '退出', value: '-1' },
        ...list.map((task, index) => {
          return {
            name: `${task.done ? '[x]' : '[ ]'} ${index + 1} - ${task.title}`,
            value: index.toString(),
          }
        }),
        { name: '创建任务', value: '-2' },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}
