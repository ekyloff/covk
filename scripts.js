(function () {
  'use strict';

  var rowsCache = [];
  var supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  var dataUrl = 'publics.json';

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
    rowsCache.length = 0;
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

  function createRow(data, isSection) {
    var tr = document.createElement('tr');
    if (isSection) {
      tr.className = 'section-row';
      var th = document.createElement('th');
      th.colSpan = 3;
      th.scope = 'colgroup';
      th.textContent = data.title;
      tr.appendChild(th);
      return tr;
    }

    var nameCell = document.createElement('td');
    var link = document.createElement('a');
    link.href = data.url;
    link.rel = 'noopener';
    link.textContent = data.name;

    if (data.checkmark) {
      var checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      checkmark.setAttribute('width', '18');
      checkmark.setAttribute('height', '18');
      checkmark.setAttribute('viewBox', '0 0 18 18');
      checkmark.setAttribute('aria-hidden', 'true');
      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '4,10 8,14 14,6');
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', '#b0bec5');
      polyline.setAttribute('stroke-width', '2.5');
      checkmark.appendChild(polyline);
      var span = document.createElement('span');
      span.className = 'name-checkmark';
      span.appendChild(checkmark);
      link.appendChild(document.createTextNode(' '));
      link.appendChild(span);
    }

    nameCell.appendChild(link);

    var descCell = document.createElement('td');
    descCell.textContent = data.description;

    var tagsCell = document.createElement('td');
    tagsCell.className = 'js-tags';
    tagsCell.textContent = data.tags.join(', ');

    tr.appendChild(nameCell);
    tr.appendChild(descCell);
    tr.appendChild(tagsCell);

    return tr;
  }

  function renderTable(data) {
    var tbody = document.getElementById('publics-tbody');
    if (!tbody || !data || !data.sections) {
      return;
    }

    tbody.innerHTML = '';

    for (var i = 0; i < data.sections.length; i++) {
      var section = data.sections[i];
      tbody.appendChild(createRow({ title: section.title }, true));

      if (section.items && section.items.length) {
        for (var j = 0; j < section.items.length; j++) {
          tbody.appendChild(createRow(section.items[j], false));
        }
      }
    }

    prepareRows();
    filterByTag();
  }

  function loadJson(callback) {
    if (window.fetch) {
      fetch(dataUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(function (json) {
          callback(json);
        })
        .catch(function () {
          // fallback to static markup
        });
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', dataUrl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            callback(JSON.parse(xhr.responseText));
          } catch (e) {
            // ignore
          }
        }
      };
      xhr.send();
    }
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
    setupSearch();
    setupScrollButton();
    loadJson(renderTable);
    prepareRows();
    filterByTag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
