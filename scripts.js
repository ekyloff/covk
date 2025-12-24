(function () {
  'use strict';

  var rowsCache = [];
  var supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function highlightTags(text, searchTags) {
    var highlighted = escapeHtml(text);
    if (!searchTags.length) {
      return highlighted;
    }

    for (var i = 0; i < searchTags.length; i++) {
      var search = searchTags[i];
      if (!search) {
        continue;
      }
      var safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp('(' + safeSearch + ')', 'gi');
      highlighted = highlighted.replace(regex, '<span class="tag-highlight">$1</span>');
    }

    return highlighted;
  }

  function updateCount(shown) {
    var countBlock = document.getElementById('search-count');
    if (countBlock) {
      countBlock.textContent = 'Найдено: ' + shown;
    }
  }

  function filterByTag() {
    var input = document.getElementById('tag-search');
    if (!input) {
      return;
    }

    var rawInput = input.value.toLowerCase().trim();
    var searchTags = rawInput.split(',').map(function (tag) {
      return tag.trim();
    }).filter(Boolean);

    var shown = 0;

    for (var i = 0; i < rowsCache.length; i++) {
      var entry = rowsCache[i];
      var matches = !searchTags.length || searchTags.every(function (search) {
        return entry.tagsList.some(function (tag) {
          return tag.indexOf(search) !== -1;
        });
      });

      entry.row.style.display = matches ? '' : 'none';
      entry.tagCell.innerHTML = matches ? highlightTags(entry.originalText, searchTags) : escapeHtml(entry.originalText);

      if (matches) {
        shown++;
      }
    }

    updateCount(shown);
  }

  function prepareRows() {
    var table = document.getElementById('publics-table');
    if (!table) {
      return;
    }

    var trs = table.getElementsByTagName('tr');
    for (var i = 0; i < trs.length; i++) {
      var cells = trs[i].getElementsByTagName('td');
      if (cells.length < 3) {
        continue;
      }

      var tagCell = cells[2];
      var originalText = tagCell.textContent || '';
      var tagsList = originalText.toLowerCase().split(',').map(function (tag) {
        return tag.trim();
      }).filter(Boolean);

      tagCell.setAttribute('data-original-tags', originalText);
      rowsCache.push({
        row: trs[i],
        tagCell: tagCell,
        tagsList: tagsList,
        originalText: originalText
      });
    }
  }

  function showTagsColumn() {
    var tags = document.getElementsByClassName('js-tags');
    for (var i = 0; i < tags.length; i++) {
      tags[i].style.display = 'table-cell';
    }
  }

  function setupScrollButton() {
    var upBtn = document.getElementById('scroll-up-btn');
    if (!upBtn) {
      return;
    }

    window.addEventListener('scroll', function () {
      var scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      upBtn.style.display = scrollPosition > 200 ? 'block' : 'none';
    });

    upBtn.onclick = function () {
      if (supportsSmoothScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    };
  }

  function setupSearch() {
    var input = document.getElementById('tag-search');
    var resetBtn = document.getElementById('reset-search-btn');

    if (input) {
      input.addEventListener('input', filterByTag);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          filterByTag();
        }
      });
    }

    if (resetBtn) {
      resetBtn.onclick = function () {
        if (input) {
          input.value = '';
        }
        filterByTag();
        if (input) {
          input.focus();
        }
      };
    }
  }

  function init() {
    showTagsColumn();
    prepareRows();
    setupSearch();
    setupScrollButton();
    filterByTag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
