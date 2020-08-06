import { UserModel } from "./../../Models/user.model";
import { BehaviorSubject, interval, Subscription, of } from "rxjs";
import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Web3Service } from "src/app/Services/Web3/web3.service";
import { Web3Model } from "src/app/Models/web3.model";
import { NgForm } from "@angular/forms";
import { IpfsService } from "src/app/Services/ipfs/ipfs.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { MatTableDataSource } from "@angular/material/table";
import { async } from "@angular/core/testing";

@Component({
  selector: 'app-image-dialog',
  templateUrl: 'image-dialog.html',
  styleUrls: ["./dashborad.component.scss"]
})
export class ImageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
@Component({
  selector: "app-dashborad",
  templateUrl: "./dashborad.component.html",
  styleUrls: ["./dashborad.component.scss"]
})
export class DashboradComponent implements OnInit {
  imagePath: any;
  imgURL: any;
  privateKey: string;
  account: any;
  fms: any;
  total: any;
  deleted: any;
  current: any;
  filename: string;
  displayedColumns: string[] = ["id", "fileName", "fileHash", "view", "delete"];
  dataSource = null;
  constructor(
    private ipfs: IpfsService,
    public dialog: MatDialog,
    private route: Router,
    private web3service: Web3Service
  ) { }

  ngOnInit() {
    this.web3service.Web3Details$.subscribe(async (data: Web3Model) => {
      this.account = data.account;
      console.log("TCL: DashboradComponent -> ngOnInit -> this.account", this.account)
      this.fms = data.fms;
      await this.loadImages();
    });
  }

  //To Preview the Image File when selected
  preview(files) {
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.imgURL = reader.result;
    };
  }

  //To load the list of Images in the File Management System
  loadImages = async () => {
    try {
      let user: UserModel[] = [];
      this.total = await this.fms.id(this.account).call({ from: this.account });
      this.deleted = await this.fms.delId(this.account).call({ from: this.account });
      this.current = this.total - this.deleted;
      for (let i = 0; i < this.total; i++) {
        const userHash = await this.fms
          .fileHash(this.account, i)
          .call({ from: this.account });
        if (userHash.hashValue != '') {
          user.push({
            id: i,
            fileName: userHash.fileName,
            fileHash: userHash.hashValue
          });
          this.dataSource = new MatTableDataSource(user);
        }
      }
    } catch (error) {
    }
  };
  //To Upload a File into IPFS
  onUpload = async () => {
    try {
      const cid: any = await this.ipfs.IPFSadd(this.imgURL);
      if (cid !== null) {
        const id1 = await this.fms.id(this.account).call({ from: this.account });
        let flag = 0;
        for (let i = 0; i < id1; i++) {
          const userHash = await this.fms
            .fileHash(this.account, i)
            .call({ from: this.account });
          if (cid != userHash.hashValue) {
            continue;
          }
          else {
            flag = 1;
          }
        }

        if (flag === 0) {
          const id = await this.fms
            .setFile(this.filename, cid)
            .send({ from: this.account, gas: 5000000 });
          if (id.status === true) {
            this.loadImages()
            alert("Your Transaction is done");
            alert("Transaction Hash is " + id.transactionHash);
          } else {
            alert("Some issues with ethereum");
          }
        }
        else {
          alert("This image already exists");
        }

      } else {
        alert("Ipfs network Problem");
      }

      this.imgURL = null;
      this.filename = null;
    } catch (error) { }
  };

  //To View a File
  view = async hash => {
    const url = await this.ipfs.IPFSget(hash)
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '1000px',
      data: { url }
    })
  }

  //To Delete a File
  delete = async cid => {
    try {
      const deleteFile = await this.fms.deleteFile(cid).send({
        from: this.account,
        gas: 5000000
      });
      if (deleteFile.status === true) {
        this.loadImages()
        alert('Image Deleted ')
      } else {
        alert('Problem with Ethereum')
      }
    } catch (error) {
    }
  };
}
