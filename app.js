// Объединяем основные модели и LWOOP с рассрочкой
const ALL_CABINS = [...CABINS, ...CABINS_LWOOP_INSTALLMENT.map(c => ({
  ...c,
  soundproof: ">32 дБ",
  soundproofVal: 32,
  warranty: "7 лет",
  delivery: "50 раб. дней",
  furniture: "См. базовую модель",
  power: "См. базовую модель",
  features: ["Цена с учётом рассрочки на 6 мес.", `Базовая цена: ${c.basePrice.toLocaleString('ru-RU')} ₽`],
  dimensions: "—"
}))];

const state = {
  capacity: "all",
  brand: "all",
  sort: "price-asc"
};

function fmt(n) {
  return n.toLocaleString('ru-RU');
}

function brandClass(brand, prefix) {
  const map = {
    "Capsula": "",
    "Qubius": prefix + "--qubius",
    "LWOOP": prefix + "--lwoop",
    "Рассрочка": prefix + "--lwoop-i"
  };
  return map[brand] || "";
}

function getFiltered() {
  let list = ALL_CABINS.filter(c => {
    if (state.capacity !== "all" && c.capacity !== parseInt(state.capacity)) return false;
    if (state.brand !== "all" && c.brand !== state.brand) return false;
    return true;
  });
  list.sort((a, b) => {
    switch (state.sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "capacity-asc": return a.capacity - b.capacity || a.price - b.price;
      case "warranty-desc": return b.warrantyYears - a.warrantyYears || a.price - b.price;
      default: return 0;
    }
  });
  return list;
}

function renderCards() {
  const list = getFiltered();
  const container = document.getElementById("cards");
  if (!list.length) {
    container.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-3);">Нет моделей, соответствующих фильтру.</div>`;
    return;
  }
  container.innerHTML = list.map(c => {
    const features = (c.features || []).slice(0, 5).map(f => `<li>${f}</li>`).join("");
    return `
      <article class="card">
        <div class="card__image">
          ${c.image ? `<img src="${c.image}" alt="${c.brand} ${c.model}" loading="lazy" />` : ''}
          <span class="card__brand ${brandClass(c.brand, 'card__brand')}">${c.brand}</span>
        </div>
        <h3 class="card__model">${c.model}</h3>
        <div class="card__price"><small>от</small>${fmt(c.price)} ₽</div>
        <div class="card__meta">
          <div class="card__meta-item">
            <span class="card__meta-label">Вместимость</span>
            <span class="card__meta-value">${c.capacity} ${c.capacity === 1 ? 'человек' : c.capacity < 5 ? 'человека' : 'человек'}</span>
          </div>
          <div class="card__meta-item">
            <span class="card__meta-label">Звукоизоляция</span>
            <span class="card__meta-value">${c.soundproof}</span>
          </div>
          <div class="card__meta-item">
            <span class="card__meta-label">Гарантия</span>
            <span class="card__meta-value">${c.warranty}</span>
          </div>
          <div class="card__meta-item">
            <span class="card__meta-label">Поставка</span>
            <span class="card__meta-value">${c.delivery}</span>
          </div>
        </div>
        <div class="card__furniture">
          <strong>Мебель и питание</strong>
          ${c.furniture}<br/>
          <span style="color:var(--ink-3);font-size:12px;">${c.power || ''}</span>
        </div>
        <ul class="card__features">${features}</ul>
      </article>
    `;
  }).join("");
}

function renderTable() {
  const list = getFiltered();
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = list.map(c => {
    const feats = (c.features || []).slice(0, 3).map(f => `<span>${f}</span>`).join("");
    return `
      <tr>
        <td class="model">${c.model}</td>
        <td><span class="badge ${brandClass(c.brand, 'badge')}">${c.brand}</span></td>
        <td>${c.capacity} чел.</td>
        <td class="num">${fmt(c.price)}</td>
        <td>${c.soundproof}</td>
        <td>${c.dimensions}</td>
        <td>${c.warranty}</td>
        <td>${c.delivery}</td>
        <td>${c.furniture}</td>
        <td>${c.power || '—'}</td>
        <td><div class="feat-list">${feats}</div></td>
      </tr>
    `;
  }).join("");
}

function bindControls() {
  document.querySelectorAll('.chip[data-capacity]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-capacity]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.capacity = btn.dataset.capacity;
      render();
    });
  });
  document.querySelectorAll('.chip[data-brand]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-brand]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.brand = btn.dataset.brand;
      render();
    });
  });
  document.getElementById('sort').addEventListener('change', e => {
    state.sort = e.target.value;
    render();
  });
}

function render() {
  renderCards();
  renderTable();
}

bindControls();
render();
