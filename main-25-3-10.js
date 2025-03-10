import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

/**
 * @typedef {'dark' | 'light'} ColorScheme
 */

const SUPABASE_PROJECT_URL = 'https://slbdcomfioobwutlsljm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsYmRjb21maW9vYnd1dGxzbGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTYyNzAsImV4cCI6MjA1NzAzMjI3MH0.TedDkRw-jfbgpexqx8--58guyz8DlozaW7EZifPNcS0'

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY)

const htmlElement = document.getElementsByTagName("html")[0];
const toggleButton = document.getElementById("color-scheme-toggle-btn");

init();

function init() {
  updateUniqueVisitorCountIfNecessary().then(updateUniqueVisitorCountText)

  handleColorScheme()

  toggleButton.onclick = () => toggleTheme()
}

function toggleTheme() {
  const currentColorScheme = htmlElement.style.colorScheme;

  if (currentColorScheme === "dark") {
    setColorScheme("light");
    return;
  }

  setColorScheme("dark");
}

function handleColorScheme() {
  const savedPreference = localStorage.getItem("color-scheme");

  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersLight = matchMedia("(prefers-color-scheme: light)").matches;

  if (savedPreference) {
    setColorScheme(savedPreference);
    return;
  }

  if (prefersDark) {
    setColorScheme("dark");
  }

  if (prefersLight) {
    setColorScheme("light");
  }
}

/**
 * @param {ColorScheme} colorScheme
 */
function setColorScheme(colorScheme) {
  htmlElement.style.colorScheme = colorScheme;
  savePreference(colorScheme);
  setToggleButtonIcon(colorScheme);
}

/**
 * @param {ColorScheme} colorScheme
 */
function savePreference(colorScheme) {
  localStorage.setItem("color-scheme", colorScheme);
}

/**
 * @param {ColorScheme} colorScheme
 */
function setToggleButtonIcon(colorScheme) {
  if (colorScheme === "light") {
    toggleButton.innerHTML = `<svg
          id="dark-mode-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"
          />
        </svg>`;

    return;
  }

  toggleButton.innerHTML = `<svg
          id="light-mode-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"
          />
        </svg>`;
}

function updateUniqueVisitorCountText(count) {
  const countText = `Unique visitors: ${count}`
  const element = document.getElementById('unique-visitor-count')
  element.innerText = countText
}

async function updateUniqueVisitorCountIfNecessary() {
  const visited = localStorage.getItem('visited')

  if (Number(visited) === 1) {
    const {data, error} = await supabase.from('visitor_count').select('count').eq('id', 1).single()

    if (error) {
      console.error(error)
    }

    return data.count
  }

  localStorage.setItem('visited', 1)

  const { data, error } = await supabase.rpc('increase_visitor_count')

  if (error) {
    console.error(error)
  }

  return data[0].count
}