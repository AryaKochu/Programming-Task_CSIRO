import { Component, ElementRef, Input, ViewChild, OnInit, OnChanges } from '@angular/core';
import * as _ from 'underscore';

import { BioAppMainServiceService } from '../../../services/bio-app-main-service.service'

@Component({
  selector: 'bio-app-landing',
  templateUrl: './bio-app-landing-component.component.html',
  styleUrls: ['./bio-app-landing-component.component.css'],
  providers: [BioAppMainServiceService]
})
export class BioAppLandingComponentComponent implements OnInit {
  proteinEventsData: any;
  length: number;
  proteinTracks: any;
  tracks: any;
  maxOrder: any;
  x: number;
  y: number;

  @ViewChild('canvas') canvasRef: ElementRef;


  constructor(private mainService: BioAppMainServiceService) {
    let component = this;
    this.mainService.fetchProteinEvents().subscribe(res => {//reading raw data from the json
      component.proteinEventsData = res;
      component.length = component.proteinEventsData.length;
      console.log("proteinEventsData", component.proteinEventsData.length);
      component.createTracks();

    });
  }

  ngOnInit() {

  }

  //logic to determine each event and order which contributes to each complex formation
  createTracks() {
    this.x = 70;
    this.y = 200;
    let trackName;
    let collidedProtein;
    let component = this;
    let data = this.proteinEventsData;
    this.proteinTracks = [];
    this.maxOrder = 1;
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight + window.innerHeight;
    //this.drawDot(x, y, ctx, "", "");
    let params = {//push first event default
      "tName": "",
      "tNumber": 1,
      "proteinList": [data[0].p1, data[0].p2],
      "proteins": [
        { "order": data[0].order, "protein": data[0].p1 },
        { "order": data[0].order, "protein": data[0].p2 }]
    };

    this.proteinTracks.push(params);

    for (let i = 1; i < data.length; i++) {
      for (let j = 0; j < i; j++) {
        //when collision happens at different time period.
        //check if the previous events have the same protein as the current event's and get the common protein, if any. 
        if (data[i].p1 === data[j].p1) {
          this.checkProteinTrackCreated(data[i].p1, data[i].p2, data[i].order);
          break;
        } else if (data[i].p1 === data[j].p2) {
          this.checkProteinTrackCreated(data[i].p1, data[i].p2, data[i].order);
          break;
        } else if (data[i].p2 === data[j].p1) {
          this.checkProteinTrackCreated(data[i].p2, data[i].p1, data[i].order);
          break;
        } else if (data[i].p2 === data[j].p2) {
          this.checkProteinTrackCreated(data[i].p2, data[i].p1, data[i].order);
          break;
        } else {
          if (j == i - 1) {
            this.proteinTracks.push({
              "tName": "",
              "tNumber": 2,
              "proteinList": [data[i].p1, data[i].p2],
              "proteins": [
                { "order": data[i].order, "protein": data[i].p1 },
                { "order": data[i].order, "protein": data[i].p2 }]
            });
            break;
          } else {
            continue;
          }
        }
      }
      if (data[i].order > this.maxOrder) {//to find the max order - used at the time f drawing time axis
        this.maxOrder = data[i].order;
      }
    }
    this.drawProteinComplexTracks();
  }

  //create each track- to insert each protein to its corresponding track.
  checkProteinTrackCreated(exProtein: any, nonExProtein: any, order: any) {
    let proteinEx = exProtein;
    let proteinNonEx = nonExProtein;
    let tracks = this.proteinTracks;
    let eventOrder = order;
    for (let k = 0; k < this.proteinTracks.length; k++) {
      if (_.contains(this.proteinTracks[k].proteinList, proteinEx)) {
        this.proteinTracks[k].proteinList.push(proteinNonEx);
        this.proteinTracks[k].proteins.push(
          { "order": eventOrder, "protein": proteinNonEx }
        );
        this.proteinTracks[k].tName = proteinEx;
      }
    }

  }

  
  /**with the newly created json for tracks : 
   * find the coordinates for each protein collision,
   * name each track
   * and draw call fn to draw the collision
   */
  drawProteinComplexTracks() {
    let data = this.proteinTracks;
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    let x = 70;
    let y = 200;
    let tNameX;
    let coordinates: any = [];
    for (let i = 0; i < data.length; i++) {
      ctx.font = "18px Times New Roman";
      ctx.fillStyle = "#ffffff";

      for (let j = 0; j < data[i].proteins.length; j++) {
        if (data[i].proteins[j].protein !== data[i].tName) {
          if (data[i].proteins[j].order == 1) {
            x = 70;
          } else {
            x = 70 + (120 * (data[i].proteins[j].order - 1));
          }
          tNameX = 20 + (120 * (data[i].proteins[0].order - 1));
          ctx.fillText(data[i].tName, tNameX, y, 30);

          this.drawDot(x, y, ctx, data[i].tName, data[i].proteins[j].protein);
          coordinates.push(
            { "x": x, "y": y }
          );
        }
      }
      x = 70;
      y += 100;
    }
    this.drawLine(70, 200, ctx, coordinates);
  }

  //to draw the dots to indicate each protein - used HTML5 CANVAS feature
  drawDot(x: any, y: any, ctx: CanvasRenderingContext2D, trackName: string, collidedProtein: string) {

    ctx.beginPath(); //representing each event/collision 
    ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.fillText(collidedProtein, x, y + 40, 30);
  }

//draw lines between each collisions eventually form the track path
  drawLine(x: any, y: any, ctx: CanvasRenderingContext2D, coordinates: any) {
    for (let i = 0; i < coordinates.length; i++) {
      if (i != coordinates.length - 1) {
        if (coordinates[i].y == coordinates[i + 1].y) {
          ctx.beginPath();
          ctx.moveTo(coordinates[i].x, coordinates[i].y);
          ctx.lineTo(coordinates[i + 1].x, coordinates[i + 1].y);
          ctx.stroke();
        }
      }
    }
    this.timeAxis(this.x, this.y, this.maxOrder, ctx);
  }

//draw time axis
  timeAxis(x: any, y: any, maxOrder: any, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = "#34495E";
    ctx.fillStyle = "#34495E";
    ctx.moveTo(this.x, this.y + (100 * this.proteinTracks.length));
    ctx.lineTo(this.x + (120 * maxOrder), this.y + (100 * this.proteinTracks.length));
    ctx.lineTo((this.x + (120 * maxOrder)) - 25, (this.y + (100 * this.proteinTracks.length)) - 25);
    ctx.arcTo(this.x + (120 * (maxOrder)), this.y + (100 * this.proteinTracks.length), (this.x + (120 * (maxOrder)) - 25), (this.y + (100 * this.proteinTracks.length) + 25), 35);
    ctx.lineTo(this.x + (120 * maxOrder), this.y + (100 * this.proteinTracks.length));
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
     ctx.fillText("Time", (this.x + this.x + (120 * maxOrder))/2, (((this.y + (100 * this.proteinTracks.length)) + this.y + (100 * this.proteinTracks.length))/2)-8 , 30);
  }

}
