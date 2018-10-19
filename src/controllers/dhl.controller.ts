import {Controller, FileInterceptor, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {LabelService} from '../service/dhl/label.service';
import {DhlLabelReqBody} from '../interfaces/dhl/dhl.label.req.body';
const xlsx = require('xlsx');
@Controller('dhl')
export class DhlController {
    constructor (private readonly dhlLabelService: LabelService) {}
    // 上传文件
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        const result = [];
        const workbook = xlsx.readFile(file.path);
        workbook.SheetNames.forEach(function (sheetName) {
           const worksheet = workbook.Sheets[sheetName];
           result[sheetName] = xlsx.utils.sheet_to_json(worksheet);
           // result[sheetName].['AJ2'] =
        });
        // 解析完成之后， 插入数据库
        for (const t of result) {
            for (const h  of result[t]) {
                const lableAddress: DhlLabelReqBody = result[t][h];
                // 插入数据库， 并修改excels文件添加order 列
                await this.dhlLabelService.LabelTheDelivery(lableAddress);
            }
        }
        console.log('表信息如下', result);
        // 写入文件
      //  xlsx.writeFile(workbook, 'file');
    }
}