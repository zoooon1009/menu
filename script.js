const apiURL = "https://script.google.com/macros/s/AKfycbx5XqPLqJo-xrpvgygyaOQXKRXkdeCa75_NgQAhzr9WZS8j3ao8SzO9j1RR3mTLWmnshQ/exec";

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    const form = document.getElementById("menu-form");
    data.forEach(item => {
      const isDiscount = item["備考"]?.includes("割") || false;
      const price = parseInt(item["価格"]);
      const course = item["対応コース"];
      const html = `
        <div class="menu-item">
          <label>
            <input type="checkbox" class="menu-check"
              data-price="\${price}" data-discount="\${isDiscount}" data-course="\${course}">
            <img src="\${item["画像URL"]}" alt="\${item["英語名"]}" />
            <span class="menu-label">\${item["英語名"]} / \${item["メニュー名（日本語）"]}</span>
            <span class="menu-price">\${isDiscount ? "−" : ""}¥\${price.toLocaleString()}</span>
          </label>
        </div>
      `;
      form.insertAdjacentHTML("beforeend", html);
    });

    setupTotalLogic();
  });

function setupTotalLogic() {
  document.querySelectorAll(".menu-check").forEach(chk => {
    chk.addEventListener("change", updateTotal);
  });
}

function updateTotal() {
  let total = 0;
  let highestCourse = "";
  const courseRank = {
    "ライト": 1,
    "ベーシック": 2,
    "プレミアム": 3
  };

  document.querySelectorAll(".menu-check").forEach(chk => {
    if (chk.checked) {
      let price = parseInt(chk.dataset.price);
      let discount = chk.dataset.discount === "true";
      if (discount) {
        total -= price;
      } else {
        total += price;
      }

      const course = chk.dataset.course;
      if (courseRank[course] && (!highestCourse || courseRank[course] > courseRank[highestCourse])) {
        highestCourse = course;
      }
    }
  });

  document.getElementById("total").textContent = `¥${total.toLocaleString()}`;
  document.getElementById("course").textContent = highestCourse || "なし";
}
