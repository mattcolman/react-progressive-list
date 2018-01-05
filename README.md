<div align="center">
    <img alt="react-progressive-list" src="https://raw.githubusercontent.com/mattcolman/react-progressive-list/master/react-progressive-list.jpg" height="200px" />
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

## Install

`yarn add react-progressive-list`

## Example

```
  renderRow = index => {
    return <Row key={index} avatar={avatars[index]} name={names[index]} />;
  }

  render() {
    return (
      <ReactProgressiveList
        itemRenderer={this.renderRow}
        length={400}
        initialAmount={40}
        progressiveAmount={20}
        renderLoader={() => <Spinner />}
        useWindowScroll
      />
    );
  }
```
