const db = require("./db.js")
const inquirer = require("inquirer")

module.exports.add = async (title) => {
  const list = await db.read(title)
  list.push({ title, done: false })
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
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
      type: "input",
      name: "title",
      message: "新的标题",
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
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        {
          name: "退出",
          value: "quit",
        },
        {
          name: "已完成",
          value: "markAsDone",
        },
        {
          name: "未完成",
          value: "markAsUndone",
        },
        {
          name: "改标题",
          value: "updateTitle",
        },
        {
          name: "删除",
          value: "remove",
        },
      ],
    })
    .then(({ action }) => {
      const functionMap = { markAsDone, markAsUndone, updateTitle, remove }
      functionMap[action](list, index)
    })
}

function createTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "输入任务标题",
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
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择想操作的任务?",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            return {
              name: `${task.done ? "[Y]" : "[N]"} ${index + 1} - ${task.title}`,
              value: index.toString(),
            }
          }),
          {
            name: "+ 创建任务",
            value: "-2",
          },
        ],
      },
    ])
    .then((answer) => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        // 选中一个任务
        askForAction(list, index)
      } else if (index === -2) {
        //创建任务
        createTask(list)
      }
    })
}

module.exports.showAll = async () => {
  const list = await db.read()
  printTasks(list)
}
