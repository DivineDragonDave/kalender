document.addEventListener("DOMContentLoaded", function () {
  const monthDisplay = document.getElementById("monthDisplay");
  const yearDisplay = document.getElementById("yearDisplay");
  const imageInput = document.getElementById("imageInput");
  const printButton = document.getElementById("printButton");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");
  const colorPicker = document.getElementById("colorPicker");
  const daysOfWeek = [
    "Söndag",
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag",
  ];
  const daysContainer = document.querySelector(".days");
  const datesContainer = document.querySelector(".under");

  async function fetchRedDays(year, monthName) {
    try {
      const monthIndex = months.indexOf(monthName) + 1; // Konverterar månadens namn till ett index
      const response = await fetch(
        `https://date.nager.at/api/v3/publicholidays/${year}/SE`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const holidays = await response.json();
      markRedDays(holidays, year);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function markRedDays(holidays, year) {
    holidays.forEach((holiday) => {
      const date = new Date(holiday.date);
      const monthIndex = date.getMonth();
      const day = date.getDate();

      if (monthIndex === months.indexOf(monthSelect.value)) {
        const dateElements = document.querySelectorAll(".date");
        dateElements.forEach((elem) => {
          if (parseInt(elem.textContent, 10) === day) {
            elem.classList.add("red-day"); // Lägger till en klass för att markera röda dagar

            // Kontrollerar om elementet redan har ett holidayName-element
            if (!elem.querySelector(".holiday-name")) {
              // Skapa ett nytt span-element för att visa namnet på helgdagen
              const holidayName = document.createElement("span");
              holidayName.classList.add("holiday-name");
              holidayName.textContent = holiday.localName;

              // Lägg till holidayName-elementet i dateElement
              elem.appendChild(holidayName);
            }
          }
        });
      }
    });
  }

  function handleImageUpload(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        const overElement = document.querySelector(".over");
        overElement.style.display = "flex"; // Visa elementet
        overElement.querySelector("img").src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function getFirstDayOfMonth(year, month) {
    const firstDay = new Date(year, months.indexOf(month), 0);
    return firstDay.getDay();
  }

  function updateCalendarDays(year, month) {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = new Date(year, months.indexOf(month) + 1, 0).getDate();

    // Ta bort befintliga dagar från kalendern
    while (datesContainer.firstChild) {
      datesContainer.removeChild(datesContainer.firstChild);
    }

    // Lägg till tomma celler för att justera månaden
    for (let i = 0; i < firstDay; i++) {
      const emptyDate = document.createElement("div");
      emptyDate.classList.add("date");
      datesContainer.appendChild(emptyDate);
    }

    // Lägg till datum
    for (let day = 1; day <= daysInMonth; day++) {
      const dateElement = document.createElement("div");
      dateElement.classList.add("date", "date-content");
      dateElement.textContent = day;
      datesContainer.appendChild(dateElement);
    }

    // Visa .under om det finns datum
    if (daysInMonth > 0) {
      datesContainer.style.display = "grid";
    } else {
      datesContainer.style.display = "grid";
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleMonthChange() {
    const year = yearSelect.value;
    const month = monthSelect.value;
    monthDisplay.textContent = month;
    yearDisplay.textContent = year;
    updateCalendarDays(year, month);
    fetchRedDays(year, month);
  }

  function handleYearChange() {
    const year = yearSelect.value;
    const month = monthSelect.value;
    monthDisplay.textContent = month;
    yearDisplay.textContent = year;
    updateCalendarDays(year, month);
    fetchRedDays(year, month);
  }

  imageInput.addEventListener("change", handleImageUpload);
  printButton.addEventListener("click", handlePrint);
  monthSelect.addEventListener("change", handleMonthChange);
  yearSelect.addEventListener("change", handleYearChange);
  colorPicker.addEventListener("input", function (event) {
    colorPicker.style.color = colorPicker.value;
    const selectedColor = event.target.value;
    yearDisplay.style.color = selectedColor;
    monthDisplay.style.color = selectedColor;
  });

  // Initialisera årsväljaren
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i < currentYear + 10; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    yearSelect.appendChild(option);
  }

  // Här är en array med månaderna
  const months = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  // Här skapar vi alternativen för månaderna och lägger till dem i monthSelect
  for (let i = 0; i < months.length; i++) {
    const option = document.createElement("option");
    option.value = months[i];
    option.textContent = months[i];
    monthSelect.appendChild(option);
  }
});
