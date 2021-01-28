/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import * as path from 'path';
process.env.TS_NODE_PROJECT = path.join(__dirname, "../../tsconfig.json");
require('ts-mocha');
import Mocha from 'mocha';
const testReporter = require('./test-reporter');
const ncp = require('ncp').ncp;

export function start(context: theia.PluginContext): void {
    const runTestsCommand = {
        id: 'Run VS Code extension\'s tests',
        label: "Run tests"
    };
    context.subscriptions.push(
        theia.commands.registerCommand(runTestsCommand, (...args: any[]) => {
            const mocha = new Mocha({
                ui: 'bdd',
                timeout: 60000,
                reporter: testReporter
            });
            mocha.useColors(true);

            const e = (c: any) => console.log(c);
            ncp(context.extensionPath, '/projects/helloworld-test-sample', async (err: any) => {
                if (err) {
                    return console.error(err);
                }

                console.log(" ------ Find tests files -------");
                const testFiles = await theia.workspace.findFiles('**/test/*.test.ts', undefined)
                console.log("Found: ");
                console.log(testFiles);

                // Add files to the test suite
                testFiles.forEach(f => mocha.addFile(path.resolve(f.path)));

                try {
                    // Run the mocha test
                    mocha.run((failures: any) => {
                        theia.window.showInformationMessage('Tests completed! See results in test.log file');
                        const resultFile = path.resolve('/projects', 'test.log');
                        theia.commands.executeCommand('file-search.openFile', resultFile)
                        if (failures > 0) {
                            e(new Error(`${failures} tests failed.`));
                        }
                    });
                } catch (err) {
                    e(err);
                }
            });
        })
    )
}

export function stop() {
}
