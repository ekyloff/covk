(function () {
  'use strict';

  var rowsCache = [];
  var supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  var dataUrl = 'publics.json';
  // Основной источник данных — publics.json. fallbackData нужен только для офлайн/file:// случаев,
  // когда загрузка JSON недоступна. При обновлении каталога правьте publics.json и синхронизируйте блок ниже.
  var fallbackData = {
    "sections": [
      {
        "title": "Интересное про OpenVK",
        "items": [
          {"name": "OpenVK", "url": "https://ovk.to/club1", "description": "официальный новостной паблик OpenVK", "tags": ["OpenVK", "обновления", "администрация"], "checkmark": true},
          {"name": "VepurOVK", "url": "https://ovk.to/vepurovk", "description": "второй по популярности инстанс OpenVK", "tags": ["OpenVK", "альтернатива"], "checkmark": true},
          {"name": "Сейберпедия", "url": "https://ovk.to/saber", "description": "местная википедия", "tags": ["OpenVK", "википедия", "факты"]},
          {"name": "БРАЧНОЕ АГЕНТСТВО ИМЕНИ МЫСЛИВЕЦА | БАИМ", "url": "https://ovk.to/omate", "description": "здесь можно найти друзей (￣▽￣)", "tags": ["знакомства", "общения", "друзья", "средний актив"]},
          {"name": "Несуществующие факты OpenVK", "url": "https://ovk.to/facts", "description": "несуществующие факты OpenVK", "tags": ["OpenVK", "факты", "редкий актив"]},
          {"name": "Регистрации ОВК на каждый день", "url": "https://ovk.to/everydayregs", "description": "статистика пользователей в OpenVK", "tags": ["OpenVK", "статистика", "частый актив"]},
          {"name": "Ржака OpenVK", "url": "https://ovk.to/club1246", "description": "мэмчики про OpenVK и всё что с ним связано", "tags": ["OpenVK", "мемы", "постирония", "средний актив"], "checkmark": true},
          {"name": "Приложение OpenVK", "url": "https://ovk.to/club181", "description": "официальное приложение OpenVK", "tags": ["OpenVK", "приложение", "нулевой актив"], "checkmark": true},
          {"name": "Express Reborn", "url": "https://ovk.to/club7", "description": "паблик с инсайдами", "tags": ["OpenVK", "обновления", "мертв"], "checkmark": true},
          {"name": "OpenVK Leaks", "url": "https://ovk.to/club1152", "description": "ещё паблик с инсайдами", "tags": ["OpenVK", "обновления", "инсайды", "мертв"], "checkmark": true},
          {"name": "Официальные страницы OpenVK", "url": "https://ovk.to/club141", "description": "паблик про галочки", "tags": ["OpenVK", "информация", "администрация"], "checkmark": true},
          {"name": "VKify", "url": "https://ovk.to/club4839", "description": "расширение для OpenVK", "tags": ["OpenVK", "дополнение", "расширение", "полезно", "редкий актив"], "checkmark": true},
          {"name": "Статистика openvk.su", "url": "https://ovk.to/club1707", "description": "паблик с статистикой OpenVK", "tags": ["OpenVK", "статистика", "мертв"]},
          {"name": "*VK Confessions!!!", "url": "https://ovk.to/confessions", "description": "(не)интересные факты про OpenVK и VK", "tags": ["OpenVK", "факты", "фишки", "лайфхаки", "средний актив"]},
          {"name": "LIVE Reborn", "url": "https://ovk.to/liver", "description": "исторические сводки, факты и всякое про OpenVK", "tags": ["OpenVK", "факты", "фишки", "лайфхаки", "информация", "частый актив"]}
        ]
      },
      {
        "title": "Мемы",
        "items": [
          {"name": "Группа любителей выебать \"Выебаться Крепкое\"", "url": "https://ovk.to/club4964", "description": "постирония", "tags": ["мемы", "постирония", "абсурд", "частый актив"]},
          {"name": "Копипаста, Inc", "url": "https://ovk.to/copypastainc", "description": "абстрактный но смешной юмор", "tags": ["мемы", "анекдоты", "старый юмор", "частый актив"]},
          {"name": "скупка краденого фумосибирск", "url": "https://ovk.to/keorph", "description": "шизопаблик про фумо (?)", "tags": ["мемы", "шизофрения", "абсурд", "постирония", "аморал", "средний актив"]},
          {"name": "цитаты для реальных пацанов (ЦДРП)", "url": "https://ovk.to/cdrpcool", "description": "абсурдные постироничные цитаты", "tags": ["мемы", "постирония", "абсурд", "частый актив"]},
          {"name": "устрицы и пустота", "url": "https://ovk.to/a_figenna", "description": "дэбильные приколы", "tags": ["мемы", "постирония", "абсурд", "тикток", "частый актив"]},
          {"name": "Тексты без контекста", "url": "https://ovk.to/text", "description": "какие-то смешные пасты", "tags": ["пасты", "постирония", "абсурд", "редкий актив"]},
          {"name": "Аниме Мемы", "url": "https://ovk.to/club5566", "description": "паблик из тг с неоч смешными аниме-приколами", "tags": ["мемы", "нормисы", "частый актив"], "checkmark": true},
          {"name": "IT CRINGE | АЙТИ КРИНЖ", "url": "https://ovk.to/club5585", "description": "айтишные приколы, паблик из вк", "tags": ["мемы", "нормисы", "частый актив"]},
          {"name": "украденные приколы", "url": "https://ovk.to/uk_radeno", "description": "постирония + среднячковые мемы", "tags": ["мемы", "шизофрения", "абсурд", "постирония", "аморал", "средний актив"]},
          {"name": "Gaymez Cum", "url": "https://ovk.to/gaymez_cum", "description": "мемы на игровую/компьютерную тематику", "tags": ["мемы", "нормисы", "игры", "тикток", "IT", "компы", "частый актив"]},
          {"name": "салодельфия", "url": "https://ovk.to/salodelfia", "description": "абсурдные тикток приколы", "tags": ["мемы", "постирония", "абсурд", "тикток", "частый актив"]},
          {"name": ">>>TerpeLka.", "url": "https://ovk.to/club5404", "description": "смешной абсурдик", "tags": ["мемы", "шизофрения", "абсурд", "постирония", "аморал", "средний актив"]},
          {"name": "3ch - classic 2015 memes", "url": "https://ovk.to/club6829", "description": "те самые тролляцкие мемы из 2015", "tags": ["мемы", "шизофрения", "абсурд", "постирония", "аморал", "частый актив"]},
          {"name": "Gay Garfield's Basement", "url": "https://ovk.to/club6341", "description": "рандом щитпост мемы", "tags": ["мемы", "постирония", "абсурд", "коты", "частый актив"]}
        ]
      },
      {
        "title": "Развлекательный контент",
        "items": [
          {"name": "группа для веселья в интернете", "url": "https://ovk.to/funposting", "description": "различные приколы с закосом на запад", "tags": ["мемы", "нормисы", "аниме", "арты", "картинки", "коты", "частый актив"], "checkmark": true},
          {"name": "ОС-Тян как смысл жизни", "url": "https://ovk.to/ostan", "description": "аниме-девки ОС (виндовс-тян)", "tags": ["аниме", "IT", "компы", "арты", "частый актив"], "checkmark": true},
          {"name": "Комьюнити Frutiger Aero", "url": "https://ovk.to/faerochat", "description": "паблик про эстетику фрутигер аеро", "tags": ["ностальгия", "frutiger aero", "картинки", "вайб", "частый актив"]},
          {"name": "Этот пользователь...", "url": "https://ovk.to/thisuser", "description": "забавные баннеры на страничку", "tags": ["картинки", "вайб", "частый актив"]},
          {"name": "E:/music/крутое_музло", "url": "https://ovk.to/myzlo", "description": "перезаливы различных альбомов, песенок, андеграунд", "tags": ["музыка", "андеграунд", "частый актив"]},
          {"name": "Фотографы в овк", "url": "https://ovk.to/club5374", "description": "фоточки от сообщества овк", "tags": ["картинки", "фото", "открытая стена", "частый актив"]},
          {"name": "Анимешные чанучи.", "url": "https://ovk.to/club8", "description": "аниме-девки", "tags": ["аниме", "арты", "средний актив"]},
          {"name": "группа для тех кто еле еле просипается сутра..", "url": "https://ovk.to/club5", "description": "эмммм", "tags": ["ностальгия", "средний актив"]},
          {"name": "Мир старых устройств", "url": "https://ovk.to/club4922", "description": "истории и фоточки олдовых девайсов", "tags": ["ностальгия", "IT", "компы", "телефоны", "средний актив", "открытая стена"]},
          {"name": "AESTO Project for OpenVK", "url": "https://ovk.to/club2639", "description": "олдскульная эстетика", "tags": ["ностальгия", "IT", "компы", "frutiger aero", "картинки", "вайб", "частый актив"]},
          {"name": "TideSoft", "url": "https://ovk.to/club760", "description": "поставщик программного обеспечения", "tags": ["IT", "компы", "абсурд", "постирония", "редкий актив"], "checkmark": true},
          {"name": "neofolk.ru", "url": "https://ovk.to/club4863", "description": "вайбик + приколы", "tags": ["мемы", "абсурд", "вайб", "частый актив"]},
          {"name": "E=mc²", "url": "https://ovk.to/club2603", "description": "какие-то умные посты", "tags": ["гуманитарии", "учеба", "факты", "редкий актив"]},
          {"name": ".gif thugs out of time | GIF + sound", "url": "https://ovk.to/club4765", "description": "включил музон, гифку и кайфуешь", "tags": ["мемы", "картинки", "музыка", "частый актив"]},
          {"name": "Кулинарная книга", "url": "https://ovk.to/cookingbook", "description": "вкуснейшие рецепты всего овк", "tags": ["картинки", "еда", "частый актив"]},
          {"name": "scumsshittt!", "url": "https://ovk.to/scums", "description": "мам скачай пинтерест у нас есть пинтерест дома:", "tags": ["картинки", "музыка", "мемы", "вайб", "частый актив"]},
          {"name": "a e s t h e t i c", "url": "https://ovk.to/aesthetic", "description": "эстетика всего. от котов до гробов", "tags": ["картинки", "вайб", "частый актив"]},
          {"name": "Desktopcore", "url": "https://ovk.to/desktopcore", "description": "ваши, и не только ваши рабочие столы", "tags": ["картинки", "вайб", "IT", "компы", "телефоны", "ностальгия", "софт", "открытая стена", "средний актив"]},
          {"name": "!internet!", "url": "https://ovk.to/club6347", "description": "пасты с двача и не с двача", "tags": ["пасты", "постирония", "абсурд", "шизофрения", "аморал", "частый актив"]},
          {"name": "OVKBOOM", "url": "https://ovk.to/ovkboom", "description": "перезаливы различных альбомов, песенок но уже не андеграунд", "tags": ["музыка", "частый актив"]},
          {"name": "Юродский", "url": "https://ovk.to/club7044", "description": "религиозные цитаты", "tags": ["цитаты", "религия", "частый актив"]}
        ]
      },
      {
        "title": "Новостники",
        "items": [
          {"name": "STREAM INSIDE", "url": "https://ovk.to/stream_inside", "description": "типо про твич-стримеров и шлюх", "tags": ["новости", "twitch", "youtube", "стримы", "стримеры", "частый актив"]},
          {"name": "информационные технологии и прочий калл", "url": "https://ovk.to/it_and_kall", "description": "новости написанные нейросетью... ?", "tags": ["новости", "компы", "телефоны", "IT", "игры", "частый актив"]}
        ]
      },
      {
        "title": "Известные личности",
        "items": [
          {"name": "Daniel Myslivets", "url": "https://ovk.to/club2", "description": "один из самых популярных виндоблоггеров (?)", "tags": ["IT", "компы", "youtube"], "checkmark": true},
          {"name": "CompShop", "url": "https://ovk.to/compshop_ru", "description": "делают смешные шортсы про компы", "tags": ["IT", "компы", "youtube", "мертв"], "checkmark": true},
          {"name": "Рифмы и Панчи", "url": "https://ovk.to/club5438", "description": "рифмы и сранчи реально из тг", "tags": ["мемы", "ностальгия", "мертв"], "checkmark": true},
          {"name": "veselcraft", "url": "https://ovk.to/club75", "description": "влогер про мобилы и основатель OpenVK", "tags": ["IT", "компы", "телефоны", "ностальгия", "youtube"], "checkmark": true},
          {"name": "Группа сайта old-dos.ru", "url": "https://ovk.to/club493", "description": "сайт про старый софт", "tags": ["IT", "компы", "ностальгия", "софт", "мертв"], "checkmark": true}
        ]
      },
      {
        "title": "Фандомы",
        "items": [
          {"name": "мысли Тору Адачи", "url": "https://ovk.to/persona", "description": "мемы по серии игр Persona", "tags": ["мемы", "аниме", "арты", "средний актив"]},
          {"name": "Let's all love Lain", "url": "https://ovk.to/lain_experiments", "description": "арты с анимешкой «Эксперименты Лейн»", "tags": ["аниме", "арты", "частый актив"]},
          {"name": "Картинки с Neco-Arc", "url": "https://ovk.to/necoarcimages", "description": "арты с неко-арк", "tags": ["аниме", "арты", "открыта стена", "частый актив"]},
          {"name": "Арты с Мику Хатсуне", "url": "https://ovk.to/club2116", "description": "арты с мику", "tags": ["аниме", "арты", "вокалоиды", "открыта стена", "частый актив"]},
          {"name": "*ФанКлуб Касане Тето*", "url": "https://ovk.to/club5730", "description": "фанаты тето груши", "tags": ["аниме", "арты", "вокалоиды", "открыта стена", "частый актив"]},
          {"name": "Объединение Моникафагов | Monika DDLC | Доки Доки Литературный Клуб | Аниме", "url": "https://ovk.to/monikafags", "description": "интересные факты с артами моники", "tags": ["аниме", "арты", "гуманитарии", "факты", "ddlc", "частый актив"]},
          {"name": "Windows XP", "url": "https://ovk.to/windowsxp", "description": "группа фанатов виндовс хрюши", "tags": ["IT", "компы", "ностальгия", "софт", "открыта стена", "мертв"]},
          {"name": "LegacyiOS Club", "url": "https://ovk.to/iosclub", "description": "клуб любителей старых iOS", "tags": ["IT", "телефоны", "ностальгия", "софт", "открыта стена", "частый актив"]},
          {"name": "My little brony мемы, конкурсы, пони(MLP)", "url": "https://ovk.to/club5841", "description": "про поней, группа ОЧЕНЬ сомнительного качества даже для постиронии", "tags": ["мемы", "арты", "ностальгия", "пони", "брони", "ньюфаги", "открыта стена", "частый актив"]},
          {"name": "Фанклуб Красной Плесени в Open VK", "url": "https://ovk.to/club4603", "description": "всякие приколюхи с красной плесенью и все что с ней связано", "tags": ["музыка", "ностальгия", "открыта стена", "редкий актив"]},
          {"name": "Yandere Simulator | fandom", "url": "https://ovk.to/yanderesimulatorfandom", "description": "фанклуб игры, которая никогда не выйдет в релиз", "tags": ["аниме", "арты", "игры", "открыта стена", "средний актив"]}
        ]
      },
      {
        "title": "Местные щитпостеры",
        "items": [
          {"name": "Stellessia", "url": "https://ovk.to/stellessia", "description": "женщина (или нет...)", "tags": ["IT", "компы", "программирование"]},
          {"name": "Blogoteber", "url": "https://ovk.to/blogoteber", "description": "программист типо матвей креветко", "tags": ["IT", "компы", "программирование"]}
        ]
      },
      {
        "title": "Проекты",
        "items": [
          {"name": "hterminal", "url": "https://ovk.to/hterminal", "description": "hentai terminal я хз", "tags": ["IT", "компы", "программирование", "софт"]},
          {"name": "KICQ - ICQ на старом протоколе", "url": "https://ovk.to/oldicq", "description": "та самая аська", "tags": ["IT", "компы", "ностальгия", "софт", "мертв (приложение работает)"]},
          {"name": "VK4ME", "url": "https://ovk.to/vk4me", "description": "клиент (о)вк для устройств с поддержкой j2me", "tags": ["OpenVK", "IT", "телефоны", "ностальгия", "софт", "мертв (приложение работает)"], "checkmark": true}
        ]
      }
    ]
  };

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
    var onFail = function () {
      callback(fallbackData);
    };

    if (window.fetch) {
      fetch(dataUrl, { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(function (json) {
          callback(json);
        })
        .catch(onFail);
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', dataUrl, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              callback(JSON.parse(xhr.responseText));
              return;
            } catch (e) {
              // продолжим на fallback
            }
          }
          onFail();
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
