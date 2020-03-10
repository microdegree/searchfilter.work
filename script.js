"use strict";

var sortBy_arr = [],
    filterList = [], 
    qsRegex = "", 
    searchInputField = null;

function initializeCatalog() {
  "use strict";
  var btns_filterByCategory_arr = document.querySelectorAll(".c-btn--filter-by-category"),
      btn_filterByCategory_showAll = document.querySelector(".c-btn--filter-by-category__show-all"),
      btns_sortBy_arr = document.querySelectorAll(".c-btn--sort-by");

  searchInputField = document.querySelector(".c-quicksearch");


  var isoGrid = new Isotope(".c-grid", {
    itemSelector: ".c-opus",
    percentPosition: false,
    layoutMode: "masonry",
    masonry: {
      columnWidth: ".c-grid--sizer"
    },
    getSortData: {
      name: ".c-opus__title",
      year: ".c-opus__year",
      category: "[data-comp-category]"
    },
    sortBy: ["year", "name"],
    filter: function filter(itemElem) {
      console.log("called the filter option on the isoGrid");

      var searchResult = qsRegex ? itemElem.querySelector('.c-opus__title').innerText.match(qsRegex) : true;
      console.log("searchResult", searchResult);
      return searchResult;
    }
  });


  btn_filterByCategory_showAll.addEventListener("click", handleShowAllFilter);
  btn_filterByCategory_showAll.params = {
    isoGrid: isoGrid,
    filterList: filterList
  };
  for (var i = 0, len = btns_filterByCategory_arr.length; i < len; i++) {
    btns_filterByCategory_arr[i].addEventListener("click", handleFilter);
    btns_filterByCategory_arr[i].params = {
      isoGrid: isoGrid,
      filterList: filterList,
      showAllBtn: btn_filterByCategory_showAll,
      qsRegex: qsRegex,
      searchInputField: searchInputField
    };
  }

  for (var j = 0; j < btns_sortBy_arr.length; j++) {
    btns_sortBy_arr[j].addEventListener("click", handleSorting);
    btns_sortBy_arr[j].params = {
      isoGrid: isoGrid,
      sortBy_arr: sortBy_arr
    };
  }


  searchInputField.addEventListener('keyup', debounce(function (e) {
    qsRegex = new RegExp(searchInputField.value, 'gi');

    isoGrid.arrange({
      filter: function (itemElem) {

        let searchResult = qsRegex ? itemElem.querySelector('.c-opus__title').innerText.match(qsRegex) : true
        return searchResult
      }
    });
  }, 250))

  searchInputField.addEventListener('focus', handleShowAllFilter);
  searchInputField.params = handleShowAllFilterParams

}

function handleSorting(e) {
  "use strict";

  e.preventDefault();

  var curTarget = e.currentTarget,
      grid = curTarget.params.isoGrid,
      sortByTerms = curTarget.dataset.sortBy;

  if (curTarget.parentNode.querySelector(".is-checked").classList.contains("is-checked")) {
    curTarget.parentNode.querySelector(".is-checked").classList.remove("is-checked");
  }

  curTarget.classList.add("is-checked");

  grid.arrange({
    sortBy: sortByTerms
  });

  clearSearchInputField();
}

function handleFilter(e) {
  "use strict";

  var curTarget = e.currentTarget,
      grid = curTarget.params.isoGrid,
      showAllBtn = curTarget.params.showAllBtn,
      filterList = curTarget.params.filterList,
      filter = curTarget.dataset.filterByCategory,
      isChecked = curTarget.classList.toggle("is-checked");

  if (isChecked) {
    addFilter(filterList, filter);
  } else {
    removeFilter(filterList, filter);
  }

  grid.arrange({
    filter: filterList.join(",")
  });

  checkShowAllBtnStatus(showAllBtn, filterList);

  clearSearchInputField();
}

function handleShowAllFilter (e) {
  'use strict'
  let curTarget = e.currentTarget,
    filterList = curTarget.params.filterList,
    grid = curTarget.params.isoGrid,
    showAllBtn = curTarget.params.showAllBtn,
    parentEl = curTarget.params.parentEl;

  resetFilter(filterList)

  resetIsCheckedBtns(parentEl)


  checkShowAllBtnStatus(showAllBtn, filterList)

 
  clearSearchInputField();


  grid.arrange({
    filter: ''
  })

}


function addFilter(filterList, filter) {
  "use strict";

  console.log("filter", filter);

  if (filterList.indexOf(filter) === -1) {
    filterList.push(filter);
  }

  console.log("filterList", filterList);
}

function removeFilter(filterList, filter) {
  "use strict";

  var index = filterList.indexOf(filter);
  if (index !== -1) {
    filterList.splice(index, 1);
  }
}

function handleShowAllFilter(e) {
  "use strict";

  var curTarget = e.currentTarget,
      filterList = curTarget.params.filterList,
      parentEl = curTarget.parentElement,
      grid = curTarget.params.isoGrid;

  resetFilter(filterList);

  resetIsCheckedBtns(parentEl);

  checkShowAllBtnStatus(curTarget, filterList);

  grid.arrange({
    filter: ""
  });

  clearSearchInputField();
}

function resetFilter(filterList) {
  "use strict";

  filterList.splice(0, filterList.length);
}


function checkShowAllBtnStatus(btn, filterArr) {
  if (filterArr.length === 0) {
    if (!btn.classList.contains("is-checked")) {
      btn.classList.add("is-checked");
    }
  } else {
    if (btn.classList.contains("is-checked")) {
      btn.classList.remove("is-checked");
    }
  }
}

function resetIsCheckedBtns(el) {
  "use strict";

  if (el.getElementsByClassName("is-checked")) {
    var checked = el.getElementsByClassName(
      "c-btn--filter-by-category is-checked"
    );

    while (checked.length > 0) {
      checked[0].classList.remove("is-checked");
    }
  }
}

function clearSearchInputField() {
  document.querySelector(".c-quicksearch").value = "";
  qsRegex = "";
}


function debounce(fn, threshold) {
  var timeout = void 0;
  threshold = threshold || 100;
  return function debounced() {
    clearTimeout(timeout);
    var args = arguments;
    var _this = this;
    function delayed() {
      fn.apply(_this, args);
    }
    timeout = setTimeout(delayed, threshold);
  };
}

window.onload = function() {
  "use strict";
  if (document.querySelector(".c-grid__compositions")) {
    initializeCatalog();
  }
};


















