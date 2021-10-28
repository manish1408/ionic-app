import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { ComplianceModel } from '../_models/complianceModel';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.page.html',
  styleUrls: ['./compliance.page.scss'],
})
export class CompliancePage implements OnInit {

  status = 'not_set';
  loading = false;
  compliance: ComplianceModel = new ComplianceModel;
  documentUrl;
  photoUrl;
  documentSelected = false;

  constructor(
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.getCompliance();
  }

  getCompliance() {
    this.accountService.getCompliance().subscribe(async (ret) => {
      if (ret.success) {
        this.compliance = ret.data;
        this.documentUrl = `${environment.cdn}compliance/${this.compliance.documentFilename}`;
        this.photoUrl = `${environment.cdn}compliance/${this.compliance.photoFilename}`;

      } else {
        this.compliance.statusLabel = 'Ready to start';
      }
    });
  }

  onDocumentSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.compliance.documentFile = file;
      this.compliance.documentFilename = file.name;
    }
  }

  onPhotoSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.compliance.photoFile = file;
      this.compliance.photoFilename = file.name;
    }
  }

  removeDocument() {
    this.compliance.documentFile = null;
    this.compliance.documentFilename = null;
    event.preventDefault();
  }

  removePhoto() {
    this.compliance.photoFile = null;
    this.compliance.photoFilename = null;
    event.preventDefault();
  }

  deleteDocument() {
    this.accountService.deleteComplianceDocument(this.compliance.id).subscribe(async (ret) => {
      if (ret && ret.success) {
        this.getCompliance();
        const toast = await this.toastController.create({
          message: 'Document deleted successfully.',
          duration: 1000,
          color: 'success',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
        this.getCompliance();
      } else {
        const toast = await this.toastController.create({
          message: 'Document not deleted successfully.',
          duration: 1000,
          color: 'danger',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      }
    });
  }

  deletePhoto() {
    this.accountService.deleteCompliancePhoto(this.compliance.id).subscribe(async (ret) => {
      if (ret && ret.success) {
        this.getCompliance();
        const toast = await this.toastController.create({
          message: 'Photo deleted successfully.',
          duration: 1000,
          color: 'success',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
        this.getCompliance();
      } else {
        const toast = await this.toastController.create({
          message: 'Photo not deleted successfully.',
          duration: 1000,
          color: 'danger',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      }
    });
  }

  async save() {
    if (!this.compliance.documentType) {
      const toast = await this.toastController.create({
        message: 'Please select a document type',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return;
    }

    if (this.compliance) {
      this.loading = true;

      this.accountService.updateCompliance(this.compliance).subscribe(async (ret) => {
        if (ret && ret.success) {
          const toast = await this.toastController.create({
            message: 'Document saved successfully.',
            duration: 1000,
            color: 'success',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();

          this.getCompliance();

        } else {
          const toast = await this.toastController.create({
            message: 'Document not saved successfully. Try again later.',
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
        this.loading = false;

      });
    }
  }
}
