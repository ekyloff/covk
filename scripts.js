document.documentElement.className = document.documentElement.className.replace('no-js', '');

function filterByTag() {
  var input = document.getElementById('tag-search').value.toLowerCase().trim();
  var table = document.getElementById('publics-table');
  var trs = table.getElementsByTagName('tr');
  var searchTags = input.split(',').map(function(tag) { return tag.trim(); }).filter(Boolean);
  var shown = 0;
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].getElementsByTagName('td');
    if (tds.length > 0) {
      var tagCell = tds[2] ? tds[2] : null;
      if (tagCell) {
        var orig = tagCell.textContent;
        tagCell.innerHTML = orig.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (searchTags.length > 0) {
          searchTags.forEach(function(search) {
            if (search) {
              tagCell.innerHTML = tagCell.innerHTML.replace(new RegExp('('+search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+')', 'gi'), '<span class="tag-highlight">$1</span>');
            }
          });
        }
      }
      var tagText = tagCell ? tagCell.textContent.toLowerCase() : '';
      var tags = tagText.split(',').map(function(tag) { return tag.trim(); });
      var found = searchTags.length === 0 || searchTags.every(function(search) {
        return tags.some(function(tag) { return tag.indexOf(search) !== -1; });
      });
      trs[i].style.display = found ? '' : 'none';
      if (found) shown++;
    }
  }
  var countBlock = document.getElementById('search-count');
  if (countBlock) countBlock.textContent = 'Найдено: ' + shown;
}

window.onload = function() {
  var tags = document.getElementsByClassName('js-tags');
  for (var i = 0; i < tags.length; i++) {
    tags[i].style.display = 'table-cell';
  }
  var upBtn = document.getElementById('scroll-up-btn');
  if (upBtn) {
    window.addEventListener('scroll', function() {
      upBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    upBtn.onclick = function() { window.scrollTo({top:0,behavior:'smooth'}); };
  }
  var resetBtn = document.getElementById('reset-search-btn');
  if (resetBtn) {
    resetBtn.onclick = function() {
      document.getElementById('tag-search').value = '';
      filterByTag();
    };
  }
  filterByTag();
}; 