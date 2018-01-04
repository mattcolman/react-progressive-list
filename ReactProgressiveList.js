// @flow
import * as React from 'react';
import times from 'lodash/times';

// [MC] Progressive load list items. By default it loads X rows first, then
// when you scroll to the end of that list it requests to load more (displaying a loader at the end
// of the list by default).
//
// You can also choose to lazily load more rows on each idle frame.
//
// This results in a fast initial render and avoids the complicated nature of a virtualised list.
//
// NOTE - This is a pure component so be sure to pass in new props if you need the list to update.
// By default if the length prop doesn't change then the list won't update.
//
// NOTE - requestIdleCallback is currently not supported by safari.

type Props = {
  className?: string,
  idleAmount?: number,
  initialAmount?: number,
  itemRenderer: (index: number) => any,
  length: number,
  minActiveThreshold?: number, // we don't want to bother progressive loading if length is very close to initialAmount
  progressiveAmount?: number,
  renderLoader?: () => any,
  useWindowScroll?: boolean
};

type State = {
  numRenderRows: number
};

class ReactProgressiveList extends React.PureComponent<Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    className: undefined,
    idleAmount: 1, // load one extra row on idle by default
    initialAmount: 20,
    minActiveThreshold: 0,
    progressiveAmount: 40,
    renderLoader: () => null,
    useWindowScroll: false
  };
  requestId: number; // eslint-disable-line react/sort-comp
  ref: React.Node;
  isLoading = false;

  constructor(props: Props, ...args: Array<any>) {
    super(props, ...args);
    const { length, initialAmount, minActiveThreshold } = props;
    this.state = {
      numRenderRows: length <= minActiveThreshold ? length : initialAmount
    };
  }

  componentDidMount() {
    const { useWindowScroll } = this.props;
    this.progressivelyLoadMore(false);
    const scrollParent = useWindowScroll ? window : this.ref.parentElement;
    scrollParent.addEventListener('scroll', this.handleScroll, {
      passive: true
    });
  }

  handleScroll = e => {
    const { length, progressiveAmount, useWindowScroll } = this.props;
    const { numRenderRows } = this.state;
    // console.log('scroll ref', this.ref);
    let top, height, scrollHeight, reachedLimit;
    if (useWindowScroll) {
      const boundingClientRect = this.ref.getBoundingClientRect();
      top = boundingClientRect.top;
      height = boundingClientRect.height;
      scrollHeight = window.innerHeight;
      reachedLimit = top + height < scrollHeight;
    } else {
      top = e.target.scrollTop;
      height = e.target.offsetHeight;
      scrollHeight = e.target.scrollHeight;
      reachedLimit = top + height >= scrollHeight;
    }
    // console.log('top', top + height, 'scrollh', scrollHeight);
    if (reachedLimit && numRenderRows !== length && !this.isLoading) {
      this.loadMore(progressiveAmount);
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.length !== this.props.length) {
      this.initializeList(nextProps);
    }
  }

  componentWillUnmount() {
    const { useWindowScroll } = this.props;
    if (window.requestIdleCallback) window.cancelIdleCallback(this.requestId);
    const scrollParent = useWindowScroll ? window : this.ref.parentElement;
    scrollParent.removeEventListener('scroll', this.handleScroll);
  }

  initializeList(props: Props) {
    const { length, minActiveThreshold, initialAmount } = props;
    if (window.requestIdleCallback) window.cancelIdleCallback(this.requestId);
    this.setState(
      { numRenderRows: length <= minActiveThreshold ? length : initialAmount },
      () => {
        this.progressivelyLoadMore(false);
      }
    );
  }

  progressivelyLoadMore = (immediateLoad: boolean = true) => {
    const { length, idleAmount } = this.props;
    const { numRenderRows } = this.state;
    if (!window.requestIdleCallback || idleAmount === 0) return;
    if (immediateLoad) this.loadMore(idleAmount);
    if (numRenderRows < length) {
      this.requestId = window.requestIdleCallback(this.progressivelyLoadMore);
    }
  };

  loadMore(amount: number) {
    const { length } = this.props;
    if (this.state.numRenderRows >= length) return;
    // console.log('loadmore', amount);
    this.isLoading = true;
    this.setState(
      state => ({
        numRenderRows: Math.min(state.numRenderRows + amount, length)
      }),
      () => {
        this.isLoading = false;
      }
    );
  }

  render() {
    const { className, itemRenderer, length, renderLoader } = this.props;
    const { numRenderRows } = this.state;
    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
        className={className}
      >
        {times(numRenderRows, i => itemRenderer(i))}
        {numRenderRows < length && renderLoader()}
      </div>
    );
  }
}

export default ReactProgressiveList;
