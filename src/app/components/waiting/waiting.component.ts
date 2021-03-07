import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MESSAGES } from '../../constants';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss'],
})
export class WaitingComponent implements OnInit {
  message: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const messageId = this.route.snapshot.paramMap.get('messageId');
    this.message = MESSAGES[messageId] || MESSAGES.default;
  }

}
