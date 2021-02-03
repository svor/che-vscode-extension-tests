/*********************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
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
import glob from 'glob';
const testReporter = require('./test-reporter');

export function start(context: theia.PluginContext): void {
    const mocha = new Mocha({
        ui: 'tdd',
        timeout: 60000,
        reporter: testReporter
    });
    mocha.useColors(true);
    const e = (c: any) => console.log(c);

    glob('**/**.test.js', { cwd: '/projects' }, (err, files) => {
        if (err) {
            return e(err);
        }

        console.log("Found: ");
        console.log(files);

        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve('/projects', f)));

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
}

export function stop() {
}
