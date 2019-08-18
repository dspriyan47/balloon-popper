const balloonColorPallete = [{ dark: "#ee9ca7", light: "#ffdde1" },
{ dark: "#2193b0", light: "#6dd5ed" },
{ dark: "#373B44", light: "#4286f4" },
{ dark: "#493240", light: "#FF0099" },
{ dark: "#4A00E0", light: "#8E2DE2" },
{ dark: "#1f4037", light: "#99f2c8" },
{ dark: "#b91d73", light: "#f953c6" },
{ dark: "#240b36", light: "#c31432" },
{ dark: "#f12711", light: "#f5af19" },
{ dark: "#654ea3", light: "#eaafc8" },
{ dark: '#00416A', light: '#E4E5E6'}];

const COLOR_ALPHA_LEVELS = {
    100: 'FF', 
    95 : 'F2', 90 : 'E6', 85: 'D9', 80 : 'CC',
    75: 'BF', 70 : 'B3', 65: 'A6', 60: '99',
    55: '8C', 50: '80', 45: '73', 40: '66',
    35: '59', 30: '4D', 25: '40', 20: '33',
    15: '26', 10: '1A', 5: '0D', 0: '00'
};

// -2 is for 1px border that has been added for canvas.
const CANVAS_WIDTH = window.innerWidth - 2;
const CANVAS_HEIGHT = window.innerHeight - 2;

const BALLOON_RADIUS = 55;
const BALLOON_Y_CENTER_THRESHOLD = 100;
const BALLOON_X_CENTER_PARTS = Math.floor(CANVAS_WIDTH/(BALLOON_RADIUS * 2));
// const INITIAL_BALLOON_COUNT = (BALLOON_X_CENTER_PARTS <= 3) ? 2: BALLOON_X_CENTER_PARTS - 2;
const INITIAL_BALLOON_COUNT = 1;

const SPREAD_PARTICLE_COUNT = 10;

const GAME_TIMER_IN_MINUTES = 90;

const CLOUD_COUNT = 20;

const BALLOON_BASE_VELOCITY = 2;

const ID_NOT_SET = 'no_id';