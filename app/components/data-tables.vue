<template>
  <div class="v-table">
    <div class="v-table-header">
      <div class="v-table-header-count">
        <select v-model="dataTable.options.pageCount" class="form-control" @change="onChangePageCount()">
          <option>5</option>
          <option>10</option>
          <option>15</option>
          <option>20</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>

      <div class="v-table-header-search">
       <input type="text" class="form-control" v-model="searchBy" placeholder=" 搜索 ">
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="column in dataTable.columns"
              @click="sortBy(column)"
              :class="{sort: isSortable(column), 
                       desc: sort.sortBy === column.value && sort.desc,
                       asc: sort.sortBy === column.value && !sort.desc}">{{column.text}}</th>
            <th>
              操作
            </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in filteredRows | pagination currentPage dataTable.optionts.pageCount" track-by="$index">
          <td v-for="(key, item) in row" >
            <span>{{item.value}}</span>
          </td>
          <td>
            <div  class="v-caozuo-d">
              <a  v-link="{name:'shop_product_index',params: { shopid: row.id.value }}">添加</a>
              <a :class="" v-for="action in actions"
                @click.prevent="invokeAction(action.name,row.id.value)">{{action.display}}</a>
            </div>
             
          </td>
        </tr>
      </tbody>
    </table>

    <div class="v-table-footer">
      <div class="v-table-footer-info">
        当前显示是: {{firstRow + 1}} 到 {{lastRow}} # 总共 {{filteredRows.length}}
      </div>

      <div class="v-table-footer-page" v-if="lastPage !== 1">
        <a class="v-table-footer-page-btn" href="javascript:;"
           @click="togglePage('prev')"
           :class="{disabled: currentPage == 1}">上一页</a>
        <a class="v-table-footer-page-btn" href="javascript:;"
           :class="{current: currentPage == 1}"
           @click="togglePage(1)">1</a>
        <span v-if="currentPage >= 5 && lastPage > 10">...</span>
        <a class="v-table-footer-page-btn" href="javascript:;"
           :class="{current: currentPage == page + 1}"
           @click="togglePage(page + 1)"
           v-for="page in centerPartPage">{{page + 1}}</a>
        <span v-if="lastPage > 10 && lastPage - currentPage > 5">...</span>
        <a class="v-table-footer-page-btn" href="javascript:;"
           :class="{current: currentPage == page + 1}"
           @click="togglePage(page + 1)"
           v-for="page in lastPartPage">{{page + 1}}</a>
        <a class="v-table-footer-page-btn" href="javascript:;"
           @click="togglePage('next')"
           :class="{disabled: currentPage == lastPage}">下一页</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ucFirst
  } from '../lib/utils';

  export default {
    props: ['dataTable'],

    data: function() {
      return {
        currentPage: 1,
        searchBy: '',
        rows: [],
        sort: {
          sortBy: '',
          desc: true
        },
        actions: [{
          name: 'edit',
          display: '编辑',
          prop: 'id'
        }, {
          name: 'delete',
          display: '删除',
          prop: 'id'
        }]
      }
    },

    computed: {
      filteredRows() {
        return this.filterRows(this.dataTable.rows, this.dataTable.options, this.currentPage);
      },

      lastPage() {
        return Math.ceil(this.filteredRows.length / this.dataTable.options.pageCount);
      },

      centerPartPage() {
        if (this.lastPage > 10 && this.currentPage >= 5) {
          if (this.lastPage - this.currentPage > 5) {
            return this.currentPage === this.lastPage ? [this.currentPage - 3, this.currentPage - 2, this.currentPage - 1] : [this.currentPage - 2, this.currentPage - 1, this.currentPage];
          } else {
            const r = [];

            for (let i = this.lastPage - 6; i < this.lastPage; i++) {
              r.push(i);
            }
            return r;
          }
        } else if (this.lastPage > 10) {
          const r = [];

          for (let i = 1; i < 5; i++) {
            r.push(i);
          }
          return r;
        } else {
          const r = [];

          for (let i = 1; i < this.lastPage; i++) {
            r.push(i);
          }
          return r;
        }
      },

      lastPartPage() {
        if (this.lastPage > 10 && this.lastPage - this.currentPage > 5) {
          return [this.lastPage - 1];
        } else {
          return [];
        }
      },

      firstRow() {
        return this.currentPage === 1 ? 0 : this.dataTable.options.pageCount * (this.currentPage - 1);
      },

      lastRow() {
        return this.dataTable.options.pageCount * this.currentPage > this.filteredRows.length ? this.filteredRows.length : this.dataTable.options.pageCount * this.currentPage;
      }
    },

    watch: {
      'dataTable.rows' (rows) {
        rows.forEach((row, index) => {
          for (let key in row) {
            const column = this.dataTable.columns.filter((column) => {
              return column.value === key;
            })[0];
          }

          this.dataTable.rows[index] = row;
        });
      },

      'dataTable.columns' (columns) {
        columns.forEach((column, index) => {
          column = Object.assign({
            sortable: false
          }, column);

          this.dataTable.columns[index] = column;
        })
      }
    },

    filters: {
      pagination(rows, currentPage, pageCount) {
        return this.getPageRows(rows, currentPage, pageCount);
      }
    },

    methods: {
      invokeAction: function(action, params) {
        //                if (action && params) {
        //                    this.$dispatch('on' + ucFirst(action), params);
        //                }
        //accept array or string
        action = 'on' + ucFirst(action);
        let args = [];
        if (Array.isArray(params)) {
          params.unshift(action);
          args = params;
        } else {
          args = [action, params];
        }
        let dispatch = this.$dispatch;
        dispatch.apply(this, args);
      },
      onChangePageCount() {
        console.log(this.filteredRows);
        this.currentPage = 1;
      },

      filterRows(rows, options, currentPage) {
        rows = this.sort.sortBy ? this.sortRows(rows, this.sort.sortBy) : rows;

        if (this.searchBy !== '') {
          this.currentPage = 1;

          rows = rows.filter((row) => {
            let r = false;
            let sea = this.searchBy.replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
            let searr = sea.split(" ");

            for (let key in row) {
              let rowVa = row[key].value.toString().toLowerCase();
              let cnub = 0;

              if (rowVa.indexOf(searr[0]) !== -1) {
                r = true;
              }
            }

            return r;
          });
        }

        return rows;
      },

      getPageRows(rows) {
        return rows.slice(this.firstRow, this.lastRow);
      },

      togglePage(page) {
        switch (page) {
          case 'prev':
            if (this.currentPage <= 1) return;
            this.currentPage--;
            break;
          case 'next':
            if (this.currentPage >= this.lastPage) return;
            this.currentPage++;
            break;
          default:
            if (this.currentPage == page) return;
            this.currentPage = page;
        }
      },

      sortBy(column) {
        if (!column.sortable || !this.dataTable.options.sortable) return;

        if (column.value === this.sort.sortBy) {
          this.sort.desc = !this.sort.desc;
        } else {
          this.sort.sortBy = column.value;
          this.sort.desc = true;
        }
      },



      sortRows(rows, sortBy) {
        const arr = rows.slice(0);

        return arr.sort((a, b) => {
          const r = this.sort.desc ? a[sortBy].value < b[sortBy].value : a[sortBy].value > b[sortBy].value;

          return r ? 1 : -1;
        })
      },

      isSortable(column) {
        return column.sortable && this.dataTable.options.sortable;
      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $sortSize: 5px;
  @mixin singleSortIcon($borderColor) {
    content: "";
    position: absolute;
    border-left: $sortSize solid transparent;
    border-right: $sortSize solid transparent;
    border-bottom: 2 * $sortSize solid $borderColor;
  }
  
  .v-table {
    table {
      width: 100%;
      border-collapse: collapse;
      thead {
        border-bottom: 1px solid #111111;
        th {
          position: relative;
          padding: 10px 18px;
          text-align: left;
          background-color: #CBCCCD;
          font-weight: bold;
          &.sort {
            cursor: pointer;
            &::after {
              @include singleSortIcon(#FAFAFA);
              right: $sortSize;
              top: 50%;
              margin-top: -(2 * $sortSize);
            }
            &::before {
              @include singleSortIcon(#FAFAFA);
              right: $sortSize;
              top: 50%;
              margin-top: 3px;
              transform: rotate(180deg);
            }
            &.desc {
              &::after {
                display: none;
              }
              &::before {
                @include singleSortIcon(#333);
                right: $sortSize;
                top: 50%;
                margin-top: -$sortSize;
              }
            }
            &.asc {
              &::before {
                display: none;
              }
              &::after {
                @include singleSortIcon(#333);
                right: $sortSize;
                top: 50%;
                margin-top: -$sortSize;
              }
            }
          }
        }
      }
      tbody {
        border-bottom: 1px solid #111111;
        tr {
          background-color: #fff;
          td {
            text-align: left;
            padding: 4px;
            padding-bottom: 0;
          }
          &:nth-child(odd) {
            background-color: #f9f9f9;
            td:nth-child(1) {
              background-color: #F1F1F2;
            }
          }
          &:nth-child(even) {
            td:nth-child(1) {
              background-color: #fafafa;
            }
          }
        }
      }
    }
    & &-header,
    & &-footer {
      display: table;
      height: 40px;
      width: 100%;
      line-height: 40px;
      &::after {
        content: '';
        clear: both;
      }
    }
    & &-header {
      &-count {
        float: left;
      }
      &-search {
        float: right;
      }
    }
    & &-footer {
      margin-top: 10px;
      &-info {
        float: left;
      }
      &-page {
        font-size: 0;
        float: right;
        span {
          display: inline-block;
          font-size: 1rem;
          padding: 10px 15px;
        }
        &-btn {
          display: inline-block;
          height: 40px;
          box-sizing: border-box;
          padding: 0px 15px;
          line-height: 40px;
          text-decoration: none;
          color: #000;
          border-radius: 2px;
          font-size: 1rem;
          &:hover {
            color: #fff;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
            background-color: #333;
          }
          &:nth-last-child(1) {
            margin-right: 0;
          }
          &.disabled {
            cursor: default;
            color: #666;
            &:hover {
              color: #666;
              background-color: transparent;
              border: none;
            }
          }
          &.current {
            color: #000;
            border: 1px solid #979797;
            background-color: #fff;
            /*background: linear-gradient(to bottom, #fff 0%, #dcdcdc 100%);*/
          }
        }
      }
    }
  }
  
  .v-caozuo-d {
    min-width: 40px;
    a {
      display: inline-block;
      line-height: 26px;
      &:first-child,&:nth-child(2){
        font-size: 14px;
        color: #FFF;
        background-color: #337ab7;
        padding: 5px 10px;
        margin-bottom: 10px;
        margin-right: 20px;
      }
      &:nth-child(3){
       display:none;
      }
    }
  }
</style>