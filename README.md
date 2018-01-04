<div align="center">
    <img alt="react-progressive-list" src="https://raw.githubusercontent.com/mattcolman/react-progressive-list/master/react-progressive-list.jpg" height="150px" />
</div>

<br />

[React Progressive List](https://www.npmjs.com/package/react-progressive-list)
is an alternative to
[React Virtualized](https://github.com/bvaughn/react-virtualized). It wins in
two possible scenarios:

1. Your list rows are complex and slow to render. react-virtualized cannot
   render new rows fast enough to maintain a smooth 60fps scroll.
2. You've tried react-virtualized and found it to be overly complicated for your
   basic needs.

## Example

```
  renderRow = index => {
    return <Row key={index} avatar={avatars[index]} name={names[index]} />;
  }

  render() {
    <ReactProgressiveList
      itemRenderer={this.renderRow}
      length={400}
      idleAmount={0}
      initialAmount={20}
      progressiveAmount={10}
      renderLoader={() => <Spinner />}
      useWindowScroll={false}
    />
  }
```
