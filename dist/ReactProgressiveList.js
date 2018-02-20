'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _times = require('lodash/times');

var _times2 = _interopRequireDefault(_times);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// [MC] Progressive load list items. By default it loads X rows first, then
// when you scroll to the end of that list it requests to load more (displaying a loader at the end
// of the list by default).
//
// You can also choose to lazily load more rows on each idle frame.
//
// This results in a fast initial render and avoids the complicated nature of a virtualised list.
//
// NOTE - This is a pure component so be sure to pass in new props if you need the list to update.
// By default if the rowCount prop doesn't change then the list won't update.
//
// NOTE - requestIdleCallback is currently not supported by safari.

var ReactProgressiveList = function (_React$PureComponent) {
  _inherits(ReactProgressiveList, _React$PureComponent);

  // eslint-disable-line react/sort-comp
  function ReactProgressiveList(props) {
    var _ref;

    _classCallCheck(this, ReactProgressiveList);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = ReactProgressiveList.__proto__ || Object.getPrototypeOf(ReactProgressiveList)).call.apply(_ref, [this, props].concat(args)));

    _initialiseProps.call(_this);

    var rowCount = props.rowCount,
        initialAmount = props.initialAmount,
        isActive = props.isActive;

    _this.state = {
      numRenderRows: isActive ? initialAmount : rowCount
    };
    return _this;
  }

  _createClass(ReactProgressiveList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var useWindowScroll = this.props.useWindowScroll;

      this.progressivelyLoadMore(false);
      var scrollParent = useWindowScroll ? window : this.ref.parentElement;
      scrollParent.addEventListener('scroll', this.handleScroll, {
        passive: true
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.rowCount !== this.props.rowCount) {
        this.initializeList(nextProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var useWindowScroll = this.props.useWindowScroll;

      if (window.requestIdleCallback) window.cancelIdleCallback(this.requestId);
      var scrollParent = useWindowScroll ? window : this.ref.parentElement;
      scrollParent.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'initializeList',
    value: function initializeList(props) {
      var _this2 = this;

      var rowCount = props.rowCount,
          isActive = props.isActive,
          initialAmount = props.initialAmount;

      if (window.requestIdleCallback) window.cancelIdleCallback(this.requestId);
      this.setState({
        numRenderRows: isActive ? initialAmount : rowCount
      }, function () {
        _this2.progressivelyLoadMore(false);
      });
    }
  }, {
    key: 'loadMore',
    value: function loadMore(amount) {
      var _this3 = this;

      var rowCount = this.props.rowCount;

      if (this.state.numRenderRows >= rowCount) return;
      this.isLoading = true;
      this.setState(function (state) {
        return {
          numRenderRows: Math.min(state.numRenderRows + amount, rowCount)
        };
      }, function () {
        _this3.isLoading = false;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          className = _props.className,
          renderItem = _props.renderItem,
          renderLoader = _props.renderLoader,
          rowCount = _props.rowCount;
      var numRenderRows = this.state.numRenderRows;

      return React.createElement(
        'div',
        {
          ref: function ref(_ref2) {
            _this4.ref = _ref2;
          },
          className: className
        },
        (0, _times2.default)(numRenderRows, function (i) {
          return renderItem(i);
        }),
        numRenderRows < rowCount && renderLoader()
      );
    }
  }]);

  return ReactProgressiveList;
}(React.PureComponent);

ReactProgressiveList.defaultProps = {
  className: undefined,
  idleAmount: 0, // load one extra row on idle by default
  initialAmount: 10,
  isActive: true,
  progressiveAmount: 10,
  renderLoader: function renderLoader() {
    return null;
  },
  useWindowScroll: false
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.isLoading = false;

  this.handleScroll = function (e) {
    var _props2 = _this5.props,
        rowCount = _props2.rowCount,
        progressiveAmount = _props2.progressiveAmount,
        useWindowScroll = _props2.useWindowScroll;
    var numRenderRows = _this5.state.numRenderRows;

    var top = void 0,
        height = void 0,
        scrollHeight = void 0,
        reachedLimit = void 0;
    if (useWindowScroll) {
      var boundingClientRect = _this5.ref.getBoundingClientRect();
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
    if (reachedLimit && numRenderRows !== rowCount && !_this5.isLoading) {
      _this5.loadMore(progressiveAmount);
    }
  };

  this.progressivelyLoadMore = function () {
    var immediateLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var _props3 = _this5.props,
        rowCount = _props3.rowCount,
        idleAmount = _props3.idleAmount;
    var numRenderRows = _this5.state.numRenderRows;

    if (!window.requestIdleCallback || idleAmount === 0) return;
    if (immediateLoad) _this5.loadMore(idleAmount);
    if (numRenderRows < rowCount) {
      _this5.requestId = window.requestIdleCallback(_this5.progressivelyLoadMore);
    }
  };
};

ReactProgressiveList.propTypes = {
  className: require('prop-types').string,
  idleAmount: require('prop-types').number,
  initialAmount: require('prop-types').number,
  isActive: require('prop-types').bool,
  progressiveAmount: require('prop-types').number,
  renderItem: require('prop-types').func.isRequired,
  rowCount: require('prop-types').number.isRequired,
  renderLoader: require('prop-types').func,
  useWindowScroll: require('prop-types').bool
};
exports.default = ReactProgressiveList;