import {FolderDirs} from '../types';
import * as fs from 'fs';
import * as path from 'path';
import {staticDirs} from '../constants';

class InitService {
  CreateStaticFolders() {
    staticDirs.forEach(dir => {
      const parentPath = path.join(process.cwd(), dir.parent);
      this.createFolderIfNotExists(parentPath);

      if (dir.children) {
        this.processChildren(dir.children, parentPath);
      }
    });
  }

  private processChildren(children: FolderDirs[], parentPath: string) {
    children.forEach(child => {
      const childPath = path.join(parentPath, child.parent);
      this.createFolderIfNotExists(childPath);

      if (child.children) {
        this.processChildren(child.children, childPath);
      }
    });
  }

  private createFolderIfNotExists(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
      console.log(`Folder Created: ${folderPath}`);
    }
  }
}

export default InitService;
