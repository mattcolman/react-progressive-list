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
  renderLoader?: () => any
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
    minActiveThreshold: 40,
    progressiveAmount: 40,
    renderLoader: () => null
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
    this.progressivelyLoadMore(false);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  handleScroll = e => {
    const { length, progressiveAmount } = this.props;
    const { numRenderRows } = this.state;
    const { top, height, width } = this.ref.getBoundingClientRect();
    if (
      top + height < window.innerHeight &&
      numRenderRows !== length &&
      !this.isLoading
    ) {
      this.loadMore(progressiveAmount);
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.length !== this.props.length) {
      this.initializeList(nextProps);
    }
  }

  componentWillUnmount() {
    if (window.requestIdleCallback) window.cancelIdleCallback(this.requestId);
    window.removeEventListener('scroll', this.handleScroll);
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
    if (!window.requestIdleCallback) return;
    const { length, idleAmount } = this.props;
    const { numRenderRows } = this.state;
    if (immediateLoad) this.loadMore(idleAmount);
    if (numRenderRows < length) {
      this.requestId = window.requestIdleCallback(this.progressivelyLoadMore);
    }
  };

  loadMore(amount: number) {
    // console.log('loadmore', amount);
    const { length } = this.props;
    if (this.state.numRenderRows >= length) return;
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
