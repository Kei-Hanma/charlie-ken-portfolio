const $ = s => document.querySelector(s);


/* =========================
   BASIC SITE FUNCTIONS
========================= */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* Scroll progress */

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;

  const percentage =
    scrollY / Math.max(max, 1) * 100;

  const progress = $("#progress");

  if (progress) {
    progress.style.width = percentage + "%";
  }
});


/* Mobile menu */

const menu = $("#menu");
const navLinks = $("#navLinks");

if (menu && navLinks) {

  menu.addEventListener("click", () => {
    navLinks.classList.toggle("mobile");
  });

  document
    .querySelectorAll("#navLinks a")
    .forEach(a => {

      a.addEventListener("click", () => {
        navLinks.classList.remove("mobile");
      });

    });
}


/* =========================
   MODAL
========================= */

const modal = $("#modal");
const content = $("#modalContent");

let timerInterval = null;


document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.addEventListener("click", closeModal);

  });


function closeModal() {

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  content.innerHTML = "";
}


function openModal(html) {

  content.innerHTML = html;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}


document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});


/* =========================
   SECURITY HELPER
========================= */

function escape(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );

}


/* =========================
   PHONE UI
========================= */

function openPhone(
  title,
  subtitle,
  screen,
  details,
  init
) {

  openModal(`
    <div class="phone-stage">

      <div class="phone">

        <div class="phone-screen">

          <div class="app-status">
            <span id="phoneClock">9:41</span>
            <span>● ● ▰</span>
          </div>

          <div class="app-header">
            <div class="app-brand">${escape(title)}</div>
            <small>${escape(subtitle)}</small>
          </div>

          <div class="app-body">
            ${screen}
          </div>

          <div class="app-bottom">
            <b>⌂ Home</b>
            <span>◫ Activity</span>
            <span>⚙ More</span>
          </div>

        </div>

      </div>


      <div class="mobile-details">

        ${details}

      </div>

    </div>
  `);

  init();

}


/* =========================
   DEMOS
========================= */

const demos = {


  /* =====================
     TASK MANAGER
  ===================== */

  todo: () => {

    openPhone(
      "Task Manager",
      "Kotlin • SQLite • Android concept",

      `
        <div class="app-card">

          <div class="phone-demo-input">

            <input
              class="app-input"
              id="ptodo"
              placeholder="New task…"
              maxlength="80"
            >

            <button
              class="app-btn app-primary"
              id="padd"
              type="button"
            >
              +
            </button>

          </div>

          <div
            id="ptasks"
            class="phone-list"
          ></div>

        </div>

        <div class="app-card">

          <h4>Today</h4>

          <p>
            Organize priorities and mark work complete.
          </p>

        </div>
      `,

      `
        <h3>Task Manager</h3>

        <p>
          A realistic Android-style productivity screen instead of a generic browser widget. Add, complete, and delete tasks directly inside the phone.
        </p>

        <div class="tech">
          <span>CRUD</span>
          <span>SQLite concept</span>
          <span>Android UI</span>
        </div>

        <div class="demo-feature-note">
          Designed to communicate the original project's mobile-app context immediately to recruiters.
        </div>
      `,

      () => {

        let tasks;

        try {
          tasks = JSON.parse(
            localStorage.getItem("ck_tasks") || "[]"
          );
        } catch {
          tasks = [];
        }


        const save = () => {

          localStorage.setItem(
            "ck_tasks",
            JSON.stringify(tasks)
          );

        };


        const render = () => {

          const container = $("#ptasks");

          if (!container) return;


          if (!tasks.length) {

            container.innerHTML = `
              <p style="
                padding:10px;
                color:#9aa2ac;
                font-size:9px
              ">
                No tasks yet — add your first task.
              </p>
            `;

            return;
          }


          container.innerHTML = tasks.map(
            (task, index) => `

              <div class="mini-row">

                <input
                  type="checkbox"
                  data-task-toggle="${index}"
                  ${task.done ? "checked" : ""}
                >

                <span style="
                  flex:1;
                  ${task.done
                    ? "text-decoration:line-through;color:#9aa2ac;"
                    : ""}
                ">
                  ${escape(task.text)}
                </span>

                <button
                  class="app-btn"
                  data-task-delete="${index}"
                  type="button"
                >
                  ×
                </button>

              </div>
            `
          ).join("");

        };


        $("#padd").onclick = () => {

          const input = $("#ptodo");
          const value = input.value.trim();

          if (!value) return;

          tasks.push({
            text: value,
            done: false
          });

          save();

          input.value = "";

          render();

          input.focus();

        };


        $("#ptodo").addEventListener(
          "keydown",
          event => {

            if (event.key === "Enter") {
              $("#padd").click();
            }

          }
        );


        $("#ptasks").addEventListener(
          "click",
          event => {

            const toggle =
              event.target.dataset.taskToggle;

            const remove =
              event.target.dataset.taskDelete;


            if (toggle !== undefined) {

              const index = Number(toggle);

              tasks[index].done =
                !tasks[index].done;

              save();
              render();

            }


            if (remove !== undefined) {

              const index = Number(remove);

              tasks.splice(index, 1);

              save();
              render();

            }

          }
        );


        render();

      }
    );

  },


  /* =====================
     CONTACTS
  ===================== */

  contacts: () => {

    openPhone(
      "Contacts",
      "Android • RecyclerView concept",

      `
        <div class="app-card">

          <input
            class="app-input"
            id="psearch"
            placeholder="Search contacts…"
          >

        </div>

        <div
          id="pcontacts"
          class="phone-list"
        ></div>


        <div class="app-card">

          <input
            class="app-input"
            id="pname"
            placeholder="Name"
            maxlength="50"
          >

          <div style="height:5px"></div>

          <input
            class="app-input"
            id="pphone"
            placeholder="Phone"
            maxlength="30"
          >

          <div style="height:7px"></div>

          <button
            class="app-btn app-primary"
            id="pcontactadd"
            style="width:100%"
            type="button"
          >
            Add contact
          </button>

        </div>
      `,

      `
        <h3>Contact List</h3>

        <p>
          A phone-first contact manager showing search, record creation, and deletion in a familiar Android layout.
        </p>

        <div class="tech">
          <span>RecyclerView</span>
          <span>CRUD</span>
          <span>Mobile UI</span>
        </div>

        <div class="demo-feature-note">
          The interaction is intentionally presented as an app, not a desktop form.
        </div>
      `,

      () => {

        let contacts;

        try {
          contacts = JSON.parse(
            localStorage.getItem("ck_contacts") || "[]"
          );
        } catch {
          contacts = [];
        }


        const save = () => {

          localStorage.setItem(
            "ck_contacts",
            JSON.stringify(contacts)
          );

        };


        const render = () => {

          const query =
            ($("#psearch")?.value || "")
              .toLowerCase()
              .trim();


          const filtered =
            contacts
              .map((contact, originalIndex) => ({
                ...contact,
                originalIndex
              }))
              .filter(contact =>
                (
                  contact.n +
                  " " +
                  contact.p
                )
                  .toLowerCase()
                  .includes(query)
              );


          const container = $("#pcontacts");

          if (!container) return;


          if (!filtered.length) {

            container.innerHTML = `
              <p style="
                padding:10px;
                color:#9aa2ac;
                font-size:9px
              ">
                No contacts found.
              </p>
            `;

            return;
          }


          container.innerHTML =
            filtered.map(contact => `

              <div class="mini-row">

                <span class="avatar">
                  ${escape(
                    (contact.n || "?")[0]
                  )}
                </span>

                <span style="flex:1">

                  <b>
                    ${escape(contact.n)}
                  </b>

                  <br>

                  <small style="color:#9aa2ac">
                    ${escape(
                      contact.p || "No phone"
                    )}
                  </small>

                </span>

                <button
                  class="app-btn"
                  data-contact-delete="${contact.originalIndex}"
                  type="button"
                >
                  ×
                </button>

              </div>

            `).join("");

        };


        $("#psearch").oninput = render;


        $("#pcontactadd").onclick = () => {

          const name =
            $("#pname").value.trim();

          const phone =
            $("#pphone").value.trim();


          if (!name) {

            $("#pname").focus();

            return;
          }


          contacts.push({
            n: name,
            p: phone
          });


          save();


          $("#pname").value = "";
          $("#pphone").value = "";


          render();

          $("#pname").focus();

        };


        $("#pcontacts").onclick = event => {

          const index =
            event.target.dataset.contactDelete;

          if (index === undefined) return;


          contacts.splice(
            Number(index),
            1
          );

          save();

          render();

        };


        render();

      }
    );

  },


  /* =====================
     QUIZ
  ===================== */

  quiz: () => {

    openPhone(
      "Quick Quiz",
      "Kotlin • State + scoring concept",

      `
        <div class="app-card" id="pquiz"></div>
      `,

      `
        <h3>True / False Quiz</h3>

        <p>
          A compact mobile quiz with question state, instant feedback, scoring, and replay.
        </p>

        <div class="tech">
          <span>State</span>
          <span>Scoring</span>
          <span>Android</span>
        </div>

        <div class="demo-feature-note">
          The phone frame makes the original mobile-development context obvious at first glance.
        </div>
      `,

      () => {

        const questions = [

          [
            "RecyclerView is designed for efficiently displaying lists.",
            true
          ],

          [
            "SQLite is a relational database engine.",
            true
          ],

          [
            "Kotlin can be used for Android development.",
            true
          ],

          [
            "CSS is a database language.",
            false
          ],

          [
            "A browser can request location with permission.",
            true
          ]

        ];


        let current = 0;
        let score = 0;


        const showQuestion = () => {

          const container = $("#pquiz");

          if (!container) return;


          if (current >= questions.length) {

            container.innerHTML = `

              <div class="eyebrow" style="
                color:#a27d39
              ">
                FINAL SCORE
              </div>

              <div style="
                font:800 38px Manrope;
                color:#84642c;
                margin:8px 0 15px
              ">
                ${score}/${questions.length}
              </div>

              <button
                class="app-btn app-primary"
                id="pagain"
                type="button"
              >
                Play again
              </button>

            `;


            $("#pagain").onclick = () => {

              current = 0;
              score = 0;

              showQuestion();

            };


            return;
          }


          const question =
            questions[current];


          const percentage =
            current / questions.length * 100;


          container.innerHTML = `

            <p style="
              font-size:9px;
              color:#9aa2ac
            ">
              QUESTION ${current + 1}
              / ${questions.length}
            </p>

            <div class="quiz-progress">
              <span style="
                width:${percentage}%
              "></span>
            </div>

            <div class="quiz-question">
              ${escape(question[0])}
            </div>

            <button
              class="answer"
              data-answer="true"
              type="button"
            >
              True
            </button>

            <button
              class="answer"
              data-answer="false"
              type="button"
            >
              False
            </button>
          `;


          document
            .querySelectorAll("[data-answer]")
            .forEach(button => {

              button.onclick = () => {

                const answer =
                  button.dataset.answer === "true";


                if (answer === question[1]) {
                  score++;
                }


                current++;

                showQuestion();

              };

            });

        };


        showQuestion();

      }
    );

  },


  /* =====================
     WEATHER
  ===================== */

  weather: () => {

    openPhone(
      "Weather",
      "JavaScript • API integration",

      `
        <div class="app-card">

          <div class="phone-demo-input">

            <input
              class="app-input"
              id="pcity"
              value="Manila"
              placeholder="Enter city"
            >

            <button
              class="app-btn app-primary"
              id="pweather"
              type="button"
            >
              Go
            </button>

          </div>

          <div id="pweatherResult">
            <p>
              Search a city to view live conditions.
            </p>
          </div>

        </div>

        <div class="app-card">

          <h4>API-powered</h4>

          <p>
            Uses live geocoding and weather data when connected to the internet.
          </p>

        </div>
      `,

      `
        <h3>Weather Finder</h3>

        <p>
          A mobile-style weather screen backed by a live public API. Search cities and see current temperature, humidity, and wind.
        </p>

        <div class="tech">
          <span>REST API</span>
          <span>JavaScript</span>
          <span>Async</span>
        </div>

        <div class="demo-feature-note">
          This one demonstrates that the portfolio projects aren't static screenshots — they can communicate real API integration.
        </div>
      `,

      () => {

        const searchWeather = async () => {

          const city =
            $("#pcity").value.trim();


          if (!city) return;


          $("#pweatherResult").innerHTML =
            "<p>Loading live data…</p>";


          try {

            const geocodeResponse =
              await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
              );


            if (!geocodeResponse.ok) {
              throw new Error("Geocoding failed");
            }


            const geocode =
              await geocodeResponse.json();


            if (!geocode.results?.length) {

              $("#pweatherResult").innerHTML =
                "<p>City not found.</p>";

              return;
            }


            const location =
              geocode.results[0];


            const weatherResponse =
              await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
              );


            if (!weatherResponse.ok) {
              throw new Error("Weather failed");
            }


            const weather =
              await weatherResponse.json();


            const current =
              weather.current;


            $("#pweatherResult").innerHTML = `

              <div style="
                font:800 28px Manrope;
                color:#15191f
              ">
                ${escape(current.temperature_2m)}
                ${escape(weather.current_units?.temperature_2m || "°C")}
              </div>

              <p>

                <b>
                  ${escape(location.name)}
                </b>,

                ${escape(location.country)}

                <br>

                ${escape(current.relative_humidity_2m)}%
                humidity

                •
                ${escape(current.wind_speed_10m)}
                km/h wind

              </p>

            `;

          } catch (error) {

            console.error(error);

            $("#pweatherResult").innerHTML =
              "<p>Weather service unavailable. Please try again.</p>";

          }

        };


        $("#pweather").onclick =
          searchWeather;


        $("#pcity").addEventListener(
          "keydown",
          event => {

            if (event.key === "Enter") {
              searchWeather();
            }

          }
        );

      }
    );

  },


  /* =====================
     TIC TAC TOE
  ===================== */

  tictactoe: () => {

    openPhone(
      "TicTacToe",
      "Kotlin • Two-player game",

      `
        <div class="ttt-score">

          <div>
            <small>PLAYER X</small>
            <b id="tttScoreX">0</b>
          </div>

          <div>
            <small>DRAWS</small>
            <b id="tttScoreDraw">0</b>
          </div>

          <div>
            <small>PLAYER O</small>
            <b id="tttScoreO">0</b>
          </div>

        </div>


        <div
          class="ttt-turn"
          id="tttTurn"
        >
          Player X's turn
        </div>


        <div
          class="ttt-board"
          id="tttBoard"
        >
        </div>


        <div
          class="ttt-result"
          id="tttResult"
        >
        </div>


        <button
          class="app-btn app-primary"
          id="tttNewGame"
          style="width:100%;margin-top:8px"
          type="button"
        >
          New Game
        </button>
      `,

      `
        <h3>TicTacToe</h3>

        <p>
          A browser recreation of a simple two-player Android game. Play X versus O directly inside the mobile mockup.
        </p>

        <div class="tech">
          <span>Kotlin concept</span>
          <span>Game Logic</span>
          <span>State</span>
        </div>

        <div class="demo-feature-note">
          Includes turn handling, win detection, draw detection, score tracking, and replay.
        </div>
      `,

      () => {

        let board = Array(9).fill("");
        let currentPlayer = "X";
        let gameOver = false;

        let scoreX = 0;
        let scoreO = 0;
        let draws = 0;


        const winningPatterns = [

          [0,1,2],
          [3,4,5],
          [6,7,8],

          [0,3,6],
          [1,4,7],
          [2,5,8],

          [0,4,8],
          [2,4,6]

        ];


        const boardElement =
          $("#tttBoard");

        const turnElement =
          $("#tttTurn");

        const resultElement =
          $("#tttResult");


        const render = () => {

          boardElement.innerHTML =
            board.map(
              (value, index) => `

                <button
                  class="ttt-cell ${value.toLowerCase()}"
                  data-ttt-cell="${index}"
                  type="button"
                  aria-label="Cell ${index + 1}"
                >
                  ${value}
                </button>

              `
            ).join("");


          if (!gameOver) {

            turnElement.textContent =
              `Player ${currentPlayer}'s turn`;

          }

        };


        const updateScore = () => {

          $("#tttScoreX").textContent =
            scoreX;

          $("#tttScoreO").textContent =
            scoreO;

          $("#tttScoreDraw").textContent =
            draws;

        };


        const getWinner = () => {

          for (const pattern of winningPatterns) {

            const [a,b,c] = pattern;


            if (
              board[a] &&
              board[a] === board[b] &&
              board[a] === board[c]
            ) {

              return {
                player: board[a],
                pattern
              };

            }

          }


          if (board.every(Boolean)) {
            return {
              player: "draw",
              pattern: []
            };
          }


          return null;

        };


        const endGame = result => {

          gameOver = true;


          if (result.player === "draw") {

            draws++;

            resultElement.textContent =
              "It's a draw!";

            turnElement.textContent =
              "Game over";

          } else {

            if (result.player === "X") {
              scoreX++;
            } else {
              scoreO++;
            }


            resultElement.textContent =
              `Player ${result.player} wins!`;

            turnElement.textContent =
              `Player ${result.player} wins`;

          }


          result.pattern.forEach(index => {

            const cell =
              document.querySelector(
                `[data-ttt-cell="${index}"]`
              );

            if (cell) {
              cell.classList.add("win");
            }

          });


          updateScore();

        };


        boardElement.onclick = event => {

          const cell =
            event.target.closest(
              "[data-ttt-cell]"
            );


          if (!cell || gameOver) return;


          const index =
            Number(cell.dataset.tttCell);


          if (board[index]) return;


          board[index] =
            currentPlayer;


          render();


          const result =
            getWinner();


          if (result) {

            endGame(result);

            return;
          }


          currentPlayer =
            currentPlayer === "X"
              ? "O"
              : "X";


          render();

        };


        $("#tttNewGame").onclick = () => {

          board = Array(9).fill("");

          currentPlayer = "X";

          gameOver = false;

          resultElement.textContent = "";

          render();

        };


        updateScore();
        render();

      }
    );

  },


  /* =====================
     MAD TIMER
  ===================== */

  madtimer: () => {

    openPhone(
      "MadTimer",
      "Kotlin • Countdown timer",

      `
        <div class="app-card">

          <div class="timer-display" id="timerDisplay">
            00:01:00
          </div>

          <div
            class="timer-status"
            id="timerStatus"
          >
            Ready
          </div>

        </div>


        <div class="app-card">

          <div class="timer-inputs">

            <div>
              <label for="timerMinutes">
                MINUTES
              </label>

              <input
                class="app-input"
                id="timerMinutes"
                type="number"
                min="0"
                max="999"
                value="1"
              >
            </div>


            <div>
              <label for="timerSeconds">
                SECONDS
              </label>

              <input
                class="app-input"
                id="timerSeconds"
                type="number"
                min="0"
                max="59"
                value="0"
              >
            </div>

          </div>


          <div class="timer-controls">

            <button
              class="app-btn app-primary"
              id="timerStart"
              type="button"
            >
              Start
            </button>

            <button
              class="app-btn"
              id="timerPause"
              type="button"
            >
              Pause
            </button>

            <button
              class="app-btn"
              id="timerReset"
              type="button"
            >
              Reset
            </button>

          </div>

        </div>
      `,

      `
        <h3>MadTimer</h3>

        <p>
          A mobile countdown timer recreated from the Android project concept. Set a duration and control the countdown without leaving the portfolio.
        </p>

        <div class="tech">
          <span>Kotlin concept</span>
          <span>Timer</span>
          <span>State</span>
        </div>

        <div class="demo-feature-note">
          Supports configurable duration, start, pause, reset, and automatic completion.
        </div>
      `,

      () => {

        let remaining = 60;
        let running = false;


        const display =
          $("#timerDisplay");

        const status =
          $("#timerStatus");


        const minutesInput =
          $("#timerMinutes");

        const secondsInput =
          $("#timerSeconds");


        const formatTime = total => {

          const hours =
            Math.floor(total / 3600);

          const minutes =
            Math.floor(
              (total % 3600) / 60
            );

          const seconds =
            total % 60;


          return [
            hours,
            minutes,
            seconds
          ]
            .map(
              value =>
                String(value).padStart(2, "0")
            )
            .join(":");

        };


        const updateDisplay = () => {

          display.textContent =
            formatTime(remaining);

        };


        const readInputs = () => {

          let minutes =
            Number(minutesInput.value) || 0;

          let seconds =
            Number(secondsInput.value) || 0;


          minutes =
            Math.max(
              0,
              Math.min(999, Math.floor(minutes))
            );

          seconds =
            Math.max(
              0,
              Math.min(59, Math.floor(seconds))
            );


          minutesInput.value = minutes;
          secondsInput.value = seconds;


          remaining =
            minutes * 60 + seconds;


          updateDisplay();

        };


        const stopTimer = () => {

          if (timerInterval) {

            clearInterval(timerInterval);

            timerInterval = null;

          }

          running = false;

        };


        $("#timerStart").onclick = () => {

          if (running) return;


          if (remaining <= 0) {

            readInputs();

          }


          if (remaining <= 0) {

            status.textContent =
              "Set a duration first.";

            return;

          }


          running = true;

          status.textContent =
            "Running…";


          timerInterval =
            setInterval(() => {

              remaining--;

              updateDisplay();


              if (remaining <= 0) {

                stopTimer();

                remaining = 0;

                updateDisplay();

                status.textContent =
                  "Time's up!";

              }

            }, 1000);

        };


        $("#timerPause").onclick = () => {

          if (!running) return;


          stopTimer();

          status.textContent =
            "Paused";

        };


        $("#timerReset").onclick = () => {

          stopTimer();

          readInputs();

          status.textContent =
            "Ready";

        };


        minutesInput.addEventListener(
          "input",
          () => {

            if (!running) {
              readInputs();
            }

          }
        );


        secondsInput.addEventListener(
          "input",
          () => {

            if (!running) {
              readInputs();
            }

          }
        );


        readInputs();

      }
    );

  },


  /* =====================
     MAP LOCATION
  ===================== */

  maplocation: () => {

    openPhone(
      "MapLocation",
      "Kotlin • Location / Maps concept",

      `
        <div class="app-card">

          <div
            class="map-card"
            id="mapCard"
          >

            <div class="map-road one"></div>
            <div class="map-road two"></div>
            <div class="map-road three"></div>


            <span class="map-label a">
              NORTH AVE
            </span>

            <span class="map-label b">
              MARKET ST
            </span>

            <span class="map-label c">
              RIVER ROAD
            </span>


            <div
              class="map-marker"
              id="mapMarker"
              title="Drag/click to move location"
            ></div>


            <div class="map-controls">

              <button
                id="mapZoomIn"
                type="button"
                aria-label="Zoom in"
              >
                +
              </button>

              <button
                id="mapZoomOut"
                type="button"
                aria-label="Zoom out"
              >
                −
              </button>

              <button
                id="mapCenter"
                type="button"
                aria-label="Center location"
              >
                ◎
              </button>

            </div>

          </div>


          <div class="location-readout">

            <span>
              Selected:
              <b id="mapCoordinates">
                50%, 50%
              </b>
            </span>

          </div>


          <p class="map-help">
            Tap anywhere on the map to move the location marker.
          </p>

        </div>


        <div class="app-card">

          <h4>Location Demo</h4>

          <p>
            Interactive browser recreation of a mobile map/location interface.
          </p>

        </div>
      `,

      `
        <h3>MapLocation</h3>

        <p>
          A browser recreation of a Kotlin location/map concept. Move the marker, zoom the map, and return it to the center.
        </p>

        <div class="tech">
          <span>Kotlin concept</span>
          <span>Location</span>
          <span>Maps UI</span>
        </div>

        <div class="demo-feature-note">
          This version uses a lightweight interactive map surface, so the demo works without requiring a Google Maps API key.
        </div>
      `,

      () => {

        const map =
          $("#mapCard");

        const marker =
          $("#mapMarker");

        const coordinates =
          $("#mapCoordinates");


        let markerX = 50;
        let markerY = 50;

        let zoom = 1;


        const updateMarker = () => {

          marker.style.left =
            markerX + "%";

          marker.style.top =
            markerY + "%";


          coordinates.textContent =
            `${markerX.toFixed(0)}%, ${markerY.toFixed(0)}%`;

        };


        const moveMarker = event => {

          const rect =
            map.getBoundingClientRect();


          let x =
            (event.clientX - rect.left)
            / rect.width
            * 100;


          let y =
            (event.clientY - rect.top)
            / rect.height
            * 100;


          x =
            Math.max(
              5,
              Math.min(95, x)
            );

          y =
            Math.max(
              8,
              Math.min(95, y)
            );


          markerX = x;
          markerY = y;


          updateMarker();

        };


        map.addEventListener(
          "click",
          event => {

            if (
              event.target.closest(".map-controls") ||
              event.target === marker
            ) {
              return;
            }


            moveMarker(event);

          }
        );


        marker.addEventListener(
          "pointerdown",
          event => {

            event.stopPropagation();

            marker.setPointerCapture(
              event.pointerId
            );


            const move = moveEvent => {

              const rect =
                map.getBoundingClientRect();


              let x =
                (moveEvent.clientX - rect.left)
                / rect.width
                * 100;


              let y =
                (moveEvent.clientY - rect.top)
                / rect.height
                * 100;


              markerX =
                Math.max(
                  5,
                  Math.min(95, x)
                );

              markerY =
                Math.max(
                  8,
                  Math.min(95, y)
                );


              updateMarker();

            };


            const stop = () => {

              marker.removeEventListener(
                "pointermove",
                move
              );

              marker.removeEventListener(
                "pointerup",
                stop
              );

            };


            marker.addEventListener(
              "pointermove",
              move
            );

            marker.addEventListener(
              "pointerup",
              stop
            );

          }
        );


        const applyZoom = () => {

          const roads =
            map.querySelectorAll(
              ".map-road"
            );

          roads.forEach(road => {

            road.style.transform =
              `scale(${zoom})`;

          });

        };


        $("#mapZoomIn").onclick = () => {

          zoom =
            Math.min(
              1.8,
              zoom + .1
            );

          applyZoom();

        };


        $("#mapZoomOut").onclick = () => {

          zoom =
            Math.max(
              .8,
              zoom - .1
            );

          applyZoom();

        };


        $("#mapCenter").onclick = () => {

          markerX = 50;
          markerY = 50;

          zoom = 1;

          updateMarker();
          applyZoom();

        };


        updateMarker();
        applyZoom();

      }
    );

  }

};


/* =========================
   DEMO BUTTONS
========================= */

document
  .querySelectorAll(".demo")
  .forEach(card => {

    const button =
      card.querySelector("button");


    if (!button) return;


    button.addEventListener(
      "click",
      () => {

        const demoName =
          card.dataset.demo;


        if (
          demos[demoName] &&
          typeof demos[demoName] === "function"
        ) {

          demos[demoName]();

        }

      }
    );

  });
