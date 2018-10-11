import * as _ from 'underscore';
import { Injectable } from '@nestjs/common';
/*分页方法*/
@Injectable()
export class PagerUtil {
    getPager(totalItems: number, currentPage?: number, pageSize?: number) {
        // calculate total pages
        if (pageSize === undefined || pageSize === 0) {
            pageSize = 1;
        }
        if (currentPage === undefined || currentPage === 0) {
            currentPage = 1;
        }
        const totalPages = Math.ceil(totalItems / pageSize);
        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = _.range(startPage, endPage + 1);
        // return object with all pager properties required by the view
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }
}
