import { Component, OnInit } from '@angular/core';
import { PopuliService } from '../../populi.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  constructor(private populiService: PopuliService) { }

  ngOnInit() {
    console.log(this.populiService.canActivate());
  }

}
