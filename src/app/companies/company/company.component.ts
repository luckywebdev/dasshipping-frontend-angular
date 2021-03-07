import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { COMPANY_STATUSES } from '../../constants';
import { AccountFilesDTO, CompanyDTO } from '../../interfaces/models';
import { CompanyService } from '../../providers/company/company.service';
import { LoadingService } from '../../providers/loading/loading.service';
import { NotificationService } from '../../providers/notification/notification.service';
import { UserService } from '../../providers/user/user.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  id: string;
  company: CompanyDTO;
  cover_photo: string;
  editable: boolean;
  companyStatuses = COMPANY_STATUSES;

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private companyService: CompanyService,
    private notificationService: NotificationService,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadingService.startLoading();
    this.getCompany();
  }

  private getCompany() {
    this.companyService.get(this.id)
      .subscribe((res) => {
        this.company = res;
        this.cover_photo = this.company.avatarUrl;
        this.loadingService.stopLoading();
      });
  }

  public checkApprove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Confirm Approve Company',
        description: 'Are you sure?',
        nameButton: 'Approve',
        reason: false,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.approveCompany();
        }
      });
  }

  private approveCompany() {
    this.loadingService.startLoading();
    this.companyService.aproveCompany(this.company.id)
      .subscribe(
        () => {
          this.company.status = COMPANY_STATUSES.ACTIVE;
          this.loadingService.stopLoading();
          this.notificationService.success('Success approved!');
        },
        () => {
          this.loadingService.stopLoading();
        });
  }

  public requestChanges() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Request Changes',
        description: '',
        nameButton: 'Send',
        reason: true,
        placeholder: 'Changes...',
        maxlength: 400,
      },
      width: '450px',
    });
    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.companyService.requestChangesCompany({ id: this.company.id, message: result })
            .subscribe(() => {
              this.notificationService.success('Success send!');
            });
        }
      });
  }

  public downloadAttachment(file: AccountFilesDTO) {
    this.loadingService.startLoading();
    this.userService.getFileSign(file.path)
      .subscribe((resp) => {
        window.open(resp.url, '_parent');
        this.loadingService.stopLoading();
      });
  }

  public suspendCompany() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm Suspend Account',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.companyService.blockCompany(this.company.id)
            .subscribe(() => {
              this.company = { ...this.company, blocked: true };
              this.loadingService.stopLoading();
            });
        }
      });
  }

  public activateCompany() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        action: 'Confirm account activation',
        description: 'Are you sure?',
        nameButton: 'Confirm',
        reason: false,
      },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadingService.startLoading();
          this.companyService.blockCompany(this.company.id, false)
            .subscribe(() => {
              this.company = { ...this.company, blocked: false };
              this.loadingService.stopLoading();
            });
        }
      });
  }
}
