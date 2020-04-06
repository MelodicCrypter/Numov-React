// Delay an effect, wait for a bit
const sleep = ms => new Promise(r => setTimeout(r, ms));

export default sleep;
