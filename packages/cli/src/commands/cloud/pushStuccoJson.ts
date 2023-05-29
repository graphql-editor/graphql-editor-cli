import { logger } from '@/common/log/index.js';
import { Config } from '@/Configuration/index.js';
import { Editor } from '@/Editor.js';
import {
    CLOUD_FOLDERS,
    STUCCO_FILE,
} from '@/gshared/constants/index.js';
import path from 'path';
import fs from 'fs';

export const pushStuccoJson = async ({ namespace, project }: { namespace?: string; project?: string }) => {
    const resolve = await Config.configure({ namespace, project }, ['namespace', 'project']);
    const p = await Editor.fetchProject({ accountName: resolve.namespace, projectName: resolve.project });
    if (!p.team?.id) {
        throw new Error('No team for this project. Invalid project');
    }
    logger('Pushing the stucco file to cloud', 'info');
    await Editor.saveFilesToCloud(
        p.id,
        [{
            name: path.join(CLOUD_FOLDERS.microserviceJs, STUCCO_FILE),
            content: fs.readFileSync(STUCCO_FILE),
            type: 'text/plain',
        }]
    );
    logger('Successfully uploaded stucco file to GraphQL Editor Cloud', 'success');
    return;
};
