import { Component } from '@angular/core'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { Organization } from '../organization/organization'

@Component({
  selector: 'app-layout',
  imports: [NzLayoutModule, NzMenuModule, Organization],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {}
