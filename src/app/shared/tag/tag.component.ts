import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() public tag: string = '';
  @Input() public isRemovable = false;
  @Input() public isColor = false;
  @Output() tagRemoved: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  public getTagStyle(tag: string) {
    return this.isColor
      ? { backgroundColor: tag + '40', color: tag }
      : { border: `1px solid #c5c5c5`, color: '#c5c5c5' };
  }

  public removeTag() {
    console.log('start remove tag');

    this.tagRemoved.emit(this.tag);
  }
}
