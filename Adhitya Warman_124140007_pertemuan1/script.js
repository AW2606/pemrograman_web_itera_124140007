/* ==========================================================
   TechMart POS (Versi D)
   Pola: IIFE + state tunggal + fungsi dispatch(aksi).
   Setiap perubahan -> dispatch -> simpan -> render ulang.
   ========================================================== */
(function () {
  "use strict";

  // ----- konfigurasi -----
  var CFG = {
    key: "techmart_pos_state",
    minNama: 3,
    minHarga: 500,
    minDiskon: 50000,
    persenDiskon: 10
  };

  // ----- state tunggal -----
  var state = { items: [] };
  var nextId = 1;

  // ----- helper -----
  function byId(id) { return document.getElementById(id); }
  function rp(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

  var el = {
    form: byId("posForm"),
    nama: byId("iNama"), harga: byId("iHarga"), qty: byId("iQty"),
    eNama: byId("eNama"), eHarga: byId("eHarga"), eQty: byId("eQty"),
    body: byId("cBody"), count: byId("cCount"),
    total: byId("pTotal"), diskon: byId("pDiskon"), diskonLabel: byId("pDiskonLabel"), grand: byId("pGrand"),
    bayar: byId("iBayar"), chgBox: byId("chgBox"), change: byId("pChange"), note: byId("pNote"),
    reset: byId("bReset"), jam: byId("jam")
  };

  // ----- localStorage -----
  function save() {
    localStorage.setItem(CFG.key, JSON.stringify(state));
  }

  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(CFG.key));
      if (saved && Array.isArray(saved.items)) {
        state.items = saved.items.filter(function (it) {
          return it && typeof it.nama === "string" && Number(it.harga) > 0 && Number(it.qty) > 0;
        });
        // lanjutkan id agar tidak bentrok
        state.items.forEach(function (it) { if (it.id >= nextId) nextId = it.id + 1; });
      }
    } catch (e) {
      state.items = [];
    }
  }

  // ----- kalkulator (fungsi murni) -----
  function hitung(items) {
    var total = items.reduce(function (s, it) { return s + it.harga * it.qty; }, 0);
    var diskon = total >= CFG.minDiskon ? total * CFG.persenDiskon / 100 : 0;
    return { total: total, diskon: diskon, grand: total - diskon };
  }

  // ----- validasi (fungsi murni) -----
  function validate(nama, hargaStr, qtyStr) {
    var err = {};
    var harga = Number(hargaStr);
    var qty = Number(qtyStr);

    if (nama.length < CFG.minNama) err.nama = "nama barang wajib diisi, min " + CFG.minNama + " karakter";

    if (hargaStr === "" || isNaN(harga)) err.harga = "harga wajib berupa angka";
    else if (harga < CFG.minHarga) err.harga = "harga minimal Rp " + CFG.minHarga.toLocaleString("id-ID");

    if (qtyStr === "" || isNaN(qty)) err.qty = "qty wajib berupa angka";
    else if (!Number.isInteger(qty) || qty < 1) err.qty = "qty harus bilangan bulat >= 1";

    return { ok: !err.nama && !err.harga && !err.qty, err: err, harga: harga, qty: qty };
  }

  function showErrors(err) {
    var rows = [[el.nama, el.eNama, err.nama], [el.harga, el.eHarga, err.harga], [el.qty, el.eQty, err.qty]];
    rows.forEach(function (r) {
      r[1].textContent = r[2] || "";
      r[0].classList.toggle("x", !!r[2]);
    });
  }

  // ----- dispatch: satu-satunya pintu mengubah state -----
  function dispatch(action) {
    switch (action.type) {
      case "ADD":
        state.items.push({ id: nextId++, nama: action.nama, harga: action.harga, qty: action.qty });
        break;
      case "REMOVE":
        state.items = state.items.filter(function (it) { return it.id !== action.id; });
        break;
      case "CLEAR":
        state.items = [];
        break;
    }
    if (action.type === "CLEAR") localStorage.removeItem(CFG.key);
    else save();
    render();
  }

  // ----- render -----
  function renderTable() {
    el.body.innerHTML = "";
    if (state.items.length === 0) {
      var tr0 = document.createElement("tr");
      tr0.innerHTML = '<td colspan="6" class="empty">keranjang kosong</td>';
      el.body.appendChild(tr0);
    }

    state.items.forEach(function (it, i) {
      var tr = document.createElement("tr");
      var cells = [
        [String(i + 1), ""],
        [it.nama, ""],
        [rp(it.harga), "r"],
        [String(it.qty), "r"],
        [rp(it.harga * it.qty), "r"]
      ];
      cells.forEach(function (c) {
        var td = document.createElement("td");
        td.textContent = c[0];
        if (c[1]) td.className = c[1];
        tr.appendChild(td);
      });

      var tdBtn = document.createElement("td");
      tdBtn.className = "c";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "b-del";
      btn.textContent = "HAPUS";
      btn.setAttribute("data-id", it.id);
      tdBtn.appendChild(btn);
      tr.appendChild(tdBtn);

      el.body.appendChild(tr);
    });

    el.count.textContent = state.items.length + " item";
  }

  function renderChange(grand) {
    var raw = el.bayar.value.trim();
    el.chgBox.classList.remove("ok", "low");

    if (raw === "" || isNaN(Number(raw))) {
      el.change.textContent = rp(0);
      el.note.textContent = "";
      return;
    }

    var diff = Number(raw) - grand;
    if (grand === 0) {
      el.change.textContent = rp(0);
      el.note.textContent = "keranjang masih kosong";
    } else if (diff < 0) {
      el.change.textContent = rp(0);
      el.note.textContent = "uang belum mencukupi (kurang " + rp(-diff) + ")";
      el.chgBox.classList.add("low");
    } else {
      el.change.textContent = rp(diff);
      el.note.textContent = "pembayaran cukup";
      el.chgBox.classList.add("ok");
    }
  }

  function renderSummary() {
    var r = hitung(state.items);
    el.total.textContent = rp(r.total);
    el.diskon.textContent = "- " + rp(r.diskon);
    el.diskonLabel.textContent = r.diskon > 0 ? "DISKON_" + CFG.persenDiskon + "% (>= Rp 50.000)" : "DISKON (min Rp 50.000)";
    el.grand.textContent = rp(r.grand);
    renderChange(r.grand);
  }

  function render() {
    renderTable();
    renderSummary();
  }

  // ----- event -----
  el.form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = el.nama.value.trim();
    var v = validate(nama, el.harga.value.trim(), el.qty.value.trim());
    showErrors(v.err);
    if (!v.ok) return;

    dispatch({ type: "ADD", nama: nama, harga: v.harga, qty: v.qty });
    el.form.reset();
    showErrors({});
    el.nama.focus();
  });

  // event delegation untuk tombol hapus
  el.body.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-id]");
    if (btn) dispatch({ type: "REMOVE", id: Number(btn.getAttribute("data-id")) });
  });

  el.bayar.addEventListener("input", renderSummary);

  el.reset.addEventListener("click", function () {
    if (state.items.length > 0 && !confirm("Mulai transaksi baru? Keranjang akan dikosongkan.")) return;
    el.bayar.value = "";
    el.form.reset();
    showErrors({});
    dispatch({ type: "CLEAR" });
  });

  // jam digital (dekorasi tema)
  function tick() {
    el.jam.textContent = new Date().toLocaleTimeString("id-ID", { hour12: false });
  }
  tick();
  setInterval(tick, 1000);

  // ----- start -----
  load();
  render();
})();
