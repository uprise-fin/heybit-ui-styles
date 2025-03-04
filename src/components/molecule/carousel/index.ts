import '@/components/molecule/skeleton';
import { Base } from '@/components/base';
import { getChildren } from '@/utils';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HbCarouselEventStatus } from './type';

/**
 * @property open 온 오프
 * @property width
 * @property persistent
 * @property hideCloseBtn
 * @property icon
 * @property title
 * @property auto Boolean, 자동롤링
 * @property pause Boolean, 마우스오버시 멈춤
 * @property infinite Boolean, 무한롤링 (마지막 오른쪽 아이템에서 첫 번째로 넘어가지 않고, 오른쪽으로 계속 진행)
 * @property indicate Boolean, 인디케이터
 * @property duration Number, 자동롤링 시간
 * @property speed Number, 롤링 속도
 * @property hasVariableChildren 메인 배너용, 영역 생성 후에 preload된 자식을 할당하는 등 자식이 가변적인 경우
 * @slot content - optional, 내용
 * @slot button - optional, 버튼
 * @slot anchor - optional, 앵커
 * @csspart container
 * @csspart icon
 * @csspart title
 * @csspart content
 * @csspart buttons
 * @csspart anchor
 */

@customElement('hb-carousel')
export class HbCarousel extends Base {
  static get styles() {
    return [require('./style.scss').default];
  }

  /**
   * @property {boolean} hasVariableChildren 메인 배너용, 영역 생성 후에 preload된 자식을 할당하는 등 자식이 가변적인 경우
   */
  @property({ type: Boolean })
  hasVariableChildren: boolean = false;

  //옵션
  auto = false;

  pause = false;

  infinite = false;

  rolling = false;

  indicate = false;

  draggable = false;

  clickable = false;

  moveable = false;

  duration = 3000;

  speed = 300;

  flexWidth = 0;

  fakeLength = 1;

  index: number; // 현재 인덱스

  visibleLength: number;

  holderFlag = false;

  _userIndex: number; // 인피니트등에 쓰이기 위해 내부에서 실제로 사용하는 인덱스

  itemLength: number;

  itemElements: HTMLElement[];

  startPointer = {
    clientX: 0,
    clientY: 0
  };

  dragDistance = 0;

  eventStatus: HbCarouselEventStatus = 'done';

  sto: ReturnType<typeof setTimeout>;

  // get open() {
  //   return this._open;
  // }
  // set open(val: boolean) {
  //   if (this._open !== val) {
  //     this._open = val
  //     this.onToggle(val)
  //   }
  // }

  // @property()
  // value!: string;
  static get properties() {
    return {
      auto: { type: Boolean, Reflect: true },
      pause: { type: Boolean, Reflect: true },
      infinite: { type: Boolean, Reflect: true },
      indicate: { type: Boolean, Reflect: true },
      rolling: { type: Boolean, Reflect: true },
      holderFlag: { type: Boolean, Reflect: true },
      draggable: { type: Boolean, Reflect: true },
      eventStatus: { type: String, Reflect: true },
      dragDistance: { type: Number, Reflect: true },
      index: { type: Number, Reflect: true },
      flexWidth: { type: Number, Reflect: true },
      fakeLength: { type: Number, Reflect: true },
      itemLength: { type: Number, Reflect: true },
      transitionFlag: { type: Boolean, Reflect: true },
      visibleLength: { type: Number, Reflect: true },
      duration: { type: Number, Reflect: true },
      speed: { type: Number, Reflect: true }
    };
  }

  get totalWidth() {
    return (this.itemLength / this.visibleLength) * 100;
  }

  get transitionFlag() {
    if (this.eventStatus === 'done') return true;
    return false;
  }

  get positions() {
    const arrayLength = this.itemLength * (this.infinite ? 1 + 1 + this.fakeLength : 1);
    const index = this.infinite ? -this.itemLength : 0;
    return Array(arrayLength)
      .fill(null)
      .map((_, i) => i + index)
      .map((x) => (x * this.clientWidth) / this.visibleLength);
  }

  set userIndex(index: number) {
    if (this.infinite) index -= this.itemLength;
    this._userIndex = index;
  }

  get userIndex() {
    return this._userIndex;
  }

  get transitionDuration() {
    if (this.holderFlag) return 1000000000;
    if (this.transitionFlag) return this.rolling ? this.duration : this.speed;
    return 0;
  }

  get itemPosition() {
    if (this.holderFlag) return '';
    const currentPosition = (this.index * this.clientWidth) / this.visibleLength;
    if (['doing', 'fake'].includes(this.eventStatus)) {
      this.userIndex = this.closeIndex(currentPosition + this.dragDistance * 2);
      return `${-currentPosition - this.dragDistance}px`;
    }

    return `${(this.index / this.visibleLength) * -100}%`;
  }

  get shouldLazyUpdate() {
    return this.hasVariableChildren;
  }

  onResizeBound = this.onResize.bind(this);

  onEventStartBound = this.onEventStart.bind(this);

  onEventEndBound = this.onEventEnd.bind(this);

  onEventDoingBound = this.onEventDoing.bind(this);

  @state()
  private clonedItemsBefore: HTMLElement[] = [];

  @state()
  private clonedItemsAfter: HTMLElement[] = [];

  async connectedCallback() {
    super.connectedCallback();

    this.itemElements = await getChildren(this.children);
    this.itemLength = this.itemElements.length;

    if (!this.shouldLazyUpdate && this.infinite) {
      const cloneAppend = (element: HTMLElement, slot: string) => {
        const cloneBefore = element.cloneNode(true) as HTMLElement;
        cloneBefore.setAttribute('slot', `fake-${slot}`);
        this.appendChild(cloneBefore);
      };
      this.itemElements.forEach((element) => {
        cloneAppend(element, 'before');
        let i = 0;
        while (i++ < this.fakeLength) {
          cloneAppend(element, 'after');
        }
      });
    }

    if (this.draggable) {
      this.addEventListener('mousedown', this.onEventStartBound);
      window.addEventListener('mouseup', this.onEventEndBound);
      window.addEventListener('mousemove', this.onEventDoingBound);
      this.addEventListener('touchstart', this.onEventStartBound);
      window.addEventListener('touchend', this.onEventEndBound);
      window.addEventListener('touchmove', this.onEventDoingBound);
    }
    if (this.auto && this.itemLength > 1) {
      const step = this.rolling ? 1 : undefined;
      this.onAuto(step);
      if (this.pause) {
        this.onmouseenter = () => {
          if (this.eventStatus === 'done') {
            this.holderFlag = true;
            clearTimeout(this.sto);
          }
        };
        this.onmouseleave = () => {
          if (this.eventStatus === 'done') {
            this.holderFlag = false;
            this.onAuto();
          }
        };
        this.ontouchstart = () => {
          if (this.eventStatus === 'done') {
            this.holderFlag = true;
            clearTimeout(this.sto);
          }
        };
        this.ontouchend = () => {
          if (this.eventStatus === 'done') {
            this.holderFlag = false;
            this.onAuto();
          }
        };
      }
    }
    if (this.flexWidth) {
      this.onResize();
      window.addEventListener('resize', this.onResizeBound);
    }
  }

  async firstUpdated() {
    if (!this.shouldLazyUpdate) {
      return;
    }

    if (!this.infinite) {
      return;
    }

    this.itemElements = await getChildren(this.children);
    this.itemLength = this.itemElements.length;

    this.itemElements.forEach((element) => {
      const cloneBefore = element.cloneNode(true) as HTMLElement;
      this.clonedItemsBefore.push(cloneBefore);

      for (let i = 0; i < this.fakeLength; i++) {
        const cloneAfter = element.cloneNode(true) as HTMLElement;
        this.clonedItemsAfter.push(cloneAfter);
      }
    });
  }

  disconnectedCallback() {
    if (this.draggable && this.itemLength > 1) {
      this.removeEventListener('mousedown', this.onEventStartBound);
      window.removeEventListener('mouseup', this.onEventEndBound);
      window.removeEventListener('mousemove', this.onEventDoingBound);
      this.removeEventListener('touchstart', this.onEventStartBound);
      window.removeEventListener('touchend', this.onEventEndBound);
      window.removeEventListener('touchmove', this.onEventDoingBound);
    }
    if (this.flexWidth) window.removeEventListener('resize', this.onResizeBound);
  }

  onResize() {
    this.visibleLength = this.clientWidth / this.flexWidth;
  }

  async onAuto(step: number = 0): Promise<void> {
    if (!this.auto) return;
    let duration = this.duration;
    clearTimeout(this.sto);
    if (this.index + step < this.itemLength) {
      if (this.eventStatus !== 'done') this.eventStatus = 'done';
      this.index += step;
      step = 1;
    } else {
      this.index = 0;
      duration = 0;
      step = 0;
      if (this.infinite) {
        this.eventStatus = 'fake';
        this.dragDistance = -this.clientWidth / this.visibleLength;
        this.userIndex = this.itemLength - 1;
      }
    }

    this.sto = setTimeout(() => this.onAuto(step), duration);
  }

  onIndicateClick(index: number) {
    this.onAuto(index);
    this.index = index;
  }

  onItemClick(event: MouseEvent) {
    if (!this.clickable) return;
    if (!this.moveable) return;
    const { target } = event;
    if (target instanceof HTMLElement)
      this.index = this.itemElements.findIndex((x: ChildNode) => target.isEqualNode(x));
  }

  getClientPoint(event: MouseEvent | TouchEvent) {
    let clientX = 0;
    let clientY = 0;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }
    return { clientX, clientY };
  }

  onEventStart(event: MouseEvent | TouchEvent) {
    if (this.eventStatus === 'done') {
      this.holderFlag = false;
      this.eventStatus = 'start';
      clearTimeout(this.sto);
      const { clientX, clientY } = this.getClientPoint(event);

      this.startPointer = {
        clientX,
        clientY
      };
    }
  }

  onEventEnd() {
    if (this.eventStatus === 'doing') {
      this.index = this.userIndex;
      this.dragDistance = 0;
    }
    this.eventStatus = 'done';
    this.onAuto();
  }

  closeIndex(position: number) {
    const { length } = this.itemElements;
    const diff = this.positions.map((x) => this.diff(x, position));
    const closePosition = Math.min(...diff);
    let index = diff.findIndex((x) => closePosition === x);
    const margin = this.infinite ? length : 0;
    const max = margin + length - 1; // 안전장치. 기본 인덱스 이상으로 안보이기
    const min = margin; // 기본 인덱스 이하로 안보이기
    if (index > max) index = max;
    else if (index < min) index = min;
    return index;
  }

  diff(a: number, b: number) {
    return a > b ? a - b : b - a;
  }

  onEventDoing(event: MouseEvent | TouchEvent) {
    if (['start', 'doing'].includes(this.eventStatus)) {
      const { clientX, clientY } = this.getClientPoint(event);
      const starterClientX = this.startPointer.clientX;
      const starterClientY = this.startPointer.clientY;
      this.dragDistance = starterClientX - clientX;
      if (this.eventStatus === 'start')
        if (this.diff(starterClientX, clientX) > 10 || this.diff(starterClientY, clientY) > 10)
          this.eventStatus = 'doing'; // 드레그가 시작됐다고 판단하는 움직임 +- 10
    }
  }

  render() {
    return html`
      <div
        class=${'hb-carousel__wrap' +
        (this.eventStatus === 'doing' ? ' hb-carousel__wrap--drag' : '')}
        style="transform: translateX(${this.itemPosition});--duration: ${this
          .transitionDuration}ms;--type: ${this.rolling ? 'linear' : 'ease'};"
      >
        ${this.infiniteSlotBeforeTemplate}
        <slot
          class="hb-carousel__items"
          @click="${this.onItemClick}"
          style="width: ${this.totalWidth}%;"
        ></slot>
        ${this.infiniteSlotAfterTemplate}
      </div>
      ${this.indicateTemplate}
    `;
  }

  get indicateTemplate() {
    if (this.indicate && this.itemLength > 1)
      return html`<div class="hb-carousel__indicate" part="indicate">
        ${Array(this.itemLength)
          .fill(null)
          .map(
            (_, i) =>
              html`<button
                @click=${() => this.onIndicateClick(i)}
                part="indicate-btn${i === this.index ? ' accent' : ''}"
                class="hb-carousel__indicate__btn${i === this.index
                  ? ' hb-carousel__indicate__btn--accent'
                  : ''}"
                title="View Item ${i + 1}"
              ></button>`
          )}
      </div>`;
  }

  get infiniteSlotBeforeTemplate() {
    if (this.infinite)
      return html`<slot
        class="hb-carousel__items hb-carousel__items--fake-before"
        name="fake-before"
        style="width: ${this.totalWidth}%; margin-left: ${-this.totalWidth}%;"
      >
        ${this.clonedItemsBefore.map((item) => html`${item}`)}
      </slot>`;
  }

  get infiniteSlotAfterTemplate() {
    if (this.infinite)
      return html`<slot
        class="hb-carousel__items hb-carousel__items--fake-after"
        name="fake-after"
        style="width: ${this.totalWidth * this.fakeLength}%;"
      >
        ${this.clonedItemsAfter.map((item) => html`${item}`)}
      </slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-carousel': HbCarousel;
  }
}
