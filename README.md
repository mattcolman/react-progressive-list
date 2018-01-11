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

## Demo

`http://mattcolman.com/react-progressive-list-example`

<div align="center">
    <img alt="example" src="https://raw.githubusercontent.com/mattcolman/react-progressive-list/master/example.gif" height="300px" />
</div>

<br />

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
        initialRowCount={40}
        progressiveRowCount={20}
        renderItem={this.renderRow}
        renderLoader={() => <Spinner />}
        totalRowCount={400}
        useWindowScroll
      />
    );
  }
```

### Props

| Property              | Type                          | Default | Description                                                                                            |
| :-------------------- | :---------------------------- | :------ | :----------------------------------------------------------------------------------------------------- |
| `initialRowCount`     | number                        | 10      | initial number of rows to display                                                                      |
| `progressiveRowCount` | number                        | 10      | number of rows to render each time a new batch is requested                                            |
| `renderItem`          | (index: number) => React.Node | none    | function that returns the row to render                                                                |
| `renderLoader`        | () => React.Node              | none    | function that returns a loader to render                                                               |
| `totalRowCount`       | number                        | none    | the length of your list                                                                                |
| `useWindowScroll`     | boolean                       | false   | When true will use a scroll listener on the window, otherwise will use a scroll listener on the parent |
