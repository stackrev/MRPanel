import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";

import { finalize } from "rxjs/operators";
import { BsModalRef } from "ngx-bootstrap/modal";
import * as _ from "lodash";
import {
  PageServiceProxy,
  PageDto,
  WidgetServiceProxy,
  WidgetDto,
  WidgetType,
  Position,
  SizeType,
} from "@shared/service-proxies/service-proxies";

import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  AppPageType,
  AppContentPlace,
  AppWidgetType,
  AppSizeType,
  AppPosition,
} from "@shared/AppEnums";

@Component({
  templateUrl: "./enter-page-dialog.component.html",
  styleUrls: ["../../pages/page-style.scss"],
})
export class EditPageDialogComponent
  extends AppComponentBase
  implements OnInit {
  editor = ClassicEditor;
  widgetEditor = ClassicEditor;
  saving = false;
  page = new PageDto();
  widget = new WidgetDto();
  widgets: WidgetDto[] = [
    new WidgetDto({
      widgetType: AppWidgetType.Html,
      content: "HTML",
      imageAddress: "",
      sizeType: AppSizeType[25],
      order: 1,
      position: AppPosition.Left,
      pageId: "string",
      parentId: "",
      id: "1",
    }),
    new WidgetDto({
      widgetType: AppWidgetType.Paragraph,
      content: "Paragraph",
      imageAddress: "",
      sizeType: AppSizeType[50],
      order: 2,
      position: AppPosition.Right,
      pageId: "string",
      parentId: "",
      id: "2",
    }),
    new WidgetDto({
      widgetType: AppWidgetType.Blockquote,
      content: "Blockquote",
      imageAddress: "",
      sizeType: AppSizeType[66],
      order: 3,
      position: AppPosition.Justify,
      pageId: "string",
      parentId: "",
      id: "3",
    }),
    new WidgetDto({
      widgetType: AppWidgetType.Container,
      content: "",
      imageAddress: "",
      sizeType: AppSizeType[100],
      order: 3,
      position: AppPosition.Justify,
      pageId: "string",
      parentId: "",
      id: "4",
    }),
    new WidgetDto({
      widgetType: AppWidgetType.Html,
      content: "",
      imageAddress: "",
      sizeType: AppSizeType[50],
      order: 3,
      position: AppPosition.Justify,
      pageId: "string",
      parentId: "4",
      id: "5",
    }),
    new WidgetDto({
      widgetType: AppWidgetType.Paragraph,
      content: "",
      imageAddress: "",
      sizeType: AppSizeType[50],
      order: 3,
      position: AppPosition.Justify,
      pageId: "string",
      parentId: "4",
      id: "6",
    }),
  ];
  isCollapsed = false;
  buttonName: any = "show";
  id: string;
  isFormVisible = false;

  // Drop-down labels
  pageTypeName: string;
  contentPlaceName: string;
  addWidgetLable: string;
  positionLable: string;
  size: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _pageService: PageServiceProxy,
    public _widgetService: WidgetServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  pageTypes: any = Object.keys(AppPageType).map((item, index) => {
    return { id: index, name: item };
  });

  widgetTypes: any = Object.keys(AppWidgetType).map((item, index) => {
    return { id: index, name: item };
  });

  contentPlaces: any = Object.keys(AppContentPlace).map((item, index) => {
    return { id: index, name: item };
  });

  positions: any = Object.keys(AppPosition).map((item, index) => {
    return { id: index, name: item };
  });

  sizeTypes: any = Object.keys(AppSizeType).map((item, index) => {
    return { id: index, name: item };
  });

  ngOnInit(): void {
    this.pageTypeName = "PleaseSelect";
    this.contentPlaceName = "PleaseSelect";
    this.addWidgetLable = "PleaseSelect";
    this.positionLable = "PleaseSelect";

    if (this.id != undefined) {
      this._pageService.get(this.id).subscribe((result: PageDto) => {
        this.page = result;
        this.selectPageType(this.page.pageType);
        this.selectContentPlace(this.page.contentPlace);

        // this._widgetService
        //   .getByPageId(this.id)
        //   .subscribe((widgetResult: WidgetDto[]) => {
        //
        //     // TODO: List widgets
        //   });
      });
    }
  }

  toggleIsFormVisible(i: number) {
    this.isFormVisible = !this.isFormVisible;
  }

  save(): void {
    this.saving = true;

    if (this.id != undefined) {
      this._pageService
        .update(this.page)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        });
    } else {
      this._pageService
        .create(this.page)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        });
    }
  }

  selectPageType(type: AppPageType) {
    switch (type) {
      case AppPageType.Page: {
        this.page.pageType = AppPageType.Page;
        this.pageTypeName = "Page";
        break;
      }
      case AppPageType.News: {
        this.page.pageType = AppPageType.News;
        this.pageTypeName = "News";
        break;
      }
      case AppPageType.Article: {
        this.page.pageType = AppPageType.Article;
        this.pageTypeName = "Article";
        break;
      }

      default:
        break;
    }
  }

  selectContentPlace(type: AppContentPlace) {
    switch (type) {
      case AppContentPlace.Up: {
        this.page.contentPlace = AppContentPlace.Up;
        this.contentPlaceName = "Up";
        break;
      }
      case AppContentPlace.Middle: {
        this.page.contentPlace = AppContentPlace.Middle;
        this.contentPlaceName = "Middle";
        break;
      }
      case AppContentPlace.Bottom: {
        this.page.contentPlace = AppContentPlace.Bottom;
        this.contentPlaceName = "Bottom";
        break;
      }

      default:
        break;
    }
  }

  addWidget(type: WidgetType) {
    let widget = new WidgetDto({
      widgetType: type,
      content: "",
      imageAddress: "",
      sizeType: SizeType._1,
      order: 1,
      position: Position._0,
      pageId: "",
      parentId: "",
      id: "",
    });

    this.widgets.push(widget);

    this.widgets = this.widgets.slice();
  }

  widgetName(widgetIndex: WidgetType) {
    return Object.keys(AppWidgetType).map((item, index) => {
      if (index === widgetIndex) return item;
    })[widgetIndex];
  }

  setPosition(position: AppPosition, widget: WidgetDto) {
    const index = this.widgets.findIndex((item: WidgetDto, i: number) => {
      return item.id === widget.id;
    });

    this.widgets[index].position = position["id"];
  }

  setSize(size: AppSizeType, widget: WidgetDto) {
    const index = this.widgets.findIndex((item: WidgetDto, i: number) => {
      return item.id === widget.id;
    });

    this.widgets[index].sizeType = size["id"];
  }

  getWidgetWidth(width: number) {
    switch (width) {
      case 0:
        return "col-3";
      case 1:
        return "col-4";
      case 2:
        return "col-6";
      case 3:
        return "col-8";
      case 4:
        return "col-9";
      default:
        return "col-12";
    }
  }
}
