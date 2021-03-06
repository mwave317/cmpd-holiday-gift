// @flow
import * as React from 'react';
import * as querystring from '../../../lib/queryString';
import { BootstrapTable } from 'react-bootstrap-table';

type PropType<Row> = {|
  // TODO: is sizePerPage actually returned by the server?
  fetch: (number, ?string) => Promise<{ items: Row[], totalSize: number, sizePerPage: number }>,
  children: React.Node,
  search: boolean,
  pagination: boolean,
  searchPlaceholder: string
|};

export default class DataTable<Row> extends React.Component<PropType<Row>, *> {
  state: {|
    items: Row[],
    totalSize: number,
    page: number,
    sizePerPage: number,
    defaultPage: number
  |};

  static defaultProps = {
    pagination: true,
    search: false,
    searchPlaceholder: 'Search'
  };

  defaultOptions = {
    pageStartIndex: 1, // where to start counting the pages
    paginationSize: 5, // the pagination bar size.
    prePage: 'Prev', // Previous page button text
    nextPage: 'Next', // Next page button text
    firstPage: 'First', // First page button text
    lastPage: 'Last', // Last page button text
    paginationShowsTotal: true, // Accept bool or function
    hideSizePerPage: true,
    searchDelayTime: 500
  };

  options: *;

  constructor(props: PropType<Row>) {
    super(props);

    // Looking for ?page and ?search
    const qs: Object = querystring.parse();
    const defaultPage: number = qs.page ? parseInt(qs.page, 10) : 1;
    const defaultSearch: string = qs.search || '';

    this.state = {
      items: [],
      totalSize: 1,
      sizePerPage: 10,
      page: defaultPage,
      defaultPage: defaultPage
    };

    this.options = {
      sizePerPage: this.state.sizePerPage, // which size per page you want to locate as default
      onPageChange: this.handlePageChange,
      onSearchChange: this.props && this.props.search ? this.handleSearchChange.bind(this) : undefined,
      page: defaultPage,
      defaultSearch,
      ...this.defaultOptions
    };

  }

  componentDidMount() {
    this.fetchData().then();
  }

  fetchData(page: number = this.state.page, searchText: string = ''): Promise<void> {
    //console.log('page', page, 'search', searchText);
    querystring.update({ page, search: searchText });
    return new Promise((resolve, _reject) => {
      // console.log('fetchData', page, searchText);
      this.props.fetch(page, searchText).then(data => {
        // console.log('results', data.items);
        this.options.sizePerPage = data.per_page;
        this.setState({ items: data.items, totalSize: data.totalSize, page, sizePerPage: data.per_page }, () => {
          resolve();
        });
      });
    });
  }

  handlePageChange = (page: number) => {
    this.fetchData(page);
  };

  handleSearchChange = (searchText?: string) => {
    this.fetchData(1, searchText);
  };

  render(): React.Node {
    return (
      <BootstrapTable
        data={(this.state.items: Array<any>)}
        fetchInfo={{ dataTotalSize: this.state.totalSize }}
        options={this.options}
        striped
        hover
        remote
        pagination={this.props.pagination}
        search={this.props.search}
        searchPlaceholder={this.props.searchPlaceholder}
        containerClass='table-responsive'
        tableContainerClass='table-responsive'
      >
        {this.props.children}
      </BootstrapTable>
    );
  }
}
