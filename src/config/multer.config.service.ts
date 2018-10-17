import {MulterModuleOptions, MulterOptionsFactory} from '@nestjs/common';

export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            dest: '/upload',
        };
    }

}