#!/usr/bin/env node

const { program } = require('commander')
const prompts = require('prompts')
const shell = require('shelljs')
const os = require('os')
const platform = os.platform()
const isWin = platform.includes('win32')

program.option('-c, --create', 'create template')

program.parse(process.argv)

const { create } = program.opts()

if (create) {
    createTemplate()
}

function gitClone (path, name) {
    shell.exec(`git clone ${path} ${name}`)
    shell.exec(isWin ? `rmdir ${name}\\.git /s /q` : `rm -rf ./${name}/.git`)
}

async function createTemplate () {
    const { template, projectName } = await prompts([
        {
            type: 'select',
            name: 'template',
            message: 'pick template',
            choices: [
                { title: 'edit', description: '编辑器', value: 1 },
                { title: 'hooks', description: 'Hooks', value: 2 },
            ]
        },
        {
            type: 'text',
            name: 'projectName',
            message: 'project name',
            initial: 'myProjectName'
        }
    ])

    const project = {
        1: 'https://github.com/kabudaaixuexi/npm-xs-editor.git',
        2: 'https://github.com/kabudaaixuexi/npm-vue-hooks'
    }[template]

    if (!project || !projectName) {
        return
    }

    gitClone(project, projectName)
}
