import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { SortOrder } from 'shared/generated-shop-types';

import { BaseListComponent } from '../../../common/base-list.component';
import { GetAssetList } from '../../../common/generated-types';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent extends BaseListComponent<GetAssetList.Query, GetAssetList.Items>
    implements OnInit {
    searchTerm = new FormControl('');
    paginationConfig$: Observable<PaginationInstance>;

    constructor(
        private notificationService: NotificationService,
        private dataService: DataService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.product.getAssetList(...args),
            data => data.assets,
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTerm.value,
                        },
                    },
                    sort: {
                        createdAt: SortOrder.DESC,
                    },
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.paginationConfig$ = combineLatest(this.itemsPerPage$, this.currentPage$, this.totalItems$).pipe(
            map(([itemsPerPage, currentPage, totalItems]) => ({ itemsPerPage, currentPage, totalItems })),
        );
        this.searchTerm.valueChanges
            .pipe(
                debounceTime(250),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.refresh());
    }

    filesSelected(files: File[]) {
        if (files.length) {
            this.dataService.product.createAssets(files).subscribe(res => {
                super.refresh();
                this.notificationService.success(_('catalog.notify-create-assets-success'), {
                    count: files.length,
                });
            });
        }
    }
}
