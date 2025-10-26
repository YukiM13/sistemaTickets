import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

export interface ActionMenuItem {
  label: string;
  icon: string;
  action: string;
  severity?: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary';
  disabled?: boolean;
  visible?: boolean;
}

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit, OnChanges {
  @Input() items: ActionMenuItem[] = [];
  @Input() data: any = null; // Los datos del registro (usuario, producto, etc.)
  @Input() buttonClass: string = 'p-button-text p-button-plain';
  @Input() buttonIcon: string = 'pi pi-cog';
  @Input() buttonLabel: string = '';
  @Input() disabled: boolean = false;

  @Output() actionClick = new EventEmitter<{action: string, data: any}>();

  @ViewChild('menu') menu!: Menu;
  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.buildMenuItems();
  }

  ngOnChanges() {
    this.buildMenuItems();
  }

  private buildMenuItems() {
    this.menuItems = this.items
      .filter(item => this.isItemVisible(item))
      .map(item => ({
        label: item.label,
        icon: item.icon,
        disabled: this.isItemDisabled(item),
        styleClass: item.severity ? `text-${item.severity}` : '',
        command: () => this.onActionClick(item.action)
      }));
  }

  onActionClick(action: string) {
    this.actionClick.emit({
      action: action,
      data: this.data
    });
  }

  isItemVisible(item: ActionMenuItem): boolean {
    return item.visible !== false;
  }

  isItemDisabled(item: ActionMenuItem): boolean {
    return item.disabled === true || this.disabled;
  }

  showMenu(event: Event) {
    this.menu.toggle(event);
  }
}