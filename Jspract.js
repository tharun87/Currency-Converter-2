const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropDowns = document.querySelectorAll(".dropDowns select");
const exchngRateBtn = document.querySelector("#exchngRateBtn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const resultMsg = document.querySelector(".msg p");
const amountInput = document.querySelector("#inputVal");

// Populate dropdowns and set event listeners
for (let select of dropDowns) {
  for (let currencyCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currencyCode;
    newOption.value = currencyCode;

    if (select.name === "from" && currencyCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currencyCode === "INR") {
      newOption.selected = "selected";
    }

    select.appendChild(newOption);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    fetchExchangeRate(); // Update on currency change
  });
}

// Update flag icon
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch and display exchange rate
const fetchExchangeRate = async () => {
  let amountVal = parseFloat(amountInput.value);
  if (isNaN(amountVal) || amountVal < 1) {
    amountVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const url = `${BASE_URL}/${from}.json`;

  try {
    resultMsg.innerText = "Fetching rate...";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");

    const data = await response.json();
    const rate = data[from][to];
    const converted = (amountVal * rate).toFixed(2);

    resultMsg.innerText = `${amountVal} ${fromCurr.value} = ${converted} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching rate:", error);
    resultMsg.innerText = "Could not fetch exchange rate.";
  }
};

// On button click, fetch exchange rate
exchngRateBtn.addEventListener("click", (event) => {
  event.preventDefault();
  fetchExchangeRate();
});

// On page load, fetch default rate
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  fetchExchangeRate();
});


const swapIcon = document.querySelector("#swapIcon");

swapIcon.addEventListener("click", () => {
  // Swap dropdown values
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Fetch new exchange rate
  fetchExchangeRate();
});

