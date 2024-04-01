import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

export class Utils {
  public static openAlertDialog(dialog: MatDialog, message: string, timer?: number) {
    const dialogRef = dialog.open(CustomDialogComponent, {
      data: {
        message: message,
        buttonText: {
          cancel: 'Ok'
        }
      }
    });
    return dialogRef;
  }
}
